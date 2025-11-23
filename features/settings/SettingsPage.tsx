import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import {
    UserCircleIcon, EnvelopeIcon, PhoneIcon,
    ShieldCheckIcon, LockClosedIcon, EyeIcon, EyeSlashIcon,
    PaintBrushIcon, SunIcon, MoonIcon, BriefcaseIcon
} from '@heroicons/react/24/outline';
import { Role } from '../../types/common';
import { useTranslation } from 'react-i18next';

const ProfileSettings: React.FC = () => {
    const { user } = useAuth();
    const { updateUserInfo } = useAuthStore();
    const { t } = useTranslation();

    const [username, setUsername] = useState(user?.username || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user]);

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setUsername(user.username);
            setPhoneNumber(user.phoneNumber || '');
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (username === user.username && phoneNumber === (user.phoneNumber || '')) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            const updatedUser = await userService.updateUserProfile(user.id, { username, phoneNumber });
            updateUserInfo({ username: updatedUser.username, phoneNumber: updatedUser.phoneNumber });
            toast.success(t('settings.profileUpdateSuccess'));
            setIsEditing(false);
        } catch (error) {
            toast.error(t('settings.profileUpdateFail'));
            handleCancel();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.personalInfo')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('settings.personalInfoDesc')}</p>
            </div>
            <form onSubmit={handleProfileSubmit}>
                <dl className="p-6 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 py-3 border-b border-gray-100 dark:border-gray-700">
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2"><UserCircleIcon className="h-5 w-5" />{t('settings.fullName')}</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                            {isEditing ? <input value={username} onChange={e => setUsername(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3" /> : <span className="py-2 inline-block">{username}</span>}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 py-3 border-b border-gray-100 dark:border-gray-700">
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2"><PhoneIcon className="h-5 w-5" />{t('settings.phoneNumber')}</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                            {isEditing ? <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3" /> : <span className="py-2 inline-block">{phoneNumber || '-'}</span>}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 py-3">
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2"><EnvelopeIcon className="h-5 w-5" />{t('settings.emailAddress')}</dt>
                        <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:col-span-2 sm:mt-0 py-2">{user?.email}</dd>
                    </div>
                </dl>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    {isEditing ? (
                        <>
                            <button type="button" onClick={handleCancel} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">{t('settings.cancel')}</button>
                            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold disabled:bg-primary-400 dark:disabled:bg-primary-800 transition-colors">{isLoading ? t('settings.saving') : t('settings.saveChanges')}</button>
                        </>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors">{t('settings.editProfile')}</button>
                    )}
                </div>
            </form>
        </div>
    );
};

const SecuritySettings: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (newPassword !== confirmPassword) {
            setPasswordError(t('settings.passwordMismatch'));
            return;
        }

        if (!user) return;

        setIsPasswordLoading(true);
        try {
            await authService.changePassword({
                userId: user.id,
                currentPassword: currentPassword,
                newPassword: newPassword,
            });

            toast.success(t('settings.passwordUpdateSuccess'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError(error instanceof Error ? error.message : t('settings.passwordUpdateFail'));
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.changePassword')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('settings.changePasswordDesc')}</p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.currentPassword')}</label>
                        <input type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError('') }} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.newPassword')}</label>
                        <div className="relative">
                            <input type={isPasswordVisible ? 'text' : 'password'} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordError('') }} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3" />
                            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400">{isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.confirmNewPassword')}</label>
                        <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3" />
                    </div>
                    {passwordError && <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
                </div>
                <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    <button type="submit" disabled={isPasswordLoading} className="px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold disabled:bg-primary-400 dark:disabled:bg-primary-800 transition-colors">{isPasswordLoading ? t('settings.saving') : t('settings.updatePassword')}</button>
                </div>
            </form>
        </div>
    );
};

const AppearanceSettings: React.FC = () => {
    const { theme, toggleTheme } = useThemeStore();
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.appearance')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('settings.appearanceDesc')}</p>
            </div>
            <div className="p-6">
                <label className="text-base font-medium text-gray-900 dark:text-white">{t('settings.theme')}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.themeDesc')}</p>
                <fieldset className="mt-4">
                    <legend className="sr-only">Theme selection</legend>
                    <div className="flex items-center space-x-4">
                        <label className={`relative w-full p-4 rounded-lg cursor-pointer border-2 ${theme === 'light' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            <input type="radio" name="theme-option" value="light" className="sr-only" checked={theme === 'light'} onChange={toggleTheme} aria-labelledby="theme-light-label" />
                            <div className="flex items-center gap-4">
                                <SunIcon className="h-6 w-6 text-gray-700" />
                                <span id="theme-light-label" className="font-medium text-gray-700">{t('settings.light')}</span>
                            </div>
                        </label>
                        <label className={`relative w-full p-4 rounded-lg cursor-pointer border-2 ${theme === 'dark' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            <input type="radio" name="theme-option" value="dark" className="sr-only" checked={theme === 'dark'} onChange={toggleTheme} aria-labelledby="theme-dark-label" />
                            <div className="flex items-center gap-4">
                                <MoonIcon className="h-6 w-6 text-yellow-400" />
                                <span id="theme-dark-label" className="font-medium text-gray-900 dark:text-white">{t('settings.dark')}</span>
                            </div>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

const AccountSettings: React.FC = () => {
    const { user } = useAuth();
    const { updateUserRole } = useAuthStore();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgradeToOrganizer = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await userService.updateUserRole(user.id, Role.ORGANIZER);
            updateUserRole(user.id, Role.ORGANIZER);
            toast.success(t('settings.upgradeSuccess'));
        } catch (error) {
            toast.error(t('settings.upgradeFail'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.accountType')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('settings.manageRole')}</p>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{t('settings.currentRole')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('settings.youAreCurrently')} <span className="font-semibold text-primary-600 dark:text-primary-400">{user.role}</span>.
                        </p>
                    </div>
                    {user.role === Role.USER && (
                        <button
                            onClick={handleUpgradeToOrganizer}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('settings.upgrading') : t('settings.upgradeToOrganizer')}
                        </button>
                    )}
                    {user.role === Role.ORGANIZER && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                            {t('settings.organizerAccount')}
                        </span>
                    )}
                </div>
                {user.role === Role.USER && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.becomeOrganizerDesc')}
                    </p>
                )}
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { t } = useTranslation();

    const tabs = [
        { id: 'profile', name: t('settings.profile'), icon: UserCircleIcon, component: <ProfileSettings /> },
        { id: 'security', name: t('settings.security'), icon: ShieldCheckIcon, component: <SecuritySettings /> },
        { id: 'appearance', name: t('settings.appearance'), icon: PaintBrushIcon, component: <AppearanceSettings /> },
        { id: 'account', name: t('settings.account'), icon: BriefcaseIcon, component: <AccountSettings /> },
    ];

    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('settings.title')}</h1>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-left transition-colors duration-200 ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1">
                    {activeComponent}
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;