
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { 
    TicketIcon, 
    AtSymbolIcon, 
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

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
            navigate('/');
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="flex justify-center mx-auto mb-4">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                            <TicketIcon className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Welcome back
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Sign in to continue to your account
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`w-full pl-12 pr-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                                        errors.email 
                                            ? 'border-red-300 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600'
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
                                {errors.email && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className={`w-full pl-12 pr-12 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                                        errors.password 
                                            ? 'border-red-300 dark:border-red-600' 
                                            : 'border-gray-300 dark:border-gray-600'
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
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                    )}
                                </button>
                                {errors.password && (
                                    <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;