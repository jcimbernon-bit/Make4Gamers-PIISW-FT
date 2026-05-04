import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, Clock, MessageSquare,
    User as UserIcon, Calendar, ShieldAlert, LifeBuoy, AlertTriangle
} from 'lucide-react';

export default function AdminTickets() {
    const { t, i18n } = useTranslation();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
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

          const { data, error } = await supabase
              .from('support_tickets')
              .select(`
                *,
                profiles ( username )
              `)
              .order('created_at', { ascending: false });

          if (error) throw error;
          setTickets(data || []);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        } finally {
          setLoading(false);
        }
  };

  const updateTicketStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ estado: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setTickets(tickets.map(t => t.id === id ? { ...t, estado: newStatus } : t));
    } catch (error) {
      alert('Error al actualizar el ticket');
    }
  };

  const getPriorityStyle = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Alta': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Resuelto': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'En revisión': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600'; // Pendiente
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(i18n.language || 'es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const ticketsFiltrados = tickets.filter((ticket) => {
    const cumplePrioridad = filtroPrioridad === 'Todas' || ticket.prioridad === filtroPrioridad;
    const cumpleEstado = filtroEstado === 'Todos' || ticket.estado === filtroEstado;
    return cumplePrioridad && cumpleEstado;
  });

  if (loading) return <div className="text-center p-10 text-white">{t('admin.ticketsPage.loading')}</div>;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{t('admin.ticketsPage.accessDenied')}</h2>
        <p className="text-slate-400 mb-6">{t('admin.ticketsPage.accessDeniedDesc')}</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 hover:underline">{t('admin.backHome')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LifeBuoy className="text-indigo-400" /> {t('admin.ticketsPage.title')}
          </h1>
          <p className="text-slate-400">{t('admin.ticketsPage.subtitle')}</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Todas">Prioridad: Todas</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Normal">Normal</option>
          </select>

          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Todos">Estado: Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {ticketsFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
            <MessageSquare className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-500 text-xl">{t('admin.ticketsPage.empty')}</p>
          </div>
        ) : (
          ticketsFiltrados.map((ticket) => (
            <div key={ticket.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-mono text-sm text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      {ticket.ticket_number}
                    </span>
                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded border ${getStatusStyle(ticket.estado)}`}>
                      {ticket.estado}
                    </span>
                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded border flex items-center gap-1 ${getPriorityStyle(ticket.prioridad)}`}>
                       {ticket.prioridad === 'Urgente' && <AlertTriangle size={12} />}
                       {ticket.prioridad}
                    </span>
                    <span className="text-indigo-400 text-sm font-medium ml-2">{ticket.categoria}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{ticket.asunto}</h3>
                  <p className="text-slate-300 text-md mb-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 leading-relaxed">
                    {ticket.mensaje}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <UserIcon size={14} /> {ticket.profiles?.username || t('admin.ticketsPage.unknownUser')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {ticket.estado !== 'En revisión' && ticket.estado !== 'Resuelto' && (
                    <button 
                      onClick={() => updateTicketStatus(ticket.id, 'En revisión')}
                      className="flex justify-center items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 rounded-lg transition-all text-sm border border-transparent hover:border-amber-500/30"
                    >
                      <Clock size={16} /> {t('admin.ticketsPage.reviewing')}
                    </button>
                  )}
                  {ticket.estado !== 'Resuelto' && (
                    <button 
                      onClick={() => updateTicketStatus(ticket.id, 'Resuelto')}
                      className="flex justify-center items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 rounded-lg transition-all text-sm border border-transparent hover:border-emerald-500/30"
                    >
                      <CheckCircle size={16} /> {t('admin.ticketsPage.resolve')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
