import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Gamepad2, BarChart2, type LucideIcon } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../../supabase';
import DevDashboard from '../../features/developer/components/DevDashboardSection';
import DevMyGames from '../../features/developer/components/DevMyGamesSection';
import DevStats from '../../features/developer/components/DevStatsSection';

type DevSection = 'dashboard' | 'juegos' | 'estadisticas';

type NavItem = {
  key: DevSection;
  label: string;
  icon: LucideIcon;
};

export default function DeveloperLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [activeSection, setActiveSection] = useState<DevSection>('dashboard');

  const navItems: NavItem[] = [
    { key: 'dashboard', label: t('developer.layout.nav.dashboard'), icon: LayoutDashboard },
    { key: 'juegos',    label: t('developer.layout.nav.games'),     icon: Gamepad2 },
    { key: 'estadisticas', label: t('developer.layout.nav.stats'), icon: BarChart2 },
  ];

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { navigate('/'); return; }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.role !== 'developer' && profile?.role !== 'admin') {
          navigate('/');
          return;
        }

        setAllowed(true);
      } finally {
        setLoading(false);
      }
    };
    void checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        {t('developer.layout.loading')}
      </div>
    );
  }

  if (!allowed) return null;

  const renderSection = () => {
    switch (activeSection) {
      case 'juegos': return <DevMyGames />;
      case 'estadisticas': return <DevStats />;
      default: return <DevDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Page header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_1px] shadow-violet-500/60" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                {t('developer.layout.portalBadge')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('developer.layout.title')}</h1>
            <p className="text-sm text-slate-400">{t('developer.layout.subtitle')}</p>
          </div>
          <Link to="/" className="shrink-0 text-sm text-violet-400 transition-colors hover:text-violet-300">
            {t('developer.layout.backHome')}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:sticky lg:top-20">
            {/* Decorative top bar */}
            <div className="mb-4 h-0.5 w-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-transparent" />

            <nav className="space-y-1.5">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSection(key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    activeSection === key
                      ? 'border-violet-500/40 bg-violet-500/15 text-violet-100'
                      : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon
                    size={16}
                    className={activeSection === key ? 'text-violet-400' : 'text-slate-500'}
                  />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
              <p className="text-xs text-slate-500">
                {t('developer.layout.contactPrompt')}{' '}
                <Link to="/contacto" className="text-violet-400 hover:text-violet-300">
                  {t('developer.layout.contactLink')}
                </Link>
              </p>
            </div>
          </aside>

          {/* Content */}
          <section className="min-h-[600px] rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-6">
            {renderSection()}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
