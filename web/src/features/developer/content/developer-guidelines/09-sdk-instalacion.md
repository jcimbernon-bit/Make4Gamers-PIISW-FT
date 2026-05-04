# 📦 SDK m4g-sdk — Instalación y configuración

El **m4g-sdk** (v3.0.6) es la librería oficial TypeScript/JavaScript para conectar tus juegos web con la infraestructura de M4G. Gestiona el ciclo completo de una partida: inicio, movimientos por turno, cálculo de ELO y cierre — todo con comunicación directa a Supabase.

> [!IMPORTANT]
> El SDK escribe directamente en Supabase. Antes de integrar, asegúrate de que las tablas `matches`, `scores` y `match_movements` existen y tienen las políticas RLS configuradas. Consulta la sección **SDK — Tablas y RLS**.

## Instalación

**Desde npm (recomendado):**

```bash
npm install m4g-sdk
```

**Desde archivo local durante el desarrollo:**

```bash
npm install ../m4gGamesCreatorLib
# Añade al package.json: "m4g-sdk": "file:../m4gGamesCreatorLib"
```

**Peer dependency necesaria:**

```bash
npm install @supabase/supabase-js
```

## Import

```typescript
import {
  getLaunchContextFromUrl, // Leer gameId / playerId de la URL al iniciar
  createMatch,             // Registrar inicio de partida (solo el host)
  submitMatchMovement,     // Registrar movimiento / turno de un jugador
  submitEloResult,         // Calcular y guardar ELO al terminar (solo el host)
  endMatch,                // Cerrar la partida en la BD (solo el host)
} from 'm4g-sdk';
```

## Versión y formatos del paquete

| Propiedad | Valor |
| --------- | ----- |
| Versión | 3.0.6 |
| ESM | `index.mjs` |
| CJS | `index.js` |
| Tipos TypeScript | `index.d.ts` incluidos |
| Peer dependency | `@supabase/supabase-js ^2.0.0` |

## Leer el contexto de lanzamiento

M4G inyecta automáticamente los parámetros del juego en la URL del iframe. Léelos con `getLaunchContextFromUrl` al inicializar:

```typescript
const ctx = getLaunchContextFromUrl();
// ctx.gameId   → UUID del juego en M4G
// ctx.playerId → UUID del jugador local
// ctx.matchId  → UUID de partida existente (si aplica)
```

**Parámetros URL reconocidos automáticamente:**

| Parámetro en la URL | Mapeado a |
| ------------------- | --------- |
| `gameId`, `game_id`, `game` | `gameId` |
| `matchId`, `match_id`, `match` | `matchId` |
| `player`, `userId`, `playerId`, `player1`, `player_1` | `playerId` |
| `player2`, `player2Id`, `player_2` | `player2Id` |

## Patrón de respuesta y errores

Todas las funciones async del SDK devuelven `{ ok, error? }` y **nunca lanzan excepciones**:

```typescript
const result = await createMatch({ gameId, player1 });

if (!result.ok) {
  console.error('[m4g] Error:', result.error);
  mostrarError('No se pudo iniciar la partida. Inténtalo de nuevo.');
  return;
}

// Continuar con result.matchId
```

> [!TIP]
> Añade el prefijo `[m4g]` en tus logs de error para identificar fácilmente los problemas del SDK en producción.
