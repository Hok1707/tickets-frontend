import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/themeStore';
import { SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const PublicNavbar = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useThemeStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'km' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                        TicketFlow
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                    >
                        <GlobeAltIcon className="h-5 w-5" />
                        <span>{i18n.language === 'en' ? 'EN' : 'KH'}</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        {theme === "light" ? (
                            <MoonIcon className="h-5 w-5" />
                        ) : (
                            <SunIcon className="h-5 w-5 text-yellow-400" />
                        )}
                    </button>
                    <Link to="/login">
                        <Button variant="ghost">{t('landing.login')}</Button>
                    </Link>
                    <Link to="/register">
                        <Button>{t('landing.getStarted')}</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
