import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatMessage,
  ClientToServerMessage,
  RemotePlayer,
  ServerToClientMessage,
  TransportMode,
} from '../types/game';
import { soundEngine } from '../utils/audio';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface JoinSessionConfig {
  name: string;
  color: string;
  roomCode: string;
  x: number;
  y: number;
  zoneName: string;
  vehicle?: TransportMode;
  stampsCount: number;
  dishesCount: number;
  gigsCompleted: number;
}

export function useMultiplayer() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selfId, setSelfId] = useState<string | null>(null);
  const [activeRoomCode, setActiveRoomCode] = useState<string>('PUBLIC-NCR');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [remotePlayersList, setRemotePlayersList] = useState<RemotePlayer[]>([]);

  // Mutable map for 60fps Canvas rendering without triggering React re-renders on every tick
  const remotePlayersMapRef = useRef<Map<string, RemotePlayer>>(new Map());
  const selfSpeechRef = useRef<{ text: string; expiresAt: number } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const joinConfigRef = useRef<JoinSessionConfig | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const shouldConnectRef = useRef(false);
  const lastMoveSentAtRef = useRef(0);
  const selfIdRef = useRef<string | null>(null);

  const syncRosterState = useCallback(() => {
    setRemotePlayersList(Array.from(remotePlayersMapRef.current.values()));
  }, []);

  const sendRaw = useCallback((msg: ClientToServerMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const connectSocket = useCallback(() => {
    if (!shouldConnectRef.current || !joinConfigRef.current) return;
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      if (joinConfigRef.current) {
        sendRaw({
          type: 'player:join',
          payload: joinConfigRef.current,
        });
      }
    };

    ws.onmessage = (event) => {
      let msg: ServerToClientMessage;
      try {
        msg = JSON.parse(event.data as string) as ServerToClientMessage;
      } catch {
        return;
      }

      if (msg.type === 'world:init') {
        selfIdRef.current = msg.payload.selfId;
        setSelfId(msg.payload.selfId);
        setActiveRoomCode(msg.payload.roomCode);
        setChatMessages(msg.payload.chatHistory);

        const nextMap = new Map<string, RemotePlayer>();
        for (const p of msg.payload.players) {
          if (p.id === msg.payload.selfId) continue;
          nextMap.set(p.id, {
            ...p,
            targetX: p.x,
            targetY: p.y,
          });
        }
        remotePlayersMapRef.current = nextMap;
        syncRosterState();
      } else if (msg.type === 'player:joined') {
        const p = msg.payload;
        if (p.id === selfIdRef.current) return;
        if (!remotePlayersMapRef.current.has(p.id)) {
          remotePlayersMapRef.current.set(p.id, {
            ...p,
            targetX: p.x,
            targetY: p.y,
          });
          syncRosterState();
        }
      } else if (msg.type === 'player:left') {
        if (remotePlayersMapRef.current.delete(msg.payload.id)) {
          syncRosterState();
        }
      } else if (msg.type === 'player:moved') {
        const { id, x, y, facing, zoneName, vehicle } = msg.payload;
        const existing = remotePlayersMapRef.current.get(id);
        if (existing) {
          existing.targetX = x;
          existing.targetY = y;
          existing.facing = facing;
          if (vehicle) existing.vehicle = vehicle;
          if (existing.zoneName !== zoneName) {
            existing.zoneName = zoneName;
            syncRosterState();
          }
        }
      } else if (msg.type === 'player:statsUpdated') {
        const existing = remotePlayersMapRef.current.get(msg.payload.id);
        if (existing) {
          existing.stampsCount = msg.payload.stampsCount;
          existing.dishesCount = msg.payload.dishesCount;
          existing.gigsCompleted = msg.payload.gigsCompleted ?? existing.gigsCompleted;
          syncRosterState();
        }
      } else if (msg.type === 'chat:message') {
        const incoming = msg.payload;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev;
          const next = [...prev, incoming];
          return next.length > 80 ? next.slice(next.length - 80) : next;
        });

        if (incoming.kind === 'chat') {
          if (incoming.senderId === selfIdRef.current) {
            selfSpeechRef.current = {
              text: incoming.text,
              expiresAt: performance.now() + 4500,
            };
          } else {
            const sender = remotePlayersMapRef.current.get(incoming.senderId);
            if (sender) {
              sender.speechText = incoming.text;
              sender.speechExpiresAt = performance.now() + 4500;
            }
            soundEngine.playChatPing();
          }
        }
      } else if (msg.type === 'player:emoted') {
        const { id, label } = msg.payload;
        if (id === selfIdRef.current) {
          selfSpeechRef.current = {
            text: label,
            expiresAt: performance.now() + 3200,
          };
        } else {
          const sender = remotePlayersMapRef.current.get(id);
          if (sender) {
            sender.speechText = label;
            sender.speechExpiresAt = performance.now() + 3200;
          }
        }
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      wsRef.current = null;
      if (shouldConnectRef.current) {
        if (reconnectTimerRef.current !== null) {
          window.clearTimeout(reconnectTimerRef.current);
        }
        reconnectTimerRef.current = window.setTimeout(() => {
          connectSocket();
        }, 2000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [sendRaw, syncRosterState]);

  const joinRoom = useCallback(
    (config: JoinSessionConfig) => {
      joinConfigRef.current = config;
      shouldConnectRef.current = true;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendRaw({ type: 'player:join', payload: config });
      } else {
        connectSocket();
      }
    },
    [connectSocket, sendRaw]
  );

  const disconnect = useCallback(() => {
    shouldConnectRef.current = false;
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    remotePlayersMapRef.current.clear();
    setRemotePlayersList([]);
    setChatMessages([]);
    setSelfId(null);
    selfIdRef.current = null;
    setStatus('disconnected');
  }, []);

  const sendMove = useCallback(
    (
      x: number,
      y: number,
      facing: number,
      zoneName: string,
      force = false,
      vehicle: TransportMode = 'walk'
    ) => {
      if (joinConfigRef.current) {
        joinConfigRef.current.x = x;
        joinConfigRef.current.y = y;
        joinConfigRef.current.zoneName = zoneName;
        joinConfigRef.current.vehicle = vehicle;
      }
      const now = performance.now();
      if (!force && now - lastMoveSentAtRef.current < 50) return;
      lastMoveSentAtRef.current = now;
      sendRaw({
        type: 'player:move',
        payload: { x, y, facing, zoneName, vehicle },
      });
    },
    [sendRaw]
  );

  const sendStats = useCallback(
    (stampsCount: number, dishesCount: number, gigsCompleted: number) => {
      if (joinConfigRef.current) {
        joinConfigRef.current.stampsCount = stampsCount;
        joinConfigRef.current.dishesCount = dishesCount;
        joinConfigRef.current.gigsCompleted = gigsCompleted;
      }
      sendRaw({
        type: 'player:stats',
        payload: { stampsCount, dishesCount, gigsCompleted },
      });
    },
    [sendRaw]
  );

  const sendChat = useCallback(
    (text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      const id = `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      sendRaw({
        type: 'player:chat',
        payload: { id, text: cleaned },
      });
    },
    [sendRaw]
  );

  const sendEmote = useCallback(
    (label: string) => {
      const id = `emo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      selfSpeechRef.current = {
        text: label,
        expiresAt: performance.now() + 3200,
      };
      sendRaw({
        type: 'player:emote',
        payload: { id, label },
      });
    },
    [sendRaw]
  );

  const sendActivity = useCallback(
    (text: string) => {
      const id = `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      sendRaw({
        type: 'player:activity',
        payload: { id, text },
      });
    },
    [sendRaw]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    selfId,
    activeRoomCode,
    chatMessages,
    remotePlayersList,
    remotePlayersMapRef,
    selfSpeechRef,
    joinRoom,
    disconnect,
    sendMove,
    sendStats,
    sendChat,
    sendEmote,
    sendActivity,
  };
}
