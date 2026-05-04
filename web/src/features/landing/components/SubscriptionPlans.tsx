
import { useNavigate } from 'react-router-dom'

const PLANS = [
    {
        area: 'Cuenta y progreso',
        gratis: 'Perfil, sesión y guardado base',
        premium: 'Más personalización del perfil e icono único',
    },
    {
        area: 'Juegos y ranking',
        gratis: 'Catálogo limitado y tablas principales',
        premium: 'Juegos exclusivos, eetos destacados y prioridad en novedades',
    },
    {
        area: 'Social',
        gratis: 'Amigos y chat',
        premium: 'Eventos y ventajas de comunidad',
    },
    {
        area: 'Logros',
        gratis: 'Logros base de móvil',
        premium: 'Insignias, recompensas visuales y mayor puntos en juegos seleccionados',
    },
]

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M2.5 7L5.5 10L11.5 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function StarIcon() {
    return (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
            <polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" />
        </svg>
    )
}

export default function SubscriptionPlans() {
    const navigate = useNavigate()

    const handleFreePlanClick = () => {
        navigate('/register')
    }

    const handlePremiumPlanClick = () => {
        localStorage.setItem('post_auth_redirect_path', '/cuenta')
        localStorage.setItem('post_auth_account_section', 'payments')
        navigate('/register')
    }

    return (
        <section className="relative w-full overflow-hidden py-24 px-4 md:px-8">

            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(163,230,53,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.8) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Header */}
            <div className="relative mb-14 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-lime-300/70">Suscripción</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
                    Elige tu generación
                </h2>
                <p className="mt-4 text-sm text-slate-400">
                    Empieza gratis y desbloquea todo cuando estés listo.
                </p>
                <div className="mx-auto mt-8 h-px w-48 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />
            </div>

            {/* Cards */}
            <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">

                {/* ── RETRO ── */}
                <div className="group relative flex flex-col rounded-2xl border border-lime-400/20 bg-slate-950 p-8 transition-all duration-300 hover:border-lime-400/35 hover:shadow-[0_0_50px_rgba(163,230,53,0.07)]">

                    {/* Corner accents */}
                    <div className="pointer-events-none absolute top-0 left-0 h-6 w-6 rounded-tl-2xl border-t-2 border-l-2 border-lime-400/50 transition-colors duration-300 group-hover:border-lime-400/80" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 rounded-br-2xl border-b-2 border-r-2 border-lime-400/15 transition-colors duration-300 group-hover:border-lime-400/30" />

                    {/* Plan label */}
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.45em] text-lime-400/50">Plan</span>
                    <h3 className="text-4xl font-black uppercase tracking-tight text-lime-200 drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">
                        Retro
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Lo esencial para empezar.</p>
                    <div className="mt-3 mb-7 h-px w-16 bg-gradient-to-r from-lime-400/70 via-lime-300/30 to-transparent" />

                    {/* Price */}
                    <div className="mb-8 flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter text-white">Gratis</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">/ para siempre</span>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-4">
                        {PLANS.map((plan) => (
                            <li key={plan.area} className="flex items-start gap-3">
                                <span className="mt-0.5 flex-shrink-0 text-lime-400">
                                    <CheckIcon />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/45">
                                        {plan.area}
                                    </p>
                                    <p className="text-sm leading-snug text-slate-300">{plan.gratis}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button
                        onClick={handleFreePlanClick}
                        className="w-full cursor-pointer rounded-xl border border-lime-400/30 bg-transparent py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-lime-300 transition-all duration-200 hover:border-lime-400/55 hover:bg-lime-400/5 hover:shadow-[0_0_22px_rgba(163,230,53,0.1)] focus:outline-none focus:ring-2 focus:ring-lime-400/40 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                        Empezar gratis
                    </button>
                </div>

                {/* ── NEXT GEN ── */}
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-violet-500/35 bg-gradient-to-br from-violet-950/65 via-slate-950 to-slate-950 p-8 transition-all duration-300 hover:border-violet-400/55 hover:shadow-[0_0_70px_rgba(139,92,246,0.18)]">

                    {/* Top neon line */}
                    <div className="pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/90 to-transparent shadow-[0_0_10px_rgba(167,139,250,0.8)]" />

                    {/* Ambient glow blob */}
                    <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl transition-opacity duration-300 group-hover:opacity-150" />

                    {/* Corner accents */}
                    <div className="pointer-events-none absolute top-0 right-0 h-6 w-6 rounded-tr-2xl border-t-2 border-r-2 border-violet-400/60 transition-colors duration-300 group-hover:border-violet-400/90" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 rounded-bl-2xl border-b-2 border-l-2 border-violet-400/15 transition-colors duration-300 group-hover:border-violet-400/35" />

                    {/* Recommended badge */}
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                            <StarIcon />
                            Destacado
                        </span>
                    </div>

                    {/* Plan label */}
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.45em] text-violet-400/50">Plan</span>
                    <h3 className="text-4xl font-black uppercase tracking-tight text-violet-300 drop-shadow-[0_0_18px_rgba(139,92,246,0.65)]">
                        Next Gen
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Todo el poder. Sin límites.</p>
                    <div className="mt-3 mb-7 h-px w-20 bg-gradient-to-r from-violet-500/90 via-violet-400/35 to-transparent shadow-[0_0_8px_rgba(167,139,250,0.35)]" />

                    {/* Price */}
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter text-white">4,99€</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">/ mes</span>
                        </div>

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-4">
                        {PLANS.map((plan) => (
                            <li key={plan.area} className="flex items-start gap-3">
                                <span className="mt-0.5 flex-shrink-0 text-violet-400">
                                    <CheckIcon />
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/45">
                                        {plan.area}
                                    </p>
                                    <p className="text-sm font-medium leading-snug text-slate-200">{plan.premium}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button 
                        onClick={handlePremiumPlanClick}
                        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all duration-200 hover:from-violet-500 hover:to-violet-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.45)] focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-slate-950">
                        Unirme al futuro
                    </button>
                </div>
            </div>

            {/* Bottom neon divider */}
            <div className="mx-auto mt-16 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />
        </section>
    )
}
