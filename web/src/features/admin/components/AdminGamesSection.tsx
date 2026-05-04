import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import { useNavigate } from 'react-router-dom';
import { 
    Gamepad2, Trash2, Eye, EyeOff, Lock, CheckCircle, 
    AlertTriangle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

type GameRow = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  genre: string | null;
  status: 'draft' | 'review' | 'published';
  created_at: string;
};

export default function AdminGamesSection() {
  const { t } = useTranslation();
  const [games, setGames] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      await fetchGames();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('id, title, thumbnail_url, genre, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error al cargar los juegos');
      return;
    }
    setGames(data || []);
  };

  const updateGameStatus = async (gameId: string, newStatus: 'draft' | 'review' | 'published') => {
    setUpdatingId(gameId);
    try {
      const { error } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (error) throw error;

    
      setGames(games.map(g => g.id === gameId ? { ...g, status: newStatus } : g));
      toast.success(`Estado actualizado a: ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar el estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteGame = async (gameId: string, gameTitle: string) => {
    if (!window.confirm(`¿Estás completamente seguro de que quieres eliminar "${gameTitle}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setUpdatingId(gameId);
      const { error } = await supabase.from('games').delete().eq('id', gameId);
      if (error) throw error;

      setGames(games.filter(g => g.id !== gameId));
      toast.success('Juego eliminado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar el juego');
    } finally {
      setUpdatingId(null);
    }
  };

 
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"><CheckCircle size={12}/> Público</span>;
      case 'review':
        return <span className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400"><Lock size={12}/> Premium Beta</span>;
      case 'draft':
      default:
        return <span className="flex items-center gap-1.5 rounded-full border border-slate-500/40 bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400"><EyeOff size={12}/> Oculto (Draft)</span>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin text-indigo-500" size={32} /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="text-indigo-400" />
            Gestión del Catálogo
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Controla qué juegos son públicos, exclusivos para Premium o están ocultos.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
          <span className="text-indigo-300 font-medium text-sm">Total: {games.length} juegos</span>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Juego</th>
                <th className="px-6 py-4 font-semibold">Estado Actual</th>
                <th className="px-6 py-4 font-semibold">Cambiar Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {games.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No hay juegos en la base de datos.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-800/20 transition-colors group">
                    
                    {/* INFO JUEGO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                          {game.thumbnail_url ? (
                            <img src={game.thumbnail_url} alt={game.title} className="h-full w-full object-cover" />
                          ) : (
                            <Gamepad2 className="h-full w-full p-3 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{game.title}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">{game.genre || 'Sin categoría'}</div>
                        </div>
                      </div>
                    </td>

                    {/* ESTADO ACTUAL */}
                    <td className="px-6 py-4">
                      {renderStatusBadge(game.status)}
                    </td>

                    {/* SELECTOR DE ESTADO */}
                    <td className="px-6 py-4">
                      <select
                        value={game.status}
                        disabled={updatingId === game.id}
                        onChange={(e) => updateGameStatus(game.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="draft">Borrador (Oculto)</option>
                        <option value="review">En Revisión (Premium)</option>
                        <option value="published">Publicado (Todos)</option>
                      </select>
                    </td>

                    {/* BOTÓN ELIMINAR */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteGame(game.id, game.title)}
                        disabled={updatingId === game.id}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar juego"
                      >
                        {updatingId === game.id ? <RefreshCw className="animate-spin" size={20} /> : <Trash2 size={20} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}