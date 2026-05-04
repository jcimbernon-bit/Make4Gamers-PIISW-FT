import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; 
import { toast } from "react-hot-toast";
import { supabase, supabaseUrl } from "../../supabase"; 
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate(); 

    
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
            }
        };
        fetchUser();
    }, []);

 

    useEffect(() => {
        if (!currentUserId) return;

        const channel = supabase
            .channel('global-chat-notifications')
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages'
                },
                async (payload) => { 
                    const newMessage = payload.new;
                    
                    if (newMessage.sender_id === currentUserId) return;
                    if (location.pathname === '/chat') return;

                    const { data: senderData } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', newMessage.sender_id)
                        .maybeSingle();

                    const senderName = senderData?.username || "Alguien";

                    toast.custom((t) => (
                        <div
                            className={`${
                                t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-sm w-full bg-slate-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-white/10 overflow-hidden cursor-pointer hover:bg-slate-700/80 transition-all duration-300`}
                            onClick={() => {
                             
                                navigate('/chat', { state: { openChatWith: newMessage.sender_id } });
                                toast.dismiss(t.id);
                            }}
                        >
                            <div className="flex-1 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">Mensaje de {senderName}</p>
                                        <p className="text-sm text-slate-300 truncate mt-0.5">{newMessage.content}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-slate-700/50">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        toast.dismiss(t.id);
                                    }}
                                    className="w-full flex items-center justify-center rounded-none rounded-r-xl border border-transparent px-4 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ), {
                        duration: 5000, 
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId, location.pathname, navigate]);



    useEffect(() => {
        if (!currentUserId) return;

       
        const savedStatus = localStorage.getItem(`chat_status_${currentUserId}`) || 'Disponible';
        supabase.from('profiles').update({ status: savedStatus }).eq('id', currentUserId).then();

    
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
              
                supabase.from('profiles').update({ status: 'Ausente' }).eq('id', currentUserId).then();
            } else if (document.visibilityState === 'visible') {
             
                const currentSavedStatus = localStorage.getItem(`chat_status_${currentUserId}`) || 'Disponible';
                supabase.from('profiles').update({ status: currentSavedStatus }).eq('id', currentUserId).then();
            }
        };

       
        const handleClose = () => {
          
            const url = `${supabaseUrl}/rest/v1/profiles?id=eq.${currentUserId}`;
            const headers = new Blob([JSON.stringify({ status: 'Invisible' })], {
                type: 'application/json'
            });
            
           
            navigator.sendBeacon(url, headers);
            
         
            supabase.from('profiles').update({ status: 'Invisible' }).eq('id', currentUserId).then();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleClose);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleClose);
       
        };
    }, [currentUserId]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
