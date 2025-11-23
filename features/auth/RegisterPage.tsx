import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import {
    TicketIcon,
    UserIcon,
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

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useThemeStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'km' : 'en';
        i18n.changeLanguage(newLang);
    };

    const passwordStrength = useMemo(() => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthMap = [
            { label: 'Very Weak', color: 'bg-red-500' },
            { label: 'Weak', color: 'bg-orange-500' },
            { label: 'Fair', color: 'bg-yellow-500' },
            { label: 'Good', color: 'bg-blue-500' },
            { label: 'Strong', color: 'bg-green-500' },
            { label: 'Very Strong', color: 'bg-green-600' },
        ];

        return {
            strength: Math.min(strength, 5),
            label: strengthMap[Math.min(strength, 5)].label,
            color: strengthMap[Math.min(strength, 5)].color,
        };
    }, [password]);

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);
        try {
            await authService.register({ username, email, password, confirmPassword });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = useMemo(() => {
        return username.trim().length >= 3 &&
            validateEmail(email) &&
            password.length >= 8 &&
            password === confirmPassword &&
            password.length > 0;
    }, [username, email, password, confirmPassword]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
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
                className="w-full max-w-md z-10 px-4 py-8"
            >
                <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
                    <div className="text-center mb-8">
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
                            {t('auth.createAccount')}
                        </h2>
                        <p className="text-gray-300">
                            {t('auth.joinUs')}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                                {t('auth.username')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.username
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (errors.username) {
                                            setErrors({ ...errors, username: '' });
                                        }
                                    }}
                                />
                                {username && username.length >= 3 && !errors.username && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.username && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-1 text-sm text-red-400"
                                >
                                    {errors.username}
                                </motion.p>
                            )}
                        </div>

                        {/* Email Field */}
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

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.password
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                    placeholder="Create a strong password"
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

                            {/* Password Strength Indicator */}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-400">{t('auth.passwordStrength')}</span>
                                        <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            className={`h-full ${passwordStrength.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <ul className="mt-2 text-xs text-gray-400 space-y-1">
                                        <li className={password.length >= 8 ? 'text-green-400' : ''}>
                                            {password.length >= 8 ? '✓' : '○'} {t('auth.atLeast8Chars')}
                                        </li>
                                        <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                                            {/[A-Z]/.test(password) ? '✓' : '○'} {t('auth.oneUppercase')}
                                        </li>
                                        <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                                            {/[0-9]/.test(password) ? '✓' : '○'} {t('auth.oneNumber')}
                                        </li>
                                    </ul>
                                </motion.div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                {t('auth.confirmPassword')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-900/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.confirmPassword
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : confirmPassword && password === confirmPassword
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: '' });
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-1 text-sm text-red-400"
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        {/* Submit Button */}
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
                                    <span>{t('auth.creatingAccount')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth.createAccount')}</span>
                                    <ArrowRightIcon className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center mt-6 space-y-4">
                            <p className="text-sm text-gray-400">
                                {t('auth.alreadyHaveAccount')} {' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                                >
                                    {t('auth.signInNow')}
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

export default RegisterPage;