import { useState, useEffect } from 'react';
import { UserPlus, Check, X, Users, AlertCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { friendshipService } from '../services/friendship.service';
import { supabase } from '../../../supabase';
import UserAvatar from '../../../shared/components/UserAvatar';

export default function FriendManager() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [usernameToAdd, setUsernameToAdd] = useState('');

  //Al abrir el componente, busca quien es el usuario logueado
    useEffect(() => {
        const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
            loadFriendships(user.id);
        } else {
            setLoading(false);
        }
        };
        getUser();
    }, []);

    //Descargar sus amigos y solicitudes pendientes
    const loadFriendships = async (userId: string) => {
        setLoading(true);
        try {
        const [requests, myFriends] = await Promise.all([
            friendshipService.getPendingRequests(userId),
            friendshipService.getFriends(userId)
        ]);
        setPendingRequests(requests || []);
        setFriends(myFriends || []);
        } catch (err: any) {
        setError("Error al cargar amistades: " + err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleAccept = async (requestId: string) => {
        try {
        await friendshipService.acceptFriendRequest(requestId);
        if (currentUserId) loadFriendships(currentUserId); //Recargar las listas
        } catch (err: any) {
        setError(err.message);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
        await friendshipService.rejectFriendRequest(requestId);
        if (currentUserId) loadFriendships(currentUserId);
        } catch (err: any) {
        setError(err.message);
        }
    };

const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg(''); 
        
        if (!usernameToAdd.trim() || !currentUserId) return;

        try {
      
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', usernameToAdd.trim())
            .single();

        if (profileError || !profile) {
            throw new Error('No se encontró ningún usuario con ese nombre.');
        }

        if (profile.id === currentUserId) {
            throw new Error('No puedes enviarte una solicitud a ti mismo.');
        }

       
        await friendshipService.sendFriendRequest(currentUserId, profile.id);
        setUsernameToAdd('');
        
      
        setSuccessMsg('¡Solicitud enviada con éxito!');
        setTimeout(() => {
            setSuccessMsg(''); 
        }, 3000);
        
        } catch (err: any) {
        setError(err.message);
        }
    };

    //Interfaz
    if (loading) {
        return <div className="text-slate-400 p-4">Cargando comunidad...</div>;
    }

    if (!currentUserId) {
        return <div className="text-slate-400 p-4">Debes iniciar sesión para ver tus amigos.</div>;
    }

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-xl">
        
        {/* Cabecera */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Users size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Comunidad</h2>
        </div>

        {/* Mostrar errores si los hay */}
        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
            </div>
        )}

       
        {successMsg && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center gap-2 animate-pulse">
            <Check size={18} />
            {successMsg}
            </div>
        )}
        <div className="space-y-8">
            
            {/* Buscador para añadir amigos */}
            <section>
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Añadir nuevo amigo</h3>
            <form onSubmit={handleSendRequest} className="flex gap-2">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    value={usernameToAdd}
                    onChange={(e) => setUsernameToAdd(e.target.value)}
                    placeholder="Escribe el nombre de usuario..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                </div>
                <button
                type="submit"
                disabled={!usernameToAdd.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Enviar</span>
                </button>
            </form>
            </section>

            {/* Solicitudes pendientes */}
            {pendingRequests.length > 0 && (
            <section>
                <h3 className="text-sm font-medium text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                Solicitudes Pendientes ({pendingRequests.length})
                </h3>
                <div className="space-y-2">
                {pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <UserAvatar src={req.sender?.avatar_url} name={req.sender?.username} size={40} />
                        <div>
                        <p className="text-white font-medium">{req.sender?.username}</p>
                        <p className="text-xs text-slate-500">Quiere ser tu amigo</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                        onClick={() => handleAccept(req.id)}
                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-md transition-colors"
                        title="Aceptar"
                        >
                        <Check size={18} />
                        </button>
                        <button 
                        onClick={() => handleReject(req.id)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                        title="Rechazar"
                        >
                        <X size={18} />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Lista de amigos */}
            <section>
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Mis Amigos ({friends.length})</h3>
            {friends.length === 0 ? (
                <div className="text-center p-6 bg-slate-800/20 border border-slate-800/50 rounded-lg border-dashed">
                <p className="text-slate-500">Aún no tienes amigos añadidos.</p>
                <p className="text-slate-600 text-sm mt-1">Usa el buscador de arriba para empezar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map((friend) => (
                    // NUEVO: Cambiamos div por Link y le pasamos la URL con el nombre del amigo
                    <Link 
                      to={`/usuario/${friend.friendProfile?.username}`}
                      key={friend.friendshipId} 
                      className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                    >
                      <div className="relative">
                          <UserAvatar src={friend.friendProfile?.avatar_url} name={friend.friendProfile?.username} size={40} />
                          {/* Indicador de estado (Online/Offline) */}
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${friend.friendProfile?.status === 'Disponible' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                      </div>
                      <div>
                          <p className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">
                            {friend.friendProfile?.username}
                          </p>
                          <p className="text-xs text-slate-400">{friend.friendProfile?.status || 'Desconectado'}</p>
                      </div>
                    </Link>
                ))}
                </div>
            )}
            </section>

        </div>
        </div>
    );
}