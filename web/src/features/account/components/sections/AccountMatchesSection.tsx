import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Medal, Play, Clock, ChevronRight } from 'lucide-react';
import type { InProgressMatch } from '../../services/account.service';

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
};

type AccountMatchesSectionProps = {
  recentGames: RecentGame[];
  inProgressMatches: InProgressMatch[];
  formatDate: (dateString: string) => string;
};

export function AccountMatchesSection({
  recentGames,
  inProgressMatches,
  formatDate,
}: AccountMatchesSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleResume = (matchId: string, gameId: string | null) => {
    if (!gameId) return;
    navigate(`/game/${gameId}/${matchId}`);
  };

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-8 overflow-y-auto hide-scrollbar">
      {/* Partidas en curso — sección destacada */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Play size={22} className="fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Partidas en curso</h3>
              <p className="text-xs text-slate-400">Reanuda tus partidas pendientes</p>
            </div>
          </div>
          {inProgressMatches.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              {inProgressMatches.length}
            </span>
          )}
        </div>

        {inProgressMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inProgressMatches.map((match) => {
              const canResume = !!match.gameId;
              return (
                <button
                  key={match.matchId}
                  onClick={() => handleResume(match.matchId, match.gameId)}
                  disabled={!canResume}
                  className="group relative text-left rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-800/40 to-slate-800/20 p-4 transition-all hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    En curso
                  </div>

                  <div className="flex items-start gap-3 pr-20">
                    <div className="shrink-0 p-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-emerald-400">
                      <Gamepad2 size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold truncate">{match.gameTitle}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <Clock size={11} />
                        {formatDate(match.updatedAt ?? match.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Click para reanudar</span>
                    <ChevronRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 p-6 text-center">
            <Play size={28} className="mx-auto text-slate-600 mb-2" />
            <p className="text-slate-400 text-sm">No tienes partidas en curso</p>
          </div>
        )}
      </div>

      {/* Histórico de partidas terminadas */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Gamepad2 size={22} />
          </div>
          <h3 className="text-xl font-bold text-white">{t('account.dashboard.recentGames')}</h3>
        </div>

        {recentGames.length > 0 ? (
          <div className="space-y-3">
            {recentGames.slice(0, 10).map((game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-slate-800 bg-slate-800/30 px-5 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors hover:bg-slate-800/50"
              >
                <p className="text-white font-semibold text-lg">
                  {game.game?.title || t('account.dashboard.unknownGame')}
                </p>
                <div className="text-sm text-slate-400 flex items-center gap-6">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {t('account.dashboard.finished')}
                  </span>
                  <span className="font-black text-indigo-400 text-base">
                    {game.score ?? '-'} PTS
                  </span>
                  <span className="opacity-60">{formatDate(game.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 p-10 text-center">
            <Medal size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">{t('account.dashboard.noRecentGames')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
