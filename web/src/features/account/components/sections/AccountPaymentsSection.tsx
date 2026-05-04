import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2, AlertCircle, RefreshCw, Save, CreditCard, Lock, X } from 'lucide-react';
import { updateAccountProfile } from '../../services/account.service';

interface AccountPaymentsSectionProps {
  userId: string;
  currentTier: string;
  onUpgradeSuccess: () => void;
}

// --- DATOS Y COMPONENTES VISUALES ---

const PLANS = [
  {
      area: 'Cuenta y progreso',
      gratis: 'Perfil, sesión y guardado base',
      premium: 'Más personalización del perfil e icono único',
  },
  {
      area: 'Juegos y ranking',
      gratis: 'Catálogo limitado y tablas principales',
      premium: 'Juegos exclusivos, retos destacados y prioridad en novedades',
  },
  {
      area: 'Social',
      gratis: 'Amigos y chat',
      premium: 'Eventos y ventajas de comunidad',
  },
  {
      area: 'Logros',
      gratis: 'Logros base de móvil',
      premium: 'Insignias, recompensas visuales y mayor puntos',
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
          <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  );
}

// --- COMPONENTE PRINCIPAL ---

export function AccountPaymentsSection({ userId, currentTier, onUpgradeSuccess }: AccountPaymentsSectionProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Estados del formulario de pago
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const isPremium = currentTier === 'premium';

  // --- Formateadores de la pasarela ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    const formattedValue = value.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      setExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').substring(0, 3));
  };

  // Validaciones
  const isFormValid = 
    cardName.trim().length >= 3 && 
    cardNumber.length === 19 && // 16 digitos + 3 espacios
    expiry.length === 5 &&      // MM/AA
    cvv.length === 3;

  // --- Lógica de la API ---
  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulamos que el banco procesa
      await updateAccountProfile(userId, { subscription_tier: 'premium' } as any);
      setShowPaymentModal(false);
      setShowSuccess(true);
      setTimeout(() => onUpgradeSuccess(), 2500);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pago.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDowngrade = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateAccountProfile(userId, { subscription_tier: 'free' } as any);
      setShowDowngradeConfirm(false);
      onUpgradeSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar de plan.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Vistas ---
  
  if (showSuccess) {
    return (
      <div className="bg-slate-950 rounded-2xl border border-violet-500/50 p-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 shadow-[0_0_50px_rgba(139,92,246,0.2)] relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-600/10 blur-3xl" />
        <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-6 relative z-10 border border-violet-400/30">
          <Check size={40} className="text-violet-400 drop-shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 relative z-10 uppercase tracking-tight">¡Bienvenido al Futuro!</h2>
        <p className="text-slate-300 text-lg relative z-10">Tu pago de 4,99€ se ha procesado con éxito.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* --- MODAL DE PAGO FALSO --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-violet-500/30 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-violet-600/5 blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3 text-violet-400">
                <CreditCard size={28} />
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Pasarela Segura</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 relative z-10 bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Plan Seleccionado</p>
                <p className="text-lg font-bold text-white">Generación Next Gen</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">4,99€</p>
                <p className="text-xs text-slate-500">/mes (IVA inc.)</p>
              </div>
            </div>

            <form className="space-y-4 relative z-10" onSubmit={(e) => { e.preventDefault(); if (isFormValid) handleUpgrade(); }}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Titular de la Tarjeta</label>
                <input 
                  type="text" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} // Solo letras
                  placeholder="Ej. John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Número de Tarjeta</label>
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Caducidad</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">CVV</label>
                  <input 
                    type="password" 
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="***"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:from-violet-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={16} /> Pagar 4,99€ seguiros</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DOWNGRADE --- */}
      {showDowngradeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold text-white">¿Volver al Plan Retro?</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Al volver al plan gratuito, perderás el emblema dorado y tus ventajas exclusivas.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDowngradeConfirm(false)} className="flex-1 py-3 rounded-xl font-bold border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors">Cancelar</button>
              <button onClick={handleDowngrade} disabled={isProcessing} className="flex-1 py-3 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera de Sección */}
      <div className="relative mb-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl uppercase">Suscripción</h2>
        <p className="mt-2 text-sm text-slate-400">Gestiona tu nivel generacional en la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative">
        
        {/* --- PLAN RETRO (FREE) --- */}
        <div className="group relative z-10 flex flex-col rounded-2xl border border-lime-400/20 bg-slate-950 p-8 transition-all duration-300 hover:border-lime-400/40 hover:shadow-[0_0_40px_rgba(163,230,53,0.05)]">
          <div className="pointer-events-none absolute top-0 left-0 h-6 w-6 rounded-tl-2xl border-t-2 border-l-2 border-lime-400/30 transition-colors group-hover:border-lime-400/60" />
          
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.45em] text-lime-400/50">Plan</span>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-black uppercase tracking-tight text-lime-200">Retro</h3>
            {!isPremium && (
              <span className="bg-lime-400/10 px-2 py-1 text-[10px] font-bold uppercase text-lime-400 border border-lime-400/20 rounded-md">Tu Generación</span>
            )}
          </div>

          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-white">Gratis</span>
          </div>

          <ul className="mb-8 flex-1 space-y-5">
            {PLANS.map((plan) => (
              <li key={plan.area} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-lime-400"><CheckIcon /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/45">{plan.area}</p>
                  <p className="text-sm leading-snug text-slate-300">{plan.gratis}</p>
                </div>
              </li>
            ))}
          </ul>

          {isPremium ? (
            <button onClick={() => setShowDowngradeConfirm(true)} className="w-full py-3.5 rounded-xl border border-slate-700 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
              <RefreshCw size={14} /> Volver a Retro
            </button>
          ) : (
            <button disabled className="w-full py-3.5 rounded-xl border border-lime-400/10 bg-lime-400/5 text-xs font-bold uppercase tracking-[0.2em] text-lime-400/40 cursor-not-allowed">Plan Activo</button>
          )}
        </div>

        {/* --- PLAN NEXT GEN (PREMIUM) --- */}
        <div className="group relative z-10 flex flex-col overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/40 to-slate-950 p-8 transition-all duration-300 hover:border-violet-400/60 hover:shadow-[0_0_60px_rgba(139,92,246,0.15)]">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/80 to-transparent" />
          
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.45em] text-violet-400/60">Plan</span>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]">Next Gen</h3>
            {isPremium && (
              <span className="bg-violet-500/20 px-2 py-1 text-[10px] font-bold uppercase text-violet-400 border border-violet-500/30 rounded-md">Tu Generación</span>
            )}
          </div>

          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-white">4,99€</span>
            <span className="text-sm font-bold text-violet-400/60 uppercase">/mes</span>
          </div>

          <ul className="mb-8 flex-1 space-y-5">
            {PLANS.map((plan) => (
              <li key={plan.area} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-violet-400"><CheckIcon /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/45">{plan.area}</p>
                  <p className="text-sm leading-snug text-slate-200">
                    {plan.area === 'Cuenta y progreso' ? (
                      <span className="flex items-center gap-1.5">
                        {plan.premium} <Save size={14} className="text-yellow-500 fill-yellow-500/20" />
                      </span>
                    ) : plan.premium}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {!isPremium ? (
            <button 
              onClick={() => setShowPaymentModal(true)}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:from-violet-500 transition-all flex items-center justify-center gap-2">
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : "Unirme al Futuro"}
            </button>
          ) : (
            <button disabled className="w-full py-4 rounded-xl border border-violet-500/20 bg-violet-500/5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400/40 cursor-not-allowed">Generación Activa</button>
          )}
        </div>

      </div>
    </div>
  );
}