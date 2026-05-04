import { useEffect, useState } from 'react';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { Activity, Trophy, Gamepad2, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { getUserDetailedStats } from '../features/account/services/account.service';
import IconSpinner from '../shared/layout/Spinner';


export default function Estadisticas() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    useEffect(() => {
        const loadStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getUserDetailedStats(user.id);
                setStats(data);
            }
            setLoading(false);
        };
        loadStats();
    }, []);

    if (loading) return <IconSpinner />;

    if (!stats || stats.totalMatches === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Gamepad2 size={64} className="mx-auto text-slate-700 mb-4" />
                <h1 className="text-2xl font-bold text-white">Aún no hay estadísticas</h1>
                <p className="text-slate-400 mt-2">Juega unas cuantas partidas para empezar a ver tus gráficas.</p>
                <Link to="/juegos" className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Ir a jugar
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <div className="container mx-auto px-4 py-8">
                
                {/* Cabecera */}
                <div className="flex items-center gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-white">Panel de Estadísticas</h1>
                        <p className="text-slate-400">Análisis detallado de tu rendimiento en los juegos</p>
                    </div>
                </div>

                {/* Tarjetas de Resumen Rápido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Partidas Totales</p>
                                <p className="text-3xl font-bold text-white">{stats.totalMatches}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Puntuación Máxima</p>
                                <p className="text-3xl font-bold text-white">{stats.highestScore.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <Gamepad2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Juego Favorito</p>
                                <p className="text-xl font-bold text-white truncate">{stats.favoriteGame}</p>
                                <p className="text-xs text-slate-500">{stats.favoriteGamePlays} partidas jugadas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Usuarios activos</p>
                                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Partidas en las últimas 6 semanas</p>
                                <p className="text-3xl font-bold text-white">{stats.matchesThisWeek}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Partidas en los últimos 6 meses</p>
                                <p className="text-3xl font-bold text-white">{stats.matchesThisMonth}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Gráfico de Tendencia por Periodo */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-400" />
                                    Actividad por periodo
                                </h3>
                                <p className="text-sm text-slate-500">Ver tus partidas por día, semana o mes.</p>
                            </div>
                            <div className="inline-flex rounded-full border border-slate-800 bg-slate-950/70 p-1">
                                {(['daily', 'weekly', 'monthly'] as const).map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setSelectedPeriod(option)}
                                        className={`px-4 py-2 text-sm font-semibold transition-colors rounded-full ${selectedPeriod === option ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        {option === 'daily' ? 'Día' : option === 'weekly' ? 'Semana' : 'Mes'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.periodChartData?.[selectedPeriod] || []}>
                                    <defs>
                                        <linearGradient id="statsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={false}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#81e6d9' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#38bdf8" fill="url(#statsGradient)" name="Partidas" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Barras: Popularidad */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity size={18} className="text-indigo-400" />
                            Veces Jugadas por Juego
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={false}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Bar dataKey="plays" fill="#6366f1" radius={[4, 4, 0, 0]} name="Partidas" maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

        {/* Actividad Reciente */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="text-indigo-400" /> Actividad Reciente
            </h3>
            
            {!stats.historyData || stats.historyData.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">
                    Aún no hay actividad reciente.
                </div>
            ) : (
                <div className="space-y-4">
                    {stats.historyData.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/80 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                                    <Gamepad2 size={24} />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{item.game}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Calendar size={12} /> {item.date} a las {item.time}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

                </div>

                {/* Tabla Detallada Final */}
                <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-white">Desglose por Juego</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Juego</th>
                                    <th className="px-6 py-4 font-semibold text-center">Partidas</th>
                                    <th className="px-6 py-4 font-semibold text-right">Mejor Puntuación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats.chartData.map((game: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors text-slate-300">
                                        <td className="px-6 py-4 font-medium text-white">{game.name}</td>
                                        <td className="px-6 py-4 text-center">{game.plays}</td>
                                        <td className="px-6 py-4 text-right font-mono text-indigo-400">
                                            {game.highScore.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}