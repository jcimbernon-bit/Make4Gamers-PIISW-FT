import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import AuthHeader from '../features/auth/components/AuthHeader';
import { loginWithGoogle, registerWithEmail } from '../features/auth/services/auth.service';

export default function Register() {
    const { t } = useTranslation();
    const [isSuccess, setIsSuccess] = useState(false); 
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
   
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
};

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = t('auth.errors.nameRequired');
        }

        if (!formData.username.trim()) {
            newErrors.username = t('auth.errors.usernameRequired');
        } else if (formData.username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = t('auth.errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('auth.errors.invalidEmail');
        }

        if (!formData.password) {
            newErrors.password = t('auth.errors.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.errors.passwordTooShort');
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmación de contraseña es obligatoria';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.errors.passwordMismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setIsSuccess(false);

    try {
        const { data: authData, error: authError } = await registerWithEmail({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            fullName: formData.fullName,
        });

        if (authError) throw authError;

    

        if (authData.user) {
            setIsSuccess(true);
                const pendingRedirectPath = localStorage.getItem('post_auth_redirect_path');
                const pendingSection = localStorage.getItem('post_auth_account_section');
                const shouldRedirectToAccountPayments = pendingRedirectPath === '/cuenta' && pendingSection === 'payments';

                if (shouldRedirectToAccountPayments && authData.session) {
                    navigate('/cuenta', { state: { initialSection: 'payments' } });
                    return;
                }

                setTimeout(() => navigate('/login'), 3000);
        }

    } catch (error: any) {
        console.error("Error completo:", error);
        
        if (error.message.includes("profiles_pkey")) {
            setErrors({ form: "Este usuario ya tiene un perfil creado. Intenta con otro correo." });
        } else if (error.message.includes("username")) {
            setErrors({ username: "Este nombre de usuario ya está en uso." });
        } else {
            setErrors({ form: error.message || 'Ocurrió un error inesperado' });
        }
    } finally {
        setLoading(false);
    }
};

    const handleGoogleLogin = async () => {
            try {
                const { error } = await loginWithGoogle('http://localhost:5173/');

                if (error) throw error;
                
            } catch (err: any) {
                setErrors({ form: "Error al intentar conectar con Google: " + err.message });
            }
        };

    return (
        <div className="min-h-screen bg-slate-950">
            <AuthHeader />

            {/* Contenido */}
            <div className="flex items-center justify-center px-4 py-8">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full max-w-md">
                    {/* Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">

                        <h1 className="text-3xl font-bold text-white mb-2 text-center">{t('auth.register')}</h1>
                    
                                
                        {isSuccess && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm text-center">
                                ¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta.
                            </div>
                        )}

                        {errors.form && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                                {errors.form}
                            </div>
                        )}
                       
                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre completo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('auth.fullName')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Juan Pérez"
                                    className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                        errors.fullName
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-red-400 text-sm mt-2">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Usuario */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('auth.username')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="juanperez123"
                                    className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                        errors.username
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-400 text-sm mt-2">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                        errors.password
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
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
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirma la contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('auth.confirmPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-800/50 border rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                        errors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Botón de enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Cargando...' : t('auth.registerButton')}
                        </button>
                    </form>

                    {/* Barra de separación */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900/80 text-slate-400">o</span>
                        </div>
                    </div>

                    {/* Boton de google */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all mb-8"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Regístrate con Google
                    </button>

                    {/* Link Inicio de sesión */}
                    <p className="text-center text-slate-400">
                        {t('auth.haveAccount')}{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {t('auth.loginLink')}
                        </Link>
                    </p>
                </div>

                </div>
            </div>
        </div>
    );
}