import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import {
    TicketIcon,
    AtSymbolIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    SunIcon,
    MoonIcon,
    GlobeAltIcon
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/themeStore';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useThemeStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'km' : 'en';
        i18n.changeLanguage(newLang);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid = useMemo(() => {
        return validateEmail(email) && password.length > 0;
    }, [email, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (password.length === 0) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);
        setErrors({});
        try {
            const { user, accessToken } = await authService.login(email, password);
            login(user, accessToken);
            toast.success(`Welcome back, ${user.username}!`);
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            toast.error(errorMessage);
            if (errorMessage.toLowerCase().includes('password')) {
                setErrors({ password: 'Invalid password' });
            } else if (errorMessage.toLowerCase().includes('email')) {
                setErrors({ email: 'Invalid email address' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-primary-900/40 backdrop-blur-sm" />

            {/* Top Controls */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors duration-200 text-sm font-medium text-white"
                >
                    <GlobeAltIcon className="h-5 w-5" />
                    <span>{i18n.language === 'en' ? 'EN' : 'KH'}</span>
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors duration-200 text-white"
                >
                    {theme === "light" ? (
                        <MoonIcon className="h-5 w-5" />
                    ) : (
                        <SunIcon className="h-5 w-5 text-yellow-400" />
                    )}
                </button>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10 px-4"
            >
                <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="flex justify-center mx-auto mb-6"
                        >
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg shadow-primary-500/30">
                                <TicketIcon className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {t('auth.welcomeBack')}
                        </h2>
                        <p className="text-gray-300">
                            {t('auth.enterDetails')}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                {t('auth.email')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AtSymbolIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.email
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) {
                                            setErrors({ ...errors, email: '' });
                                        }
                                    }}
                                />
                                {email && validateEmail(email) && !errors.email && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-1 text-sm text-red-400"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                    {t('auth.password')}
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-gray-200 hover:text-primary-300"
                                >
                                    {t('auth.forgotPassword')}
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.password
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) {
                                            setErrors({ ...errors, password: '' });
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-1 text-sm text-red-400"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{t('auth.signingIn')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth.signIn')}</span>
                                    <ArrowRightIcon className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center mt-6 space-y-4">
                            <p className="text-sm text-gray-400">
                                {t('auth.noAccount')} {' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                                >
                                    {t('auth.createOne')}
                                </Link>
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                {t('auth.backToDashboard')}
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;