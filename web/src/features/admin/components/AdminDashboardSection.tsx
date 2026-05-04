import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';

type Card = {
  title: string;
  value: number;
  to: string;
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const [pendingTickets, pendingSuggestions, pendingDevRequests] = await Promise.all([
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).neq('estado', 'Resuelto'),
          supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('status', 'en revision'),
          supabase.from('developer_requests').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
        ]);

        setCards([
          {
            title: t('admin.pendingTickets', { defaultValue: 'Tickets pendientes' }),
            value: pendingTickets.count ?? 0,
            to: '/admin/tickets',
          },
          {
            title: t('admin.pendingSuggestions', { defaultValue: 'Sugerencias en revision' }),
            value: pendingSuggestions.count ?? 0,
            to: '/admin/sugerencias',
          },
          {
            title: t('admin.pendingDevRequests', { defaultValue: 'Solicitudes dev pendientes' }),
            value: pendingDevRequests.count ?? 0,
            to: '/admin/solicitudes',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    void loadMetrics();
  }, [t]);

  if (loading) {
    return <div className="py-8 text-slate-300">{t('admin.loading', { defaultValue: 'Cargando panel de administracion...' })}</div>;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-white">{t('admin.dashboard', { defaultValue: 'Panel' })}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 transition-colors hover:border-indigo-500/40"
          >
            <p className="text-sm text-slate-400">{card.title}</p>
            <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
