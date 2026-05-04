// src/pages/Chat.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import FriendList from '../features/chat/components/FriendList';
import ChatArea from '../features/chat/components/ChatArea';
import { getOrCreateChatRoom, updateUserStatus } from '../features/chat/services/chat.service';
import type { ChatProfile } from '../features/chat/types/chat.types';
import AddFriendModal from '../features/chat/components/AddFriendModal'; 
import { Plus } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';
import CreateGroupModal from '../features/chat/components/CreateGroupModal';
import { Users } from 'lucide-react';

export default function Chat() {
    const { t } = useTranslation();
    const location = useLocation();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [myStatus, setMyStatus] = useState('Disponible');
    const [selectedFriend, setSelectedFriend] = useState<ChatProfile | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [refreshFriends, setRefreshFriends] = useState(0); 
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    setCurrentUserId(user.id);
                    
                 
                    const savedStatus = localStorage.getItem(`chat_status_${user.id}`) || 'Disponible';
                    setMyStatus(savedStatus);
                    
                 
                    await updateUserStatus(user.id, savedStatus);
                }
            } catch (err) {
                console.error("Error comprobando la sesión:", err);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        fetchUser();
    }, []);

   


    useEffect(() => {
        console.log("Iniciando conexión a Supabase Realtime...");

        const channel = supabase
            .channel('cambios-estado-amigos')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log("¡BINGO! He recibido un cambio de Supabase:", payload);
                    
                    const perfilActualizado = payload.new as ChatProfile;

                    setSelectedFriend((amigoActual) => {
                        if (amigoActual && amigoActual.id === perfilActualizado.id) {
                            return { ...amigoActual, status: perfilActualizado.status };
                        }
                        return amigoActual;
                    });

                    setRefreshFriends((prev) => prev + 1);
                }
            )
            .subscribe((status) => {
                console.log("Estado de la suscripción Realtime:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSelectEntity = async (entity: ChatProfile) => {
        setSelectedFriend(entity);
        setLoadingRoom(true);
        if (entity.room_id) {
            setRoomId(entity.room_id);
        } else {
            const room = await getOrCreateChatRoom(currentUserId!, entity.id);
            setRoomId(room);
        }
        setLoadingRoom(false);
    }
    
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setMyStatus(newStatus);
        
        if (currentUserId) {
       
            localStorage.setItem(`chat_status_${currentUserId}`, newStatus);
            await updateUserStatus(currentUserId, newStatus);
        }
    };

    const handleSelectFriend = async (friend: ChatProfile) => {
        setSelectedFriend(friend);
        setLoadingRoom(true);
        
        if (currentUserId) {
            if (friend.is_group) {
                console.log("Cargando sala de grupo:", friend.id);
                setRoomId(friend.id); 
                setLoadingRoom(false);
            } else {
                const id = await getOrCreateChatRoom(currentUserId, friend.id);
                setRoomId(id);
                setLoadingRoom(false);
            }
        }
    };

    useEffect(() => {
        const autoOpenChat = async () => {
     
            const targetUserId = location.state?.openChatWith;
            
            if (targetUserId && currentUserId) {
               
                const { data: friendProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', targetUserId)
                    .single();
                
                if (friendProfile) {
                
                    handleSelectFriend(friendProfile);
                }
                
                window.history.replaceState({}, document.title);
            }
        };

        autoOpenChat();
    }, [location.state, currentUserId]);
    if (isCheckingAuth) {
        return (
            <section className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </section>
        );
    }

if (!currentUserId) {
        return (
            <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <h2 className="text-3xl font-bold text-white mb-4">{t('chat.unauthorizedTitle')}</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    {t('chat.unauthorizedDesc')}
                </p>
                <Link 
                    to="/login" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    {t('chat.loginButton')}
                </Link>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-100px)]">
            <div className="flex flex-col md:flex-row h-full gap-6 bg-slate-900/30 p-4 rounded-2xl border border-slate-700/50 shadow-xl">
                
                {/* Panel Izquierdo: Lista de Amigos */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    

                    <div className="p-3 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">{t('chat.myStatus')}</span>
                        <select 
                            value={myStatus}
                            onChange={handleStatusChange}
                            className="bg-slate-800 text-sm text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="Disponible">🟢 {t('chat.status.online')}</option>
                            <option value="Ausente">🟡 {t('chat.status.away')}</option>
                            <option value="Ocupado">🔴 {t('chat.status.busy')}</option>
                            <option value="Invisible">⚫ {t('chat.status.offline')}</option>
                        </select>
                    </div>

                    {/* Cabecera de Mensajes */}
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{t('chat.messagesTitle')}</h2>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setIsCreateGroupOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all active:scale-90 text-sm font-medium"
                                title="Crear Nuevo Grupo"
                            >
                                <Users size={16} />
                                <span className="hidden sm:inline">Grupo</span>
                            </button>

                            <button 
                                onClick={() => setIsAddFriendOpen(true)}
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-90"
                                title={t('chat.addFriendTooltip')}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Lista de Amigos */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <FriendList 
                            key={refreshFriends} 
                            currentUserId={currentUserId} 
                            onSelectFriend={handleSelectEntity}
                            selectedFriendId={selectedFriend?.id}
                        />
                    </div>
                </div>

                {/* Panel Derecho: Área de Chat */}
                <div className="w-full md:w-2/3 lg:w-3/4 h-full flex flex-col">
                {!selectedFriend ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50 text-slate-400">
                            <h3 className="text-xl font-medium text-slate-200 mb-2">{t('chat.messagesTitle')}</h3>
                            <p>{t('chat.selectFriend')}</p>
                        </div>
                    ) : loadingRoom ? (
                        <div className="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : roomId ? (
                        <ChatArea 
                            roomId={roomId}
                            currentUserId={currentUserId}
                            friendProfile={selectedFriend}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-red-400 bg-slate-800/30 rounded-xl border border-red-900/50">
                            {t('chat.errorLoading')}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para añadir amigos */}
            {isAddFriendOpen && (
                <AddFriendModal 
                    currentUserId={currentUserId}
                    onClose={() => setIsAddFriendOpen(false)}
                    onFriendAdded={() => setRefreshFriends(prev => prev + 1)}
                />
                
            )}
            {isCreateGroupOpen && (
                <CreateGroupModal
                    currentUserId={currentUserId}
                    onClose={() => setIsCreateGroupOpen(false)}
                    onGroupCreated={(newRoomId, groupProfile) => {
                        setIsCreateGroupOpen(false);
                        setRefreshFriends(prev => prev + 1);
                        setSelectedFriend(groupProfile);
                        setRoomId(newRoomId);
                    }}
                />
            )}
        </section>  
    );
}