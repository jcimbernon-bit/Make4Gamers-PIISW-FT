import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';

type DeveloperRequestRow = {
  id: string;
  titulo: string;
  motivo: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  created_at: string;
  user_id: string;
  username: string | null;
};

export default function AdminSolicitudesDev() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DeveloperRequestRow[]>([]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('developer_requests')
      .select('id, titulo, motivo, estado, created_at, user_id')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const userIds = Array.from(new Set(data.map((row) => row.user_id)));
      const usernamesById = new Map<string, string | null>();

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        (profiles ?? []).forEach((profile) => {
          usernamesById.set(profile.id, profile.username ?? null);
        });
      }

      const mapped: DeveloperRequestRow[] = data.map((row) => ({
        ...row,
        username: usernamesById.get(row.user_id) ?? null,
      }));

      setItems(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchRequests();
  }, []);

  const updateStatus = async (id: string, estado: 'aceptada' | 'rechazada') => {
    const { error } = await supabase.from('developer_requests').update({ estado }).eq('id', id);
    if (!error) {
      setItems((prev) => prev.map((row) => (row.id === id ? { ...row, estado } : row)));
    }
  };

  if (loading) return <div className="py-8 text-slate-300">{t('admin.requests.loading')}</div>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">{t('admin.requests.title')}</h2>
        <p className="text-sm text-slate-400">{t('admin.requests.subtitle')}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
          {t('admin.requests.empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">{item.titulo}</p>
                  <p className="text-xs text-slate-400">
                    {item.username ?? t('admin.requests.unknownUser')} - {new Date(item.created_at).toLocaleString(i18n.language || 'es-ES')}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-1 text-xs ${
                    item.estado === 'aceptada'
                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                      : item.estado === 'rechazada'
                        ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                        : 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                  }`}
                >
                  {item.estado}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{item.motivo}</p>

              {item.estado === 'pendiente' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'aceptada')}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    {t('admin.requests.accept')}
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'rechazada')}
                    className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
                  >
                    {t('admin.requests.reject')}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
