import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Activity, Users, Star, AlertCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../../../supabase';
import type { Game } from '../../games/services/getGames';

type GameStats = {
  game: Game;
  totalPlays: number;
  uniquePlayers: number;
};

export default function DevStatsSection() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .eq('developer_id', user.id)
        .order('created_at', { ascending: false });

      const games = (gamesData ?? []) as Game[];

      const results = await Promise.all(
        games.map(async (game) => {
          const { data: scoresData } = await supabase
            .from('scores')
            .select('user_id')
            .eq('game_id', game.id);

          const rows = scoresData ?? [];
          const totalPlays = rows.length;
          const uniquePlayers = new Set(rows.map((r: any) => r.user_id)).size;

          return { game, totalPlays, uniquePlayers };
        })
      );

      setStats(results);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-48 rounded bg-slate-800/60" />
        <div className="h-72 rounded-2xl bg-slate-800/60" />
        <div className="h-48 rounded-2xl bg-slate-800/60" />
      </div>
    );
  }

  const totalPlays = stats.reduce((acc, s) => acc + s.totalPlays, 0);
  const totalUnique = stats.reduce((acc, s) => acc + s.uniquePlayers, 0);
  const avgRating = stats.filter(s => s.game.rating).reduce((acc, s, _, arr) => acc + (s.game.rating ?? 0) / arr.length, 0);

  const chartData = stats.map(s => ({
    name: s.game.title.length > 14 ? s.game.title.slice(0, 12) + '…' : s.game.title,
    fullName: s.game.title,
    partidas: s.totalPlays,
    jugadores: s.uniquePlayers,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">{t('developer.stats.title')}</h2>

      {!stats.length ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-700 py-20 text-center">
          <AlertCircle size={40} className="text-slate-600" />
          <p className="text-slate-400">{t('developer.stats.empty')}</p>
        </div>
      ) : (
        <>
          {/* Global summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <Activity size={18} className="text-violet-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('developer.stats.totalPlays')}</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalPlays.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-indigo-500/10 p-2">
                  <Users size={18} className="text-indigo-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('developer.stats.uniquePlayers')}</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalUnique.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Star size={18} className="text-amber-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('developer.stats.avgRating')}</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-white">
              <TrendingUp size={18} className="text-violet-400" />
              {t('developer.stats.chartTitle')}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    formatter={(value, _name, props) => [value, (props as any).payload?.fullName ?? '']}
                    itemStyle={{ color: '#a78bfa' }}
                  />
                  <Bar dataKey="partidas" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={60} name="Partidas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-game table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-4">
              <h3 className="font-semibold text-white">{t('developer.stats.tableTitle')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-3 font-semibold">{t('developer.stats.colGame')}</th>
                    <th className="px-6 py-3 text-center font-semibold">{t('developer.stats.colPlays')}</th>
                    <th className="px-6 py-3 text-center font-semibold">{t('developer.stats.colUnique')}</th>
                    <th className="px-6 py-3 text-right font-semibold">{t('developer.stats.colRating')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stats.map(({ game, totalPlays: plays, uniquePlayers }) => (
                    <tr key={game.id} className="text-slate-300 transition-colors hover:bg-white/5">
                      <td className="px-6 py-4 font-medium text-white">{game.title}</td>
                      <td className="px-6 py-4 text-center">{plays.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">{uniquePlayers.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono text-amber-400">
                        {game.rating != null ? game.rating.toFixed(1) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
