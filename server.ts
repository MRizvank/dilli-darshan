import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocket, WebSocketServer } from 'ws';
import type {
  ChatMessage,
  ClientToServerMessage,
  ServerToClientMessage,
  TransportMode,
} from './src/types/game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PUBLIC_ROOM_CODE = 'PUBLIC-NCR';
const MAX_CHAT_HISTORY = 60;

interface ServerPlayer {
  id: string;
  name: string;
  color: string;
  roomCode: string;
  x: number;
  y: number;
  facing: number;
  zoneName: string;
  vehicle: TransportMode;
  stampsCount: number;
  dishesCount: number;
  gigsCompleted: number;
  ws: WebSocket;
}

interface RoomState {
  code: string;
  players: Map<string, ServerPlayer>;
  chatHistory: ChatMessage[];
}

const rooms = new Map<string, RoomState>();

function normalizeRoomCode(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12);
  if (!cleaned || cleaned === 'PUBLIC' || cleaned === 'PUBLIC-NCR') {
    return PUBLIC_ROOM_CODE;
  }
  return cleaned;
}

function getOrCreateRoom(code: string): RoomState {
  const normalized = normalizeRoomCode(code);
  let room = rooms.get(normalized);
  if (!room) {
    room = {
      code: normalized,
      players: new Map(),
      chatHistory: [],
    };
    rooms.set(normalized, room);
  }
  return room;
}

function sanitizeText(raw: string, maxLen: number): string {
  return raw.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

function sendToSocket(ws: WebSocket, msg: ServerToClientMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function broadcastToRoom(
  room: RoomState,
  msg: ServerToClientMessage,
  excludePlayerId?: string
): void {
  const payload = JSON.stringify(msg);
  for (const player of room.players.values()) {
    if (excludePlayerId && player.id === excludePlayerId) continue;
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(payload);
    }
  }
}

function pushRoomChat(room: RoomState, message: ChatMessage): void {
  if (room.chatHistory.some((m) => m.id === message.id)) return;
  room.chatHistory.push(message);
  if (room.chatHistory.length > MAX_CHAT_HISTORY) {
    room.chatHistory.splice(0, room.chatHistory.length - MAX_CHAT_HISTORY);
  }
  broadcastToRoom(room, { type: 'chat:message', payload: message });
}

function createPlayerId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json());

  // Health and live room summary API
  app.get('/api/rooms/summary', (_req, res) => {
    const publicRoom = rooms.get(PUBLIC_ROOM_CODE);
    let totalOnline = 0;
    for (const r of rooms.values()) {
      totalOnline += r.players.size;
    }
    res.json({
      publicPlayers: publicRoom ? publicRoom.players.size : 0,
      totalOnline,
      activeRooms: Array.from(rooms.values()).filter((r) => r.players.size > 0).length,
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const reqUrl = request.url ?? '';
    if (reqUrl === '/ws' || reqUrl.startsWith('/ws?')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else if (process.env.NODE_ENV === 'production') {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    const playerId = createPlayerId();
    let currentPlayer: ServerPlayer | null = null;

    const leaveCurrentRoom = () => {
      if (!currentPlayer) return;
      const room = rooms.get(currentPlayer.roomCode);
      if (room) {
        room.players.delete(currentPlayer.id);
        broadcastToRoom(room, {
          type: 'player:left',
          payload: { id: currentPlayer.id, name: currentPlayer.name },
        });
        pushRoomChat(room, {
          id: `sys_${Date.now()}_${currentPlayer.id}`,
          senderId: 'system',
          senderName: 'Delhi NCR',
          senderColor: '#64748B',
          text: `${currentPlayer.name} left the route.`,
          timestamp: Date.now(),
          kind: 'system',
        });
        if (room.players.size === 0 && room.code !== PUBLIC_ROOM_CODE) {
          rooms.delete(room.code);
        }
      }
      currentPlayer = null;
    };

    ws.on('message', (raw) => {
      let parsed: ClientToServerMessage;
      try {
        parsed = JSON.parse(raw.toString()) as ClientToServerMessage;
      } catch {
        return;
      }

      if (parsed.type === 'player:join') {
        leaveCurrentRoom();
        const {
          name,
          color,
          roomCode,
          x,
          y,
          zoneName,
          vehicle,
          stampsCount,
          dishesCount,
          gigsCompleted,
        } = parsed.payload;

        const cleanName = sanitizeText(name || 'Traveller', 20) || 'Traveller';
        const cleanColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#C84B31';
        const normalizedRoom = normalizeRoomCode(roomCode || PUBLIC_ROOM_CODE);
        const room = getOrCreateRoom(normalizedRoom);
        const cleanVehicle: TransportMode =
          vehicle === 'bike' || vehicle === 'auto' || vehicle === 'car' ? vehicle : 'walk';

        const clampedX = Math.max(40, Math.min(4360, Number.isFinite(x) ? x : 1900));
        const clampedY = Math.max(40, Math.min(3360, Number.isFinite(y) ? y : 1450));

        const player: ServerPlayer = {
          id: playerId,
          name: cleanName,
          color: cleanColor,
          roomCode: room.code,
          x: clampedX,
          y: clampedY,
          facing: 0,
          zoneName: sanitizeText(zoneName || 'Connaught Place', 40),
          vehicle: cleanVehicle,
          stampsCount: Math.max(0, Math.floor(stampsCount || 0)),
          dishesCount: Math.max(0, Math.floor(dishesCount || 0)),
          gigsCompleted: Math.max(0, Math.floor(gigsCompleted || 0)),
          ws,
        };

        room.players.set(playerId, player);
        currentPlayer = player;

        // Send full initial state to joining client
        sendToSocket(ws, {
          type: 'world:init',
          payload: {
            selfId: playerId,
            roomCode: room.code,
            players: Array.from(room.players.values()).map((p) => ({
              id: p.id,
              name: p.name,
              color: p.color,
              x: p.x,
              y: p.y,
              facing: p.facing,
              zoneName: p.zoneName,
              vehicle: p.vehicle,
              stampsCount: p.stampsCount,
              dishesCount: p.dishesCount,
              gigsCompleted: p.gigsCompleted,
            })),
            chatHistory: room.chatHistory,
          },
        });

        // Broadcast join to others in the same room
        broadcastToRoom(
          room,
          {
            type: 'player:joined',
            payload: {
              id: player.id,
              name: player.name,
              color: player.color,
              x: player.x,
              y: player.y,
              facing: player.facing,
              zoneName: player.zoneName,
              vehicle: player.vehicle,
              stampsCount: player.stampsCount,
              dishesCount: player.dishesCount,
              gigsCompleted: player.gigsCompleted,
            },
          },
          playerId
        );

        pushRoomChat(room, {
          id: `join_${Date.now()}_${player.id}`,
          senderId: 'system',
          senderName: 'Delhi NCR',
          senderColor: '#64748B',
          text: `${player.name} arrived in ${player.zoneName}.`,
          timestamp: Date.now(),
          kind: 'system',
        });
        return;
      }

      if (!currentPlayer) return;
      const room = rooms.get(currentPlayer.roomCode);
      if (!room) return;

      if (parsed.type === 'player:move') {
        const { x, y, facing, zoneName, vehicle } = parsed.payload;
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        currentPlayer.x = Math.max(30, Math.min(4370, x));
        currentPlayer.y = Math.max(30, Math.min(3370, y));
        currentPlayer.facing = Number.isFinite(facing) ? facing : 0;
        currentPlayer.zoneName = sanitizeText(zoneName || currentPlayer.zoneName, 40);
        if (vehicle === 'walk' || vehicle === 'bike' || vehicle === 'auto' || vehicle === 'car') {
          currentPlayer.vehicle = vehicle;
        }

        broadcastToRoom(
          room,
          {
            type: 'player:moved',
            payload: {
              id: currentPlayer.id,
              x: currentPlayer.x,
              y: currentPlayer.y,
              facing: currentPlayer.facing,
              zoneName: currentPlayer.zoneName,
              vehicle: currentPlayer.vehicle,
            },
          },
          currentPlayer.id
        );
      } else if (parsed.type === 'player:stats') {
        currentPlayer.stampsCount = Math.max(0, Math.floor(parsed.payload.stampsCount || 0));
        currentPlayer.dishesCount = Math.max(0, Math.floor(parsed.payload.dishesCount || 0));
        currentPlayer.gigsCompleted = Math.max(0, Math.floor(parsed.payload.gigsCompleted || 0));
        broadcastToRoom(
          room,
          {
            type: 'player:statsUpdated',
            payload: {
              id: currentPlayer.id,
              stampsCount: currentPlayer.stampsCount,
              dishesCount: currentPlayer.dishesCount,
              gigsCompleted: currentPlayer.gigsCompleted,
            },
          },
          currentPlayer.id
        );
      } else if (parsed.type === 'player:chat') {
        const text = sanitizeText(parsed.payload.text, 160);
        const msgId = sanitizeText(parsed.payload.id, 64);
        if (!text || !msgId) return;
        pushRoomChat(room, {
          id: msgId,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          senderColor: currentPlayer.color,
          text,
          timestamp: Date.now(),
          kind: 'chat',
        });
      } else if (parsed.type === 'player:emote') {
        const label = sanitizeText(parsed.payload.label, 32);
        if (!label) return;
        broadcastToRoom(room, {
          type: 'player:emoted',
          payload: {
            id: currentPlayer.id,
            senderName: currentPlayer.name,
            label,
          },
        });
      } else if (parsed.type === 'player:activity') {
        const text = sanitizeText(parsed.payload.text, 140);
        const msgId = sanitizeText(parsed.payload.id, 64);
        if (!text || !msgId) return;
        pushRoomChat(room, {
          id: msgId,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          senderColor: currentPlayer.color,
          text: `${currentPlayer.name} ${text}`,
          timestamp: Date.now(),
          kind: 'activity',
        });
      }
    });

    ws.on('close', () => {
      leaveCurrentRoom();
    });

    ws.on('error', () => {
      leaveCurrentRoom();
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Dilli Darshan server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
