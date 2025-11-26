import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'km' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="relative flex h-8 w-16 items-center rounded-full bg-gray-200 p-1 transition-colors duration-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Toggle Language"
        >
            <span className="absolute left-2 text-xs font-bold text-gray-500 dark:text-gray-400">EN</span>
            <span className="absolute right-2 text-xs font-bold text-gray-500 dark:text-gray-400">KH</span>

            <motion.div
                className="absolute left-1 top-1 flex h-6 w-7 items-center justify-center rounded-full bg-white shadow-md text-xs font-bold text-primary-600 dark:text-primary-500"
                animate={{
                    x: currentLang === 'km' ? 32 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {currentLang === 'en' ? 'EN' : 'KH'}
            </motion.div>
        </button>
    );
};

export default LanguageToggle;
