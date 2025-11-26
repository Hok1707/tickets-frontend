import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}
            aria-label="Toggle Theme"
        >
            <motion.div
                className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{
                    x: theme === 'dark' ? 24 : 0,
                    rotate: theme === 'dark' ? 360 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? (
                    <MoonIcon className="h-4 w-4 text-gray-800" />
                ) : (
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
