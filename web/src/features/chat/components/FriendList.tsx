import { useEffect, useState } from 'react';
import { getFriendsList } from '../services/chat.service';
import type { ChatProfile } from '../types/chat.types';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import UserAvatar from '../../../shared/components/UserAvatar';
import { Save } from 'lucide-react';

interface FriendListProps {
    currentUserId: string | null;
    onSelectFriend: (friend: ChatProfile) => void;
    selectedFriendId?: string;
}

export default function FriendList({ currentUserId, onSelectFriend, selectedFriendId }: FriendListProps) {
    const { t } = useTranslation();
    const [friends, setFriends] = useState<ChatProfile[]>([]);
    const [loading, setLoading] = useState(true);
    
   
    const [unreadSenders, setUnreadSenders] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchFriends = async () => {
            if (!currentUserId) return;
            const data = await getFriendsList(currentUserId);
            setFriends(data);
            setLoading(false);
        };
        fetchFriends();
    }, [currentUserId]);

   
    useEffect(() => {
        if (!currentUserId) return;

        const channel = supabase
            .channel('friend-list-messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new;
                    
              
                    if (newMessage.sender_id === currentUserId) return;

                
                    if (newMessage.sender_id !== selectedFriendId) {
                   
                        setUnreadSenders(prev => ({ ...prev, [newMessage.sender_id]: true }));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId, selectedFriendId]);

 
    useEffect(() => {
        if (selectedFriendId) {
            setUnreadSenders(prev => ({ ...prev, [selectedFriendId]: false }));
        }
    }, [selectedFriendId]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Disponible': return 'bg-green-500';
            case 'Ausente': return 'bg-yellow-500';
            case 'Ocupado': return 'bg-red-500';
            default: return 'bg-slate-500'; 
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-slate-400">Cargando amigos...</div>;
    }

    if (friends.length === 0) {
        return <div className="p-4 text-center text-slate-500 text-sm">No tienes amigos añadidos aún. ¡Busca a alguien para chatear!</div>;
    }

    return (
        <div className="flex flex-col">
            {friends.map((friend) => (
                <button
                    key={friend.id}
                    onClick={() => {
                    
                        setUnreadSenders(prev => ({ ...prev, [friend.id]: false }));
                        onSelectFriend(friend);
                    }}
                    className={`flex items-center gap-3 p-3 transition-all text-left border-b border-slate-700/50 hover:bg-slate-700/50 ${
                        selectedFriendId === friend.id ? 'bg-slate-700/80 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'
                    }`}
                >
                    {/* Contenedor del Avatar */}
                    <div className="relative">
                        <UserAvatar src={friend.avatar_url} name={friend.username} size={48} className="shadow-md" />
                        
                        <div 
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${getStatusColor(friend.status)}`}
                            title={friend.status === 'Invisible' ? t('chat.status.disconnected') : 
                                   friend.status === 'Ocupado' ? t('chat.status.busy') : 
                                   friend.status === 'Ausente' ? t('chat.status.away') : 
                                   t('chat.status.online')}
                        ></div>
                    </div>

                    {/* Nombre y texto de estado */}
                    <div className="flex-1 overflow-hidden flex justify-between items-center">
                        <div>
                            <h4 className={`text-sm font-semibold truncate flex items-center gap-1 ${unreadSenders[friend.id] ? 'text-white' : 'text-slate-200'}`}>
                                {friend.username}
                                {friend.subscription_tier === 'premium' && (
                                    <span title="Usuario Premium" className="shrink-0">
                                        <Save size={14} className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                    </span>
                                )}
                            </h4>
                            <p className={`text-xs truncate mt-0.5 ${unreadSenders[friend.id] ? 'text-indigo-300 font-medium' : 'text-slate-400'}`}>
                                {unreadSenders[friend.id] 
                                    ? 'Nuevo mensaje...' 
                                    : (friend.status === 'Invisible' ? t('chat.status.disconnected') : 
                                       friend.status === 'Ocupado' ? t('chat.status.busy') : 
                                       friend.status === 'Ausente' ? t('chat.status.away') : 
                                       t('chat.status.online'))
                                }
                            </p>
                        </div>
                        
                     
                        {unreadSenders[friend.id] && (
                            <div className="flex-shrink-0 ml-2">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}