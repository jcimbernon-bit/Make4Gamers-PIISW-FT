import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Gamepad2, CheckCircle2, Clock, AlertCircle, ArrowRight, Sparkles, XCircle, FileEdit } from 'lucide-react';

import { supabase } from '../../../supabase';
import type { Game } from '../../games/services/getGames';

type Profile = {
  username: string | null;
  first_name: string | null;
};

type GameSummary = {
  total: number;
  activo: number;
  revision: number;
  rejected: number;
  draft: number;
  games: Game[];
};

function useStatusStyle() {
  const { t } = useTranslation();
  return (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'published') return { label: t('developer.status.published'), cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (s === 'review')    return { label: t('developer.status.review'),    cls: 'bg-amber-500/15  text-amber-300  border-amber-500/30'  };
    if (s === 'rejected')  return { label: t('developer.status.rejected'),  cls: 'bg-rose-500/15   text-rose-300   border-rose-500/30'   };
    if (s === 'draft')     return { label: t('developer.status.draft'),     cls: 'bg-slate-500/15  text-slate-400  border-slate-600/30'  };
    return { label: status, cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
  };
}

export default function DevDashboardSection() {
  const { t } = useTranslation();
  const getStatusStyle = useStatusStyle();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profileData }, { data: gamesData }] = await Promise.all([
        supabase.from('profiles').select('username, first_name').eq('id', user.id).maybeSingle(),
        supabase.from('games').select('*').eq('developer_id', user.id).order('created_at', { ascending: false }),
      ]);

      setProfile(profileData);

      const games = (gamesData ?? []) as Game[];
      setSummary({
        total: games.length,
        activo: games.filter(g => g.status?.toLowerCase() === 'published').length,
        revision: games.filter(g => g.status?.toLowerCase() === 'review').length,
        rejected: games.filter(g => g.status?.toLowerCase() === 'rejected').length,
        draft: games.filter(g => g.status?.toLowerCase() === 'draft').length,
        games: games.slice(0, 4),
      });

      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-44 rounded-2xl bg-slate-800/60" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="h-24 rounded-xl bg-slate-800/60" />)}
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name ?? profile?.username ?? 'Desarrollador';

  return (
    <div className="space-y-7">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-slate-900 to-indigo-950/40 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                {t('developer.dashboard.verifiedBadge')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t('developer.dashboard.welcome')}{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                M4G
              </span>
              ,<br />
              <span className="text-slate-200">{displayName}</span>
            </h2>
            <p className="max-w-md text-sm text-slate-400">
              {t('developer.dashboard.welcomeDesc')}
            </p>
          </div>

          <Link
            to="/dev-manual"
            className="group flex shrink-0 items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3.5 text-sm font-medium text-violet-200 transition-all hover:border-violet-400/50 hover:bg-violet-500/20 hover:text-white"
          >
            <BookOpen size={18} className="text-violet-400 transition-transform group-hover:scale-110" />
            <span>{t('developer.dashboard.manualLink')}</span>
            <ArrowRight size={14} className="text-violet-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-violet-500/10 p-2">
              <Gamepad2 size={18} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('developer.dashboard.cards.total')}</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.total ?? 0}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500/70">{t('developer.dashboard.cards.published')}</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.activo ?? 0}</p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock size={18} className="text-amber-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-500/70">{t('developer.dashboard.cards.review')}</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.revision ?? 0}</p>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-rose-500/10 p-2">
              <XCircle size={18} className="text-rose-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-500/70">{t('developer.dashboard.cards.rejected')}</span>
          </div>
          <p className="text-3xl font-bold text-white">{summary?.rejected ?? 0}</p>
        </div>
      </div>

      {/* Draft card — only shown when there are drafts */}
      {(summary?.draft ?? 0) > 0 && (
        <div className="rounded-xl border border-slate-600/40 bg-slate-800/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-700/60 p-2">
                <FileEdit size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  {t('developer.dashboard.drafts', { count: summary?.draft ?? 0 })}
                </p>
                <p className="text-xs text-slate-500">{t('developer.dashboard.draftsDesc')}</p>
              </div>
            </div>
            <Link
              to="/developer"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-violet-500/30 hover:text-violet-300"
            >
              {t('developer.dashboard.viewGames')}
            </Link>
          </div>
        </div>
      )}

      {/* Recent games */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('developer.dashboard.recentTitle')}</h3>

        {!summary?.games.length ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 py-12 text-center">
            <AlertCircle size={32} className="text-slate-600" />
            <p className="text-slate-400">{t('developer.dashboard.noGames')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary.games.map((game) => {
              const { label, cls } = getStatusStyle(game.status);
              return (
                <Link
                  key={game.id}
                  to={`/dev-game/${game.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 transition-colors hover:border-violet-500/30 hover:bg-violet-500/5"
                >
                  <div className="flex items-center gap-3">
                    {game.thumbnail_url ? (
                      <img src={game.thumbnail_url} alt={game.title} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                        <Gamepad2 size={18} className="text-slate-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{game.title}</p>
                      <p className="text-xs text-slate-500">{game.genre ?? 'Sin género'}{game.version ? ` · v${game.version}` : ''}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
