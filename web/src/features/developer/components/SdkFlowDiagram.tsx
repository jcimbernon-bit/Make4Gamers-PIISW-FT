const STEPS = [
  {
    n: 1,
    title: 'Inicialización',
    badge: 'Todos los jugadores',
    who: 'all' as const,
    items: [
      'getLaunchContextFromUrl()  →  extrae gameId y playerId de la URL',
      'Conectar al servidor de juego (socket / WebRTC)',
      'Unirse a la sala compartida',
    ],
  },
  {
    n: 2,
    title: 'Inicio de partida',
    badge: 'Solo el host',
    who: 'host' as const,
    items: [
      'createMatch({ gameId, player1, player2?, … })  →  obtiene matchId',
      'Relay del matchId al resto de jugadores vía socket',
    ],
  },
  {
    n: 3,
    title: 'Durante la partida',
    badge: 'Cada jugador · cada turno',
    who: 'all' as const,
    items: [
      'submitMatchMovement({ matchId, playerId, gameId, moveData })',
    ],
  },
  {
    n: 4,
    title: 'Cierre de partida',
    badge: 'Solo el host',
    who: 'host' as const,
    items: [
      'submitEloResult([{ userId, gameId, position }])  →  calcula deltas ELO',
      'Relay de eloResults al resto vía socket',
      'endMatch({ matchId, winnerId, loserId: null })',
    ],
  },
  {
    n: 5,
    title: 'Mostrar resultados',
    badge: 'Todos los jugadores',
    who: 'all' as const,
    items: [
      'Recibir eloResults del servidor de juego',
      'Mostrar oldElo → newElo (±delta) por jugador',
    ],
  },
];

export default function SdkFlowDiagram() {
  return (
    <div className="my-4">
      <div className="space-y-1">
        {STEPS.map((step, idx) => {
          const isHost = step.who === 'host';
          return (
            <div key={step.n} className="flex gap-3">
              {/* Left rail */}
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  isHost
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                    : 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                }`}>
                  {step.n}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-slate-800" style={{ minHeight: '1rem' }} />
                )}
              </div>

              {/* Card */}
              <div className={`mb-2 flex-1 rounded-xl border p-4 ${
                isHost
                  ? 'border-amber-500/20 bg-amber-500/5'
                  : 'border-violet-500/20 bg-violet-500/5'
              }`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white">{step.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isHost
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-violet-500/20 text-violet-300'
                  }`}>
                    {step.badge}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                      <code className="font-mono text-xs leading-relaxed text-slate-300">{item}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-3 w-3 rounded-full border-2 border-violet-500/60 bg-violet-500/10" />
          Todos los jugadores
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-3 w-3 rounded-full border-2 border-amber-500/60 bg-amber-500/10" />
          Solo el host — evita llamadas duplicadas
        </div>
      </div>
    </div>
  );
}
