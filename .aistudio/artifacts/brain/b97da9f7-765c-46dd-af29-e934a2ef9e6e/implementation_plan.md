# Dilli Darshan — Delhi NCR Multiplayer Explorer

**Dilli Darshan** is a real-time multiplayer 2D top-down exploration game set across an illustrated map of Delhi NCR, where players wander between iconic neighborhoods, ride the Delhi Metro, collect heritage monument stamps, sample famous local dishes at real INR prices, and chat together in a shared world or private friend rooms.

---

### User Review & Critical Decisions

> [!IMPORTANT] All core gameplay, visual style, multiplayer, and economy choices have been confirmed from your answers. Review the summary below and click **Proceed** to begin building, or suggest any adjustments.

- **Confirmed Visual Style**: **2D Top-Down Illustrated Delhi NCR World Map** rendered on a smooth 60fps HTML5 Canvas with recognizable NCR geography (Yamuna River, Ridge parks, Metro lines, and distinct architectural landmarks).
- **Confirmed Gameplay Loop**: **Free-Roam Exploration with Heritage Stamps & Food Quests**, anchored by a searchable NCR Directory of places, Metro stations, monuments, and restaurant menus.
- **Confirmed Multiplayer Mode**: **Shared Live World + Private Room Codes with Live Chat**, powered by a real-time WebSocket server with visible player avatars, floating speech bubbles, and room-isolated presence.
- **Confirmed Economy**: **Rupee (`₹`) Budget Earned from Quests** to pay for Metro fares (`₹10`–`₹60`), monument entry tickets, and famous street food & restaurant dishes.

---

### 1. Overview & Core Concept

- **What It Does**: Players spawn into a living, top-down illustrated map spanning Old Delhi, Central/Lutyens' Delhi, South Delhi, Noida, and Gurugram. Using `WASD` / Arrow keys (or click/tap-to-move), players roam streets, enter Metro stations to fast-travel across four color-coded Delhi Metro lines, visit heritage sites to stamp their Heritage Passport, dine at legendary restaurants and street stalls to restore Energy, complete curated food & heritage trails for Rupee payouts, and interact with other live players in real time.
- **Target Audience**: Casual explorers, Delhi NCR locals and enthusiasts, and friend groups looking for a cozy, culturally authentic multiplayer hangout and discovery game.
- **Key Value**: Combines an accurate, price-grounded guide to Delhi NCR's places, Metro network, heritages, and iconic eateries with tactile 2D top-down exploration and genuine multi-user presence.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Title Screen**: Full-viewport live-world camera panning gently over the Delhi NCR map (showing glowing Metro trains gliding along tracks and landmarks) behind a clean editorial lockup. Players enter a display name, pick an avatar token color, choose **Public NCR World** or enter/generate a **Private Room Code**, and press **Start Exploring** (`Enter`).
  2. **Free-Roam Exploration**: Players move smoothly across roads, plazas, bridges, and parks (`Shift` to sprint, consuming Energy). Proximity prompts (`Press E` or clickable action button) appear when standing beside a Monument, Restaurant, or Metro Station.
  3. **Directory & Wayfinding (`Tab`)**: A sleek slide-over **NCR Directory** lists all Places, Metro Stations, Heritages, and Famous Restaurants with full dish menus and `₹` prices. Clicking any entry highlights it with a pulsing compass beacon on the map.
  4. **Metro Fast-Travel (`M` or Station Entry)**: Entering any Metro Station opens the **Delhi Metro Transit Card** showing the station's lines (Yellow, Blue, Violet, Magenta/Rapid), reachable destinations, interchange info, and exact fare (`₹10`–`₹60`). Purchasing a ticket animates a crisp train ride to the destination station.
  5. **Dining & Heritage Stamping**: At a restaurant, players browse its famous menu (e.g., *Karim's Mutton Korma — ₹380*, *Paranthe Wali Gali Rabri Parantha — ₹140*) and order dishes to restore Energy and log them in their **Foodie Journal**. At heritages, players pay any ticket fee (`Free` or `₹35`), read historical lore, and earn an embossed **Heritage Stamp**.
  6. **Multiplayer Presence & Chat**: Other players in the same room appear on the canvas with colored rickshaw/explorer tokens, nameplates, emote bursts, and floating chat speech bubbles above their heads, synced with a collapsible room chat panel.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm Mughal-sandstone & heritage-cartography illustration—tactile map paper, crisp architectural silhouettes, and vibrant Metro line ribbons rather than dark neon clichés.
  - *Color Palette & Mood*:
    - **60% Dominant Map Canvas**: Warm limestone & parchment ground (`#F3EBDD`), soft Yamuna river teal (`#5B9AA9`), and Ridge/Lodhi park sage (`#4D7C5B`).
    - **30% Structural Surfaces**: Crisp cream-white HUD cards (`#FFFDF9`), subtle sandstone borders (`#E2D5C3`), and deep slate-charcoal ink (`#1E293B`).
    - **10% Focal Accents**: Red Fort terracotta (`#C84B31`), saffron street-food amber (`#D97706`), and authentic Delhi Metro line hues (Yellow `#EAB308`, Blue `#2563EB`, Violet `#7C3AED`, Magenta `#DB2777`).
  - *Typography & Hierarchy*: `Fraunces` for heritage titles and landmark headers, `Plus Jakarta Sans` for crisp UI controls and lore, and `JetBrains Mono` (`tabular-nums`) for Rupee wallet balances (`₹500`), menu prices, energy meters, and room codes.
  - *HUD Restraint*: At least 85% of the viewport remains open map canvas. Corner perimeter clusters show Wallet (`₹`), Energy bar, Passport/Quest progress, active Room badge + player count, and a subtle control hint bar. No decorative pulsing dots or bloated navbars.
- **Interactive Feedback & Motion**:
  - Procedural Web Audio API sound effects (soft footsteps, Metro station chime, coin/Rupee clink, stamp thud, food sizzle, chat ping) with a persistent Mute toggle.
  - Pooled canvas particle bursts on stamping monuments, eating food, or arriving via Metro, plus smooth camera interpolation and subtle zoom (`+`/`-` or scroll wheel).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Custom 2D HTML5 Canvas World vs. Tile-Library Engine**
  - *Chosen Approach*: Dedicated 60fps HTML5 `<canvas>` renderer decoupled from React state via refs, using a rich procedural/vector cartographic renderer paired with generated landmark emblem/key art assets.
  - *Why*: Keeps React HUD re-renders from impacting 60fps movement, supports smooth zooming/panning across all of Delhi NCR (from Gurugram to Noida to Old Delhi), and guarantees crisp scaling on any screen size.
  - *Alternatives Considered*: DOM-only grid (less fluid for free-roam wandering) or heavy game engine wrappers (unnecessary bundle overhead for top-down exploration).
- **Decision 2: Real-Time Server-Authoritative WebSockets (`ws`) vs. Client-Only Polling/Mocking**
  - *Chosen Approach*: Express + `ws` WebSocket server running on port 3000 alongside the app, managing authoritative room rosters, player coordinates, chat logs, and milestone broadcasts.
  - *Why*: Enables true simultaneous multi-user sessions across browser tabs and devices with instant movement interpolation, speech bubbles, and isolated private room codes.
  - *Alternatives Considered*: Simulated NPCs or `localStorage` broadcast channels (cannot connect real remote users).
- **Decision 3: Session-Scoped Server State + Local Explorer Backup vs. Mandatory Login Gate**
  - *Chosen Approach*: Instant join with nickname, avatar color, and room code (no account sign-up wall), backed by server room state during live play and `localStorage` persistence for the player's personal Passport & Foodie Journal across reloads.
  - *Why*: Lets friends jump into a shared Delhi NCR room in under 5 seconds while preserving exploration progress.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         Client Browser (React + Canvas)                   │
│                                                                           │
│  ┌─────────────────────┐    ┌─────────────────────┐   ┌────────────────┐  │
│  │  Game Shell & Modals│    │ Isolated 60fps Map  │   │  Web Audio FX  │  │
│  │  • Title / Lobby    │◄──►│  • World Renderer   │   │  • Metro Chime │  │
│  │  • Metro Transit UI │    │  • Player Tokens    │   │  • Stamp/Coins │  │
│  │  • Restaurant Menus │    │  • Speech Bubbles   │   └────────────────┘  │
│  │  • Heritage Stamp   │    │  • Particle Bursts  │                       │
│  │  • NCR Directory    │    └──────────┬──────────┘                       │
│  │  • Live Room Chat   │               │ 20Hz Move / Actions              │
│  └──────────┬──────────┘               ▼                                  │
│             └────────────────►┌───────────────────┐                       │
│                               │ WebSocket Client  │                       │
│                               │ (Auto-Reconnect)  │                       │
└───────────────────────────────┴─────────┬─────────┴───────────────────────┘
                                          │ WS (/ws) + HTTP (:3000)
                                          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    Node.js Express + WebSocket Server                     │
│                                                                           │
│  ┌─────────────────────┐    ┌─────────────────────┐   ┌────────────────┐  │
│  │  Room Manager       │    │ Authoritative State │   │ Static / Vite  │  │
│  │  • "public-ncr"     │◄──►│  • Active Players   │   │ Middleware     │  │
│  │  • Private Codes    │    │  • Positions & Zone │   │ (Port 3000)    │  │
│  │  • Room Chat Log    │    │  • Activity Feed    │   └────────────────┘  │
│  └─────────────────────┘    └─────────────────────┘                       │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **NCR World Catalog**: Structured static dataset of:
    - *Places / Districts* (12 iconic NCR hubs with coordinates, radius, vibe summary, and local specialties).
    - *Metro Stations* (14 major interchange & terminal stations across Yellow, Blue, Violet, and Magenta/Rapid lines, with track geometry and hop-based fare calculation).
    - *Heritages* (10 monuments with ticket prices `₹0`–`₹35`, architectural era, stamp artwork badge, and Rupee discovery bonus).
    - *Restaurants & Street Stalls* (12 famous NCR eateries with 3–4 signature dishes each, authentic INR `₹` prices, veg/non-veg indicators, and Energy restoration values).
    - *Quests / Trails* (Multi-stop guided challenges awarding `₹150`–`₹450` on completion).
  - **Player State**: `id`, `name`, `color`, `x`, `y`, `rupees`, `energy`, `maxEnergy`, `visitedPlaces[]`, `stampedHeritages[]`, `tastedDishes[]`, `completedQuests[]`, `activeWaypointId`.
  - **Room State (Server)**: `roomCode`, `players: Map<playerId, RemotePlayer>`, `chatHistory[]` (capped recent messages), `recentEvents[]`.
- **Interactive Component & State Mapping**:
  - *Movement & Interaction*: `WASD`/Arrows or canvas click-to-walk updates local player velocity at 60fps (`dt` clamped to `0.05s`), checks proximity to POIs (`radius`), reveals the interaction prompt, and emits throttled `player:move` packets over WebSocket.
  - *Metro Transit Modal*: Validates wallet balance >= calculated fare, deducts Rupees, triggers transit animation & chime, teleports player to target station coordinates, and updates current district + server position.
  - *Restaurant Menu Modal*: Lists signature dishes with prices; ordering checks `rupees >= price`, deducts Rupees, boosts Energy (capped at 100), records dish in Foodie Journal, updates quest progress, and broadcasts a subtle room activity toast (`"Aarav ordered Mutton Korma at Karim's"`).
  - *Heritage Stamp Modal*: Deducts entry ticket fee (if any), unlocks the embossed stamp & lore card, awards first-visit Explorer XP / quest progress, and plays a celebratory stamp chime + particles.
  - *Directory Drawer*: Instant text search + category tabs (`All`, `Places`, `Metro`, `Heritages`, `Restaurants & Food`), allowing players to inspect prices/menus anywhere and pin any destination as an on-map compass waypoint.
  - *Room Chat & Emotes*: Supports quick emotes (`1`–`4` keys or buttons) and text messages broadcast to the room with floating canvas speech bubbles and idempotent message IDs.
