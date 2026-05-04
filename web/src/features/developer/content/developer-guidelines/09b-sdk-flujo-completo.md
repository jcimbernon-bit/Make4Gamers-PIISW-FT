# 🔄 SDK m4g-sdk — Flujo completo de integración

El siguiente diagrama muestra los cinco pasos del ciclo de vida de una partida y qué jugador ejecuta cada uno. Los pasos en **ámbar** solo los ejecuta el host; los demás los ejecuta cada jugador.

<div class="m4g-sdk-flow"></div>

## Patrón host-only

Las funciones `createMatch`, `submitEloResult` y `endMatch` **solo deben ejecutarlas un jugador — el host**. Si varios jugadores las llaman simultáneamente se crean registros duplicados y los cálculos de ELO se corrompen.

> [!WARNING]
> Una doble llamada a `submitEloResult` genera cambios de ELO incorrectos de forma permanente. Implementa siempre el patrón host-only antes de integrar el SDK.

### Identificar al host

El host es el primer jugador en unirse a la sala. Compara el `playerId` local con el primer elemento del array de jugadores en el servidor:

```javascript
// Servidor (ej. Socket.io)
const rooms = {}; // { roomId: [playerId, ...] }

socket.on('room:join', ({ roomId, playerId }) => {
  if (!rooms[roomId]) rooms[roomId] = [];
  rooms[roomId].push(playerId);

  const isHost = rooms[roomId][0] === playerId;
  socket.emit('role:assigned', { isHost });

  if (rooms[roomId].length === expectedPlayers) {
    io.to(roomId).emit('room:ready', { players: rooms[roomId] });
  }
});
```

```typescript
// Cliente (tu juego)
let isHost  = false;
let matchId: string | null = null;

socket.on('role:assigned', ({ isHost: h }) => { isHost = h; });

// El host hace relay del matchId al resto
socket.on('match:created', ({ matchId: id }) => {
  if (!isHost) matchId = id;
});
```

---

## Ejemplo completo

Juego por turnos de 2 a 4 jugadores usando Socket.io como servidor de juego.

```typescript
import {
  getLaunchContextFromUrl,
  createMatch,
  submitMatchMovement,
  submitEloResult,
  endMatch,
} from 'm4g-sdk';
import { io } from 'socket.io-client';

// ─── 1. Inicialización — todos los jugadores ──────────────────────────────────

const ctx    = getLaunchContextFromUrl();
const socket = io('wss://tu-servidor-de-juego.com');

let isHost  = false;
let matchId = ctx.matchId ?? null;

socket.emit('room:join', { roomId: ctx.gameId, playerId: ctx.playerId });
socket.on('role:assigned', ({ isHost: h }) => { isHost = h; });

// ─── 2. Inicio de partida — solo el host ─────────────────────────────────────

socket.on('room:ready', async ({ players }) => {
  if (!isHost) return;

  const result = await createMatch({
    gameId:  ctx.gameId!,
    player1: players[0],
    player2: players[1] ?? null,
    player3: players[2] ?? null,
    player4: players[3] ?? null,
  });

  if (!result.ok) { console.error('[m4g] createMatch:', result.error); return; }

  matchId = result.matchId!;
  socket.emit('match:created', { matchId }); // Relay al resto
});

socket.on('match:created', ({ matchId: id }) => {
  if (!isHost) matchId = id;
});

// ─── 3. Durante la partida — cada jugador, cada turno ────────────────────────

async function onPlayerMove(moveData) {
  if (!matchId) return;
  await submitMatchMovement({
    matchId,
    playerId: ctx.playerId!,
    gameId:   ctx.gameId,
    moveData,
  });
}

// ─── 4. Fin de partida — solo el host ────────────────────────────────────────

async function onGameEnd(finalPositions) {
  if (!isHost || !matchId) return;

  const eloResult = await submitEloResult(
    finalPositions.map(p => ({
      userId:   p.userId,
      gameId:   ctx.gameId!,
      position: p.position,
    }))
  );

  if (!eloResult.ok) { console.error('[m4g] submitEloResult:', eloResult.error); return; }

  socket.emit('match:elo', { results: eloResult.results }); // Relay ELO al resto

  const winner = finalPositions.find(p => p.position === 1);
  await endMatch({ matchId, winnerId: winner.userId, loserId: null });
}

// ─── 5. Mostrar resultados — todos los jugadores ─────────────────────────────

socket.on('match:elo', ({ results }) => {
  for (const r of results) {
    const sign    = r.delta >= 0 ? '+' : '';
    const isLocal = r.userId === ctx.playerId;
    console.log(
      isLocal ? '(tú)' : r.userId,
      r.oldElo, '→', r.newElo,
      '(' + sign + r.delta + ')'
    );
  }

  mostrarPantallaResultados(results); // Tu función de UI
});
```

> [!NOTE]
> Este ejemplo usa Socket.io pero el SDK es agnóstico al servidor de juego. Funciona igualmente con WebRTC, Colyseus, Nakama o cualquier otra solución siempre que implementes el relay del `matchId` y los `eloResults`.
