const CONFIGS = [
  {
    players: 2,
    positions: [
      { pos: 1, s: 1.0,   label: '1.ª — Ganador'  },
      { pos: 2, s: 0.0,   label: '2.ª — Perdedor' },
    ],
  },
  {
    players: 3,
    positions: [
      { pos: 1, s: 1.0,   label: '1.ª — Ganador' },
      { pos: 2, s: 0.5,   label: '2.ª — Segundo'  },
      { pos: 3, s: 0.0,   label: '3.ª — Tercero'  },
    ],
  },
  {
    players: 4,
    positions: [
      { pos: 1, s: 1.0,          label: '1.ª — Ganador' },
      { pos: 2, s: 2 / 3,        label: '2.ª — Segundo' },
      { pos: 3, s: 1 / 3,        label: '3.ª — Tercero' },
      { pos: 4, s: 0.0,          label: '4.ª — Cuarto'  },
    ],
  },
];

const K_FACTORS = [
  {
    k: 50,
    name: 'Underdog',
    desc: 'ELO medio rival supera al propio en más de 200 puntos',
    colorCls: 'text-violet-400',
    bgCls: 'bg-violet-500/5',
  },
  {
    k: 40,
    name: 'Provisional',
    desc: 'Jugador con menos de 20 partidas registradas',
    colorCls: 'text-amber-400',
    bgCls: 'bg-amber-500/5',
  },
  {
    k: 20,
    name: 'Establecido',
    desc: 'Jugador con 20 o más partidas registradas',
    colorCls: 'text-slate-400',
    bgCls: '',
  },
];

export default function EloTable() {
  return (
    <div className="my-4 space-y-4">

      {/* S values per player count */}
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <div className="border-b border-slate-800 bg-slate-800/50 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Puntuación S por posición
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500">
            S = (totalJugadores − posición) / (totalJugadores − 1)
          </p>
        </div>

        <div className="grid divide-y divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {CONFIGS.map(({ players, positions }) => (
            <div key={players} className="p-4">
              <p className="mb-3 text-center text-xs font-bold text-slate-400">
                {players} jugadores
              </p>
              <div className="space-y-2.5">
                {positions.map(({ pos, s, label }) => {
                  const isFirst = pos === 1;
                  const isLast  = pos === players;
                  return (
                    <div key={pos} className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isFirst ? 'bg-emerald-500/15 text-emerald-300'
                        : isLast ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                      }`}>
                        {pos}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] text-slate-500">{label}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFirst ? 'bg-emerald-500'
                                : isLast ? 'bg-rose-500'
                                : 'bg-violet-500'
                              }`}
                              style={{ width: `${s * 100}%` }}
                            />
                          </div>
                          <span className={`w-10 shrink-0 text-right font-mono text-xs font-bold ${
                            isFirst ? 'text-emerald-400'
                            : isLast ? 'text-rose-400'
                            : 'text-slate-300'
                          }`}>
                            {s.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* K factors */}
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <div className="border-b border-slate-800 bg-slate-800/50 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Factor K — amplitud del cambio ELO
          </p>
        </div>
        <div className="divide-y divide-slate-800">
          {K_FACTORS.map(({ k, name, desc, colorCls, bgCls }) => (
            <div key={k} className={`flex items-center justify-between px-4 py-3 ${bgCls}`}>
              <div>
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <span className={`font-mono text-2xl font-bold ${colorCls}`}>K={k}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
