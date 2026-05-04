import { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { getFriendsList, createGroupChat } from '../services/chat.service';
import type { ChatProfile } from '../types/chat.types';

interface CreateGroupModalProps {
    currentUserId: string;
    onClose: () => void;
    onGroupCreated: (roomId: string, fakeProfile: ChatProfile) => void;
}

export default function CreateGroupModal({ currentUserId, onClose, onGroupCreated }: CreateGroupModalProps) {
    const [friends, setFriends] = useState<ChatProfile[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFriends = async () => {
            const list = await getFriendsList(currentUserId);
            setFriends(list);
            setLoading(false);
        };
        loadFriends();
    }, [currentUserId]);

    const toggleFriend = (id: string) => {
        setSelectedFriends(prev => 
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        );
    };

    const handleCreateGroup = async () => {
        if (selectedFriends.length < 1) return;
        
        const roomId = await createGroupChat(currentUserId, selectedFriends, "Nuevo Grupo");
        if (roomId) {
            const groupProfile: ChatProfile = {
                id: roomId,
                room_id: roomId,
                username: `Grupo (${selectedFriends.length + 1} pers.)`,
                avatar_url: null,
                status: 'Grupo',
                is_group: true
            };
            onGroupCreated(roomId, groupProfile);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="text-indigo-400" /> Crear Grupo
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                    {loading ? <p className="text-slate-400 text-center">Cargando amigos...</p> : 
                     friends.length === 0 ? <p className="text-slate-400 text-center">Añade amigos primero.</p> :
                     friends.map(friend => (
                        <div key={friend.id} onClick={() => toggleFriend(friend.id)}
                             className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedFriends.includes(friend.id) ? 'bg-indigo-600/20 border border-indigo-500' : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}`}>
                            <input type="checkbox" checked={selectedFriends.includes(friend.id)} readOnly className="rounded text-indigo-500 bg-slate-900 border-slate-600" />
                            <span className="text-slate-200">{friend.username}</span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleCreateGroup} 
                    disabled={selectedFriends.length === 0}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                    Crear Grupo con {selectedFriends.length} amigos
                </button>
            </div>
        </div>
    );
}