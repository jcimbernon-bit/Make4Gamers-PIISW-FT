import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase'; 
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, Clock, XCircle, Filter, MessageSquare,
    User as UserIcon, Calendar, ShieldAlert 
} from 'lucide-react';

export default function AdminSugerencias() {
    const { t, i18n } = useTranslation();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
        try {
          setLoading(true);
          
          const { data: { session }, error: authError } = await supabase.auth.getSession();
          const user = session?.user;

          if (authError || !user) {
              navigate('/');
              return;
          }

          // Verificamos el rol
          const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();

          if (profile?.role !== 'admin') {
              setIsAdmin(false);
              setLoading(false);
              return;
          }

          setIsAdmin(true);

          // Traemos las sugerencias
          const { data, error } = await supabase
              .from('suggestions')
              .select(`
                *,
                profiles ( username )
              `)
              .order('created_at', { ascending: false });

          if (error) throw error;
          setSuggestions(data || []);
        } catch (error) {
          console.error('Error fetching:', error);
        } finally {
          setLoading(false);
        }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setSuggestions(suggestions.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'aceptada': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'descartada': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(i18n.language || 'es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="text-center p-10 text-white">{t('admin.suggestionsPage.checking')}</div>;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
         <h2 className="text-xl font-bold text-white mb-2">{t('admin.suggestionsPage.accessDenied')}</h2>
         <p className="text-slate-400 mb-6">{t('admin.suggestionsPage.accessDeniedDesc')}</p>
         <button onClick={() => navigate('/')} className="text-indigo-400 hover:underline">{t('admin.backHome')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Filter className="text-indigo-400" /> {t('admin.suggestionsPage.title')}
          </h1>
          <p className="text-slate-400">{t('admin.suggestionsPage.subtitle')}</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm">
          {t('admin.suggestionsPage.total', { count: suggestions.length })}
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
            <MessageSquare className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-500 text-xl">{t('admin.suggestionsPage.empty')}</p>
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded border ${getStatusStyle(s.status)}`}>
                      {s.status}
                    </span>
                    <span className="text-indigo-400 text-sm font-medium">{s.category}</span>
                  </div>
                  <p className="text-white text-lg mb-4 leading-relaxed">{s.content}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <UserIcon size={14} /> {s.profiles?.username || t('admin.suggestionsPage.unknownUser')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(s.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <button 
                    onClick={() => updateStatus(s.id, 'en revisión')}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 rounded-lg transition-all text-sm border border-transparent hover:border-amber-500/30"
                  >
                    <Clock size={16} /> {t('admin.suggestionsPage.reviewing')}
                  </button>
                  <button 
                    onClick={() => updateStatus(s.id, 'aceptada')}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 rounded-lg transition-all text-sm border border-transparent hover:border-emerald-500/30"
                  >
                    <CheckCircle size={16} /> {t('admin.suggestionsPage.accept')}
                  </button>
                  <button 
                    onClick={() => updateStatus(s.id, 'descartada')}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-red-600/20 text-slate-300 hover:text-red-400 rounded-lg transition-all text-sm border border-transparent hover:border-red-500/30"
                  >
                    <XCircle size={16} /> {t('admin.suggestionsPage.reject')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
