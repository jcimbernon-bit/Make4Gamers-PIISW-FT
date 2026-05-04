import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { Logo } from '../icons/Logo';
import { logout } from '../../features/auth/services/logout.service';
import { useAuthStatus } from '../../features/auth/hooks/useAuthStatus';
import { supabase } from '../../supabase';
import { getAccountHighScores } from '../../features/account/services/account.service';


import { calculateLazyGlobalScore, getGlobalProgress } from '../../features/progression/services/progression.service';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuthStatus();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDeveloper, setIsDeveloper] = useState(false);


    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [hasUnread, setHasUnread] = useState(false);


    const [globalProgress, setGlobalProgress] = useState<{ percentage: number, nextTierName: string, pointsNeeded: number } | null>(null);
   

    useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
            const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profileData?.role === 'admin') setIsAdmin(true);
            if (profileData?.role === 'developer' || profileData?.role === 'admin') setIsDeveloper(true);
    
            try {
                const scores = await getAccountHighScores(user.id);
                if (scores && scores.length > 0) {
                    const totalScore = calculateLazyGlobalScore(scores);
                    const progress = getGlobalProgress(totalScore);
                    setGlobalProgress(progress);
                } else {
                    
                    setGlobalProgress(getGlobalProgress(0));
                }
            } catch (error) {
                console.error("Error cargando progreso en Header:", error);
            }
        }
    };
    fetchUser();
}, []);

    useEffect(() => {
       
        const inChat = location.pathname === '/chat';
        if (inChat) {
            queueMicrotask(() => setHasUnread(false));
        }
    }, [location.pathname]);


    useEffect(() => {
        if (!currentUserId) return;

        const channel = supabase
            .channel('header-badge-notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new;


                    if (newMessage.sender_id !== currentUserId && location.pathname !== '/chat') {
                        setHasUnread(true);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId, location.pathname]);



    const changeLanguage = (lng: string): void => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const currentLang = (i18n.language ?? 'es').split('-')[0].toUpperCase();

    const handleLogout = async () => {
        await logout();
        setIsProfileOpen(false);
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-500">
                    <Logo className="h-8 w-8" />
                    <span className="tracking-tighter text-white">Made<span className="text-indigo-500">4Gamers</span></span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to="/juegos" className="hover:text-indigo-400 transition-colors">{t('nav.games')}</Link>
                    <Link to="/ranking" className="hover:text-indigo-400 transition-colors">{t('nav.ranking')}</Link>

                    <Link to="/chat" className="relative hover:text-indigo-400 transition-colors flex items-center">
                        {t('nav.chat')}
                        {hasUnread && (
                            <span className="absolute -top-1.5 -right-3.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                    </Link>
                </nav>


                <div className="flex items-center gap-4">

                    {isAuthenticated ? (
                       
                        <div className="flex items-center gap-4">
                            
                           
                            {globalProgress && globalProgress.nextTierName !== 'MAX' && (
                                <div className="hidden md:flex flex-col items-end justify-center group cursor-help">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-400 transition-colors mb-0.5">
                                        Faltan {globalProgress.pointsNeeded} pts para <span className="text-amber-400">{globalProgress.nextTierName}</span>
                                    </span>
                                    <div className="h-1.5 w-28 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                        <div 
                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${globalProgress.percentage}%` }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                           

                            <div className="relative">
                                <button
                                    onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLangOpen(false); }}
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                        <User size={16} />
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                        <Link to="/cuenta" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                            <User size={16} />
                                            <span>{t('nav.account')}</span>
                                        </Link>




                                        <div className="h-px bg-slate-800 my-1"></div>
                                        <button
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            <span>{t('nav.logout')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            <span className="hidden sm:inline">{t('auth.login')}</span>
                        </Link>
                    )}

                    <button className="md:hidden p-2 text-slate-300">
                        <Menu size={24} />
                    </button>



                    {isDeveloper && (
                        <Link
                            to="/developer"
                            className="hidden md:inline uppercase text-[11px] bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/30 text-violet-300 hover:text-violet-200 hover:border-violet-400/50 transition-colors"
                        >
                            Dev
                        </Link>
                    )}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="hidden md:inline uppercase text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 transition-colors"
                        >
                            {t('admin.panelButton', { defaultValue: 'Admin' })}
                        </Link>
                    )}


                    {/* Language Selector */}
                    <div className="relative hidden sm:block">
                        <button
                            onClick={() => { setIsLangOpen(!isLangOpen); setIsProfileOpen(false); }}
                            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            <Globe size={18} />
                            <span>{currentLang}</span>
                            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('es')}>
                                    <span>🇪🇸</span> Español
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('en')}>
                                    <span>🇬🇧</span> English
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => changeLanguage('zh')}>
                                    <span>🇨🇳</span> 中文
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
