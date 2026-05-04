import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { loginWithEmail, loginWithGoogle } from '../features/auth/services/auth.service';
import AuthHeader from '../features/auth/components/AuthHeader';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // ESTADO: Interruptor para el Modo Invitado
  const [mostrarAvisoInvitado, setMostrarAvisoInvitado] = useState(false);
  
  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estados de Datos y Errores
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired') || "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail') || "Email no válido";
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired') || "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error: supabaseError } = await loginWithEmail(
        formData.email,
        formData.password,
      );

      if (supabaseError) {
        const message = supabaseError.message === "Invalid login credentials"
          ? "Credenciales incorrectas, revise los campos"
          : supabaseError.message;
        
        setErrors({ auth: message });
        setLoading(false);
        return;
      }

      if (data.user) {
        const pendingRedirectPath = localStorage.getItem('post_auth_redirect_path');
        const pendingSection = localStorage.getItem('post_auth_account_section');

        if (pendingRedirectPath === '/cuenta' && pendingSection === 'payments') {
          navigate('/cuenta', { state: { initialSection: 'payments' } });
          localStorage.removeItem('post_auth_redirect_path');
          localStorage.removeItem('post_auth_account_section');
          return;
        }

        navigate("/"); //Ruta de exito
      }
    } catch (err) {
      setErrors({ auth: "Ocurrió un error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.auth) {
      setErrors(prev => ({ ...prev, [name]: '', auth: '' }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await loginWithGoogle('http://localhost:5173/');

      if (error) throw error;
      
    } catch (err: any) {
      setErrors({ auth: "Error al intentar conectar con Google: " + err.message });
    }
  };

  const handleEntrarComoInvitado = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300">
            
            {!mostrarAvisoInvitado ? (
              
              /* Pantalla Login */
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                  {t('auth.login') || "Iniciar Sesión"}
                </h1>
                
                <p className="text-slate-400 text-center mb-8 text-sm">
                  Ingresa tus credenciales para acceder
                </p>

                {/* Error General de Auth */}
                {errors.auth && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    {errors.auth}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('auth.email') || "Correo Electrónico"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input
                        type="email"
                        name="email"
                        disabled={loading}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('auth.password') || "Contraseña"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        disabled={loading}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border border-slate-700 bg-slate-800 accent-indigo-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300">{t('auth.rememberMe') || "Recordarme"}</span>
                    </label>
                    <Link to="/recuperar-password" title="Recuperar" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      {t('auth.forgotPassword') || "¿Olvidaste la contraseña?"}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
                  >
                    {loading ? (t('auth.loading') || "Cargando...") : (t('auth.loginButton') || "Entrar")}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-500">{t('auth.or') || "O continúa con"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Boton Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>

                  {/* Boton Invitado */}
                  <button
                    type="button"
                    onClick={() => setMostrarAvisoInvitado(true)}
                    className="w-full flex items-center justify-center gap-2 bg-transparent border border-slate-700 hover:bg-slate-800/50 text-slate-300 font-medium py-3 rounded-lg transition-all"
                  >
                    Continuar sin iniciar sesión
                  </button>
                </div>

                <p className="text-center text-slate-400 mt-8 text-sm">
                  {t('auth.noAccount') || "¿No tienes cuenta?"}{' '}
                  <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    {t('auth.registerLink') || "Regístrate gratis"}
                  </Link>
                </p>
              </div>

            ) : (

              /* Pantalla Aviso Modo Invitado */
              <div className="animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
                    <Info size={32} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 text-center">
                  Modo Invitado
                </h2>
                
                <p className="text-slate-400 text-center mb-6 text-sm">
                  Podrás explorar la plataforma, pero tendrás las siguientes limitaciones:
                </p>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">•</div>
                    <p className="text-sm text-slate-300">No podrás guardar tus puntuaciones en los juegos.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">•</div>
                    <p className="text-sm text-slate-300">No aparecerás en las tablas de ranking globales.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">•</div>
                    <p className="text-sm text-slate-300">No podrás participar ni escribir en el chat general de la comunidad.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleEntrarComoInvitado}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98]"
                  >
                    Entendido, entrar como invitado
                  </button>

                  <button
                    onClick={() => setMostrarAvisoInvitado(false)}
                    className="w-full bg-transparent hover:bg-slate-800 text-slate-400 font-medium py-3 rounded-lg transition-all"
                  >
                    Volver a inicio de sesión
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}