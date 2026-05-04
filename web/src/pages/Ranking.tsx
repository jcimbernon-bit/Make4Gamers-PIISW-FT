import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Gamepad2, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase';
import { getRankingByGame, getUserRankPosition, type RankingEntry } from '../features/ranking/services/ranking.service';
import UserAvatar from '../shared/components/UserAvatar';
import { getTierForScore, getGameControllerData } from '../features/progression/services/progression.service';
import { Link } from 'react-router-dom';

export default function Ranking() {
    const { t } = useTranslation(); 
    
    const [games, setGames] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const currentTitle = games.find(g => g.id === selectedGame)?.title || '';

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);

            const { data: gamesData } = await supabase.from('games').select('*');
            if (gamesData && gamesData.length > 0) {
                setGames(gamesData);
                setSelectedGame(gamesData[0].id);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedGame) return;

        const fetchRanking = async () => {
            setLoading(true);
            const data = await getRankingByGame(selectedGame);
            setRankingData(data);

            if (currentUserId) {
                const myRank = await getUserRankPosition(selectedGame, currentUserId);
                setCurrentUserRank(myRank);
            }
            setLoading(false);
        };

        fetchRanking();
    }, [selectedGame, currentUserId]);

    const top3 = rankingData.slice(0, 3);
    const restOfRanking = rankingData.slice(3); 

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-300 py-10 px-4 relative overflow-hidden">
        
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto space-y-10 relative z-10">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-3 border border-indigo-500/20">
                            <TrendingUp size={16} /> {t('ranking.currentSeason')}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t('ranking.title')}</h1>
                        <p className="text-slate-400 mt-2">{t('ranking.subtitle')}</p>
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Gamepad2 size={16} /> {t('ranking.selectGame')}
                        </label>
                        <select 
                            value={selectedGame}
                            onChange={(e) => setSelectedGame(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none shadow-inner cursor-pointer"
                        >
                            {games.map(game => (
                                <option key={game.id} value={game.id}>
                                    {game.title || game.name || t('ranking.unknownGame')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : rankingData.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                        <Trophy className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">{t('ranking.noScoresTitle')}</h3>
                        <p className="text-slate-500">{t('ranking.noScoresDesc')}</p>
                    </div>
                ) : (
                    <>
                       
                       <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 pt-10 pb-4">
    
                        {/* Puesto 2 (Plata) */}
                        {top3[1] && (
                            <div className="order-2 md:order-1 w-full md:w-64 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 delay-100">
                                <Link to={`/usuario/${top3[1].username}`} className="relative mb-4 cursor-pointer hover:scale-105 transition-transform group block">
                                    <UserAvatar src={top3[1].avatar_url} name={top3[1].username} size={80} className="border-4 border-slate-400 group-hover:border-indigo-400 transition-colors" />
                                    <div className="absolute -bottom-3 -right-3 bg-slate-800 rounded-full p-1.5 border border-slate-400">
                                        <Medal className="text-slate-400" size={20} />
                                    </div>
                                </Link>
                                <div className="bg-slate-900/80 border-t-4 border-slate-400 w-full rounded-t-2xl p-4 text-center pb-8 shadow-[0_-10px_30px_rgba(148,163,184,0.05)] flex flex-col items-center">
                                    <Link to={`/usuario/${top3[1].username}`} className="w-full hover:text-indigo-400 transition-colors block">
                                        <h3 className="font-bold text-lg text-white truncate w-full">{top3[1].username}</h3>
                                    </Link>
                                    <p className="text-2xl font-black text-slate-400 mt-1">{top3[1].best_score.toLocaleString()}</p>
                                
                                    <img src={getGameControllerData(getTierForScore(currentTitle, top3[1].best_score)).image} alt="Rango" className="h-12 object-contain mt-3 drop-shadow-lg" />
                                    <span className={`text-xs font-semibold uppercase tracking-wider mt-1 block ${getGameControllerData(getTierForScore(currentTitle, top3[1].best_score)).color}`}>
                                        {getGameControllerData(getTierForScore(currentTitle, top3[1].best_score)).name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Puesto 1 (Oro) */}
                        {top3[0] && (
                            <div className="order-1 md:order-2 w-full md:w-72 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-500 z-10">
                                <Link to={`/usuario/${top3[0].username}`} className="relative mb-4 cursor-pointer hover:scale-110 transition-transform group block">
                                    <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10" size={32} />
                                    <UserAvatar src={top3[0].avatar_url} name={top3[0].username} size={112} className="relative z-0 border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.2)] group-hover:border-yellow-300 transition-colors" />
                                </Link>
                                <div className="bg-gradient-to-b from-yellow-500/10 to-slate-900/80 border-t-4 border-yellow-400 w-full rounded-t-2xl p-5 text-center pb-12 shadow-[0_-10px_40px_rgba(250,204,21,0.1)] flex flex-col items-center">
                                    <Link to={`/usuario/${top3[0].username}`} className="w-full hover:text-yellow-400 transition-colors block">
                                        <h3 className="font-bold text-xl text-white truncate w-full">{top3[0].username}</h3>
                                    </Link>
                                    <p className="text-3xl font-black text-yellow-400 mt-1">{top3[0].best_score.toLocaleString()}</p>
                                
                                    <img src={getGameControllerData(getTierForScore(currentTitle, top3[0].best_score)).image} alt="Rango" className="h-16 object-contain mt-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                                    <span className={`text-sm font-bold uppercase tracking-wider mt-1 block ${getGameControllerData(getTierForScore(currentTitle, top3[0].best_score)).color}`}>
                                        {getGameControllerData(getTierForScore(currentTitle, top3[0].best_score)).name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Puesto 3 (Bronce) */}
                        {top3[2] && (
                            <div className="order-3 md:order-3 w-full md:w-64 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 delay-200">
                                <Link to={`/usuario/${top3[2].username}`} className="relative mb-4 cursor-pointer hover:scale-105 transition-transform group block">
                                    <UserAvatar src={top3[2].avatar_url} name={top3[2].username} size={80} className="border-4 border-amber-700 group-hover:border-amber-500 transition-colors" />
                                    <div className="absolute -bottom-3 -right-3 bg-slate-800 rounded-full p-1.5 border border-amber-700">
                                        <Medal className="text-amber-700" size={20} />
                                    </div>
                                </Link>
                                <div className="bg-slate-900/80 border-t-4 border-amber-700 w-full rounded-t-2xl p-4 text-center pb-6 shadow-[0_-10px_30px_rgba(180,83,9,0.05)] flex flex-col items-center">
                                    <Link to={`/usuario/${top3[2].username}`} className="w-full hover:text-amber-500 transition-colors block">
                                        <h3 className="font-bold text-lg text-white truncate w-full">{top3[2].username}</h3>
                                    </Link>
                                    <p className="text-2xl font-black text-amber-600 mt-1">{top3[2].best_score.toLocaleString()}</p>
                                
                                    <img src={getGameControllerData(getTierForScore(currentTitle, top3[2].best_score)).image} alt="Rango" className="h-12 object-contain mt-3 drop-shadow-lg" />
                                    <span className={`text-xs font-semibold uppercase tracking-wider mt-1 block ${getGameControllerData(getTierForScore(currentTitle, top3[2].best_score)).color}`}>
                                        {getGameControllerData(getTierForScore(currentTitle, top3[2].best_score)).name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>


                        {restOfRanking.length > 0 && (
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden mt-8 backdrop-blur-md shadow-xl">
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/50">
                                    <div className="col-span-2 md:col-span-1 text-center">{t('ranking.colPos')}</div>
                                    <div className="col-span-6 md:col-span-5">{t('ranking.colPlayer')}</div>
                                    <div className="col-span-4 hidden md:block text-center">{t('ranking.colTier')}</div>
                                    <div className="col-span-4 md:col-span-2 text-right pr-4">{t('ranking.colScore')}</div>
                                </div>
                                <div className="divide-y divide-slate-800/50">
                                    {restOfRanking.map((entry, index) => {
                                        const currentTitle = games.find(g => g.id === selectedGame)?.title || '';
                                        const rankNumber = index + 4; 
                                        const tierName = getTierForScore(currentTitle, entry.best_score);
                                        const tier = getGameControllerData(tierName);
                                        const isMe = entry.user_id === currentUserId;


                                        return (
                                            <div key={entry.user_id} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/50 transition-colors ${isMe ? 'bg-indigo-500/10 hover:bg-indigo-500/20' : ''}`}>
                                                <div className="col-span-2 md:col-span-1 text-center font-bold text-slate-400 text-lg">
                                                    #{rankNumber}
                                                </div>
                                                {/* Busca este bloque dentro del map */}
                                                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                                                    <Link 
                                                        to={`/usuario/${entry.username}`} 
                                                        className="flex items-center gap-4 group cursor-pointer"
                                                    >
                                                        <UserAvatar 
                                                            src={entry.avatar_url} 
                                                            name={entry.username} 
                                                            size={48} 
                                                            className={`border-2 transition-colors ${isMe ? 'border-indigo-500' : 'border-slate-700 group-hover:border-indigo-400'}`} 
                                                        />
                                                        <span className={`font-semibold text-base truncate transition-colors ${isMe ? 'text-indigo-400' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                                                            {entry.username} {isMe && t('ranking.you')}
                                                        </span>
                                                    </Link>
                                                </div>
                                                

                                                <div className="col-span-4 hidden md:flex items-center justify-center gap-3">
                                                    <img src={tier.image} alt={tier.name} className="h-10 object-contain drop-shadow-md" title={tier.name} />
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border border-slate-700/50 bg-slate-950/50 ${tier.color}`}>
                                                        {tier.name}
                                                    </span>
                                                </div>

                                                <div className="col-span-4 md:col-span-2 text-right pr-4 font-mono font-bold text-lg text-slate-200">
                                                    {entry.best_score.toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

           
            {currentUserRank && currentUserRank > 3 && rankingData.length > 0 && (
                <div className="sticky bottom-6 mt-8 max-w-3xl mx-auto bg-indigo-950/90 backdrop-blur-xl border border-indigo-500/50 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_40px_rgba(99,102,241,0.3)] animate-in slide-in-from-bottom-10 z-50">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full ...">#{currentUserRank}</div>
                    <Link to="/cuenta" className="hover:opacity-80 transition-opacity"> 
                        <p className="text-sm text-indigo-300 font-medium">{t('ranking.yourPosition')}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-white font-bold text-lg">{t('ranking.keepPlaying')}</p>
                        </div>
                    </Link>
                </div>
                   
                    <div className="hidden md:flex items-center gap-3">
                        <img 
                            src={getGameControllerData(getTierForScore(currentTitle, rankingData[currentUserRank - 1].best_score)).image} 
                            alt="Tu Rango" 
                            className="h-12 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}