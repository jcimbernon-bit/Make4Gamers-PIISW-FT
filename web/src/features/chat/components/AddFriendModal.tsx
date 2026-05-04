
import { useState } from 'react';
import { Search, UserPlus, X, Loader2 } from 'lucide-react';
import { searchUsers, addFriend } from '../services/friend.service.ts';
import type { ChatProfile } from '../types/chat.types';
import UserAvatar from '../../../shared/components/UserAvatar';

interface AddFriendModalProps {
  currentUserId: string;
  onClose: () => void;
  onFriendAdded: () => void; // Para avisar que debe recargar la lista de amigos
}

export default function AddFriendModal({ currentUserId, onClose, onFriendAdded }: AddFriendModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ChatProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    const users = await searchUsers(currentUserId, searchTerm);
    setResults(users);
    setIsSearching(false);
  };

  const handleAddFriend = async (targetUserId: string) => {
    setIsAdding(targetUserId);
    const success = await addFriend(currentUserId, targetUserId);
    
    if (success) {
      // Si se añadió con éxito, avisamos al padre y cerramos
      onFriendAdded();
      onClose();
    } else {
      alert("Hubo un error al añadir al amigo.");
    }
    setIsAdding(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-lg font-bold text-white">Añadir nuevo amigo</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Escribe el nombre de usuario..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Buscar'}
            </button>
          </form>

          {/* Resultados */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {results.length === 0 && !isSearching && searchTerm && (
              <p className="text-center text-slate-500 text-sm py-4">No se encontraron usuarios con ese nombre.</p>
            )}

            {results.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <UserAvatar src={user.avatar_url} name={user.username} size={40} />
                  <span className="font-medium text-slate-200">{user.username}</span>
                </div>
                
                <button
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isAdding === user.id}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAdding === user.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Añadir
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}