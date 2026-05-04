# ⚙️ Sistema de configuración de partidas

Antes de iniciar una partida, el usuario debe poder configurar los **elementos principales** que afectan al desarrollo del juego.

> [!IMPORTANT]
> La configuración previa debe permitir que la partida comience con parámetros claros y revisados por el usuario.

## Modo de juego

El usuario debe poder seleccionar el **tipo de partida** antes de comenzar.

## Parámetros de la partida

La configuración puede incluir:

* Tiempo límite.
* Dificultad, si aplica.
* Opciones específicas del juego.

## Emparejamiento

El sistema de partida puede contemplar:

| Opción                        | Descripción                                              |
| ----------------------------- | -------------------------------------------------------- |
| **Invitación a jugadores**    | Permite iniciar una partida con jugadores invitados.     |
| **Emparejamiento automático** | Permite que el sistema asigne jugadores automáticamente. |

## ✅ Confirmación previa

Antes de iniciar la partida, se debe mostrar un **resumen de la configuración seleccionada**.

> [!IMPORTANT]
> El usuario debe poder revisar la configuración antes de comenzar para evitar errores o partidas iniciadas con parámetros incorrectos.

---

## 🔌 Integración técnica con el m4g-sdk

El **m4g-sdk** proporciona las funciones necesarias para registrar partidas y movimientos directamente en la base de datos de M4G. Consulta la sección **SDK m4g-sdk — Instalación** para configurar la librería antes de usar estas funciones.

### Registrar el inicio de una partida

```typescript
import { createMatch } from 'm4g-sdk';

// Solo el host de la sala debe llamar a esta función
if (isHost) {
  const result = await createMatch({
    gameId:  ctx.gameId!,   // UUID del juego en M4G
    player1: ctx.playerId!, // UUID del jugador host — obligatorio
    player2: ctx.player2Id, // UUID del rival (null en singleplayer)
  });

  if (!result.ok) {
    console.error('[m4g] createMatch:', result.error);
    return;
  }

  matchId = result.matchId!;
  // Compartir matchId con el resto vía servidor de juego
  socket.emit('match:created', { matchId });
}
```

> [!WARNING]
> **Solo el host** debe llamar a `createMatch`. Si todos los jugadores la llaman, se crearán registros duplicados en la base de datos. Consulta el **Patrón host-only** en la sección **Flujo completo de integración**.

### Registrar movimientos por turno

Cada jugador puede registrar sus propios movimientos sin restricción de host:

```typescript
import { submitMatchMovement } from 'm4g-sdk';

async function onPlayerMove(moveData: Record<string, unknown>) {
  const result = await submitMatchMovement({
    matchId,
    playerId: ctx.playerId!,
    gameId:   ctx.gameId,
    moveData, // Cualquier objeto JSON con los datos del turno
  });

  if (!result.ok) {
    console.error('[m4g] submitMatchMovement:', result.error);
  }
}
```

### Cerrar la partida

```typescript
import { endMatch } from 'm4g-sdk';

// Solo el host, después de calcular el ELO
if (isHost) {
  await endMatch({
    matchId,
    winnerId: winnerPlayerId,
    loserId:  null, // null para partidas de 3 o más jugadores
  });
}
```

> [!TIP]
> Para el flujo completo incluyendo el cálculo de ELO, consulta la sección **SDK m4g-sdk — Flujo completo de integración**.
