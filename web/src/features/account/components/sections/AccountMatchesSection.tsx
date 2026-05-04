import { useTranslation } from 'react-i18next';
import { Gamepad2, Medal } from 'lucide-react';

type RecentGame = {
  id: number | string;
  score: number;
  created_at: string;
  game: { title: string | null } | null;
};

type AccountMatchesSectionProps = {
  recentGames: RecentGame[];
  formatDate: (dateString: string) => string;
};

export function AccountMatchesSection({
  recentGames,
  formatDate,
}: AccountMatchesSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <Gamepad2 size={24} />
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
    </section>
  );
}