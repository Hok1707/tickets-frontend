import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { motion, Variants } from 'framer-motion';
import {
    UserCircleIcon, EnvelopeIcon, PhoneIcon,
    ShieldCheckIcon, KeyIcon, CameraIcon,
    SunIcon, MoonIcon, BriefcaseIcon, PaintBrushIcon
} from '@heroicons/react/24/outline';
import { Role } from '../../types/common';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { updateUserInfo, updateUserRole } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'account' | 'appearance'>('personal');

    // Profile State
    const [username, setUsername] = useState(user?.username || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Role State
    const [isRoleLoading, setIsRoleLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsProfileLoading(true);
        try {
            const updatedUser = await userService.updateUserProfile(user.id, { username, phoneNumber });
            updateUserInfo({ username: updatedUser.username, phoneNumber: updatedUser.phoneNumber });
            toast.success(t('settings.profileUpdateSuccess'));
        } catch (error) {
            toast.error(t('settings.profileUpdateFail'));
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('settings.passwordMismatch'));
            return;
        }
        if (!user) return;

        setIsPasswordLoading(true);
        try {
            await authService.changePassword({
                userId: user.id,
                currentPassword,
                newPassword,
            });
            toast.success(t('settings.passwordUpdateSuccess'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('settings.passwordUpdateFail'));
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleUpgradeToOrganizer = async () => {
        if (!user) return;
        setIsRoleLoading(true);
        try {
            await userService.updateUserRole(user.id, Role.ORGANIZER);
            updateUserRole(user.id, Role.ORGANIZER);
            toast.success(t('settings.upgradeSuccess'));
        } catch (error) {
            toast.error(t('settings.upgradeFail'));
        } finally {
            setIsRoleLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    const tabVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            className="mx-auto max-w-5xl p-4 md:p-6 2xl:p-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Profile Header */}
            <div className="relative mb-6 h-48 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 right-4 z-10">
                    <button className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white hover:bg-white/30 backdrop-blur-md transition-all">
                        <CameraIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Edit Cover</span>
                    </button>
                </div>
            </div>

            <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5 relative">
                <div className="relative mx-auto -mt-24 h-32 w-32 rounded-full bg-background p-1.5 shadow-xl sm:h-40 sm:w-40 sm:p-2">
                    <div className="relative h-full w-full rounded-full overflow-hidden">
                        {user?.username ? (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-4xl font-bold text-primary-foreground sm:text-6xl">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <UserCircleIcon className="h-full w-full text-muted-foreground bg-muted" />
                        )}
                        <label
                            htmlFor="profile"
                            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors"
                        >
                            <CameraIcon className="h-4 w-4" />
                            <input
                                type="file"
                                name="profile"
                                id="profile"
                                className="sr-only"
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <h3 className="mb-1 text-2xl font-bold text-foreground">
                        {user?.username}
                    </h3>
                    <p className="font-medium text-muted-foreground">{user?.role}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-6 border-b border-border">
                {[
                    { id: 'personal', label: t('settings.personalInfo') },
                    { id: 'security', label: t('settings.security') },
                    { id: 'account', label: t('settings.account') },
                    { id: 'appearance', label: t('settings.appearance') }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`border-b-2 pb-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                {activeTab === 'personal' && (
                    <motion.div
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-6 sm:p-8"
                    >
                        <form onSubmit={handleProfileSubmit}>
                            <div className="mb-6 flex flex-col gap-6 sm:flex-row">
                                <div className="w-full sm:w-1/2">
                                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="fullName">
                                        {t('settings.fullName')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3">
                                            <UserCircleIcon className="h-5 w-5 text-muted-foreground" />
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="phoneNumber">
                                        {t('settings.phoneNumber')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3">
                                            <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+123 456 7890"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="emailAddress">
                                    {t('settings.emailAddress')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3">
                                        <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-input bg-muted py-2.5 pl-10 pr-4 text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none cursor-not-allowed"
                                        type="email"
                                        defaultValue={user?.email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
                                    type="submit"
                                    disabled={isProfileLoading}
                                >
                                    {isProfileLoading ? t('settings.saving') : t('settings.saveChanges')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-6 sm:p-8"
                    >
                        <h4 className="mb-6 text-lg font-semibold text-foreground">{t('settings.changePassword')}</h4>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('settings.currentPassword')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3">
                                        <KeyIcon className="h-5 w-5 text-muted-foreground" />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('settings.newPassword')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3">
                                        <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('settings.confirmNewPassword')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3">
                                        <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus-visible:outline-none"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
                                    type="submit"
                                    disabled={isPasswordLoading}
                                >
                                    {isPasswordLoading ? t('settings.saving') : t('settings.updatePassword')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {activeTab === 'account' && (
                    <motion.div
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-6 sm:p-8"
                    >
                        <h4 className="mb-6 text-lg font-semibold text-foreground">{t('settings.accountType')}</h4>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                            <div>
                                <h4 className="text-lg font-medium text-foreground">{t('settings.currentRole')}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('settings.youAreCurrently')} <span className="font-semibold text-primary">{user?.role}</span>.
                                </p>
                            </div>
                            {user?.role === Role.USER && (
                                <button
                                    onClick={handleUpgradeToOrganizer}
                                    disabled={isRoleLoading}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {isRoleLoading ? t('settings.upgrading') : t('settings.upgradeToOrganizer')}
                                </button>
                            )}
                            {user?.role === Role.ORGANIZER && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                                    {t('settings.organizerAccount')}
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'appearance' && (
                    <motion.div
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-6 sm:p-8"
                    >
                        <h4 className="mb-6 text-lg font-semibold text-foreground">{t('settings.appearance')}</h4>
                        <div className="flex items-center space-x-4">
                            <label className={`relative w-full p-4 rounded-lg cursor-pointer border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                <input type="radio" name="theme-option" value="light" className="sr-only" checked={theme === 'light'} onChange={toggleTheme} />
                                <div className="flex items-center gap-4">
                                    <SunIcon className="h-6 w-6 text-orange-500" />
                                    <span className="font-medium text-foreground">{t('settings.light')}</span>
                                </div>
                            </label>
                            <label className={`relative w-full p-4 rounded-lg cursor-pointer border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                <input type="radio" name="theme-option" value="dark" className="sr-only" checked={theme === 'dark'} onChange={toggleTheme} />
                                <div className="flex items-center gap-4">
                                    <MoonIcon className="h-6 w-6 text-primary" />
                                    <span className="font-medium text-foreground">{t('settings.dark')}</span>
                                </div>
                            </label>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default SettingsPage;