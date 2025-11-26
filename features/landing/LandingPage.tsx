import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Calendar, Ticket, BarChart3, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/themeStore';
import { SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const LandingPage = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useThemeStore();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'km' : 'en';
        i18n.changeLanguage(newLang);
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[1000px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-0 right-0 w-[120vw] md:w-[800px] h-[400px] md:h-[600px] bg-purple-500/20 rounded-full blur-3xl opacity-20" />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                        >
                            {t('landing.heroTitle')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                {t('landing.heroSubtitle')}
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
                        >
                            {t('landing.heroDescription')}
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        >
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                                    {t('landing.startFree')}
                                </Button>
                            </Link>
                            <Link to="/events">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                                    {t('landing.exploreEvents')}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-16 relative mx-auto max-w-5xl"
                    >
                        <div className="rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                            <div className="flex h-[500px] w-full">
                                {/* Sidebar Mock */}
                                <div className="w-64 border-r border-white/10 bg-gray-900/50 p-4 hidden md:block">
                                    <div className="h-8 w-32 bg-primary-500/20 rounded-lg mb-8 animate-pulse" />
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                                                <div className="w-5 h-5 rounded bg-white/10" />
                                                <div className="h-4 w-24 bg-white/10 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Content Mock */}
                                <div className="flex-1 p-6 bg-gray-900/30">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <div className="h-6 w-48 bg-white/10 rounded mb-2" />
                                            <div className="h-4 w-32 bg-white/5 rounded" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10" />
                                            <div className="w-10 h-10 rounded-full bg-primary-500/20" />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {[
                                            { color: 'bg-blue-500', label: 'Total Revenue' },
                                            { color: 'bg-purple-500', label: 'Tickets Sold' },
                                            { color: 'bg-pink-500', label: 'Active Events' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`w-10 h-10 rounded-lg ${stat.color}/20 flex items-center justify-center`}>
                                                        <div className={`w-5 h-5 rounded ${stat.color}`} />
                                                    </div>
                                                    <div className="h-4 w-12 bg-white/10 rounded" />
                                                </div>
                                                <div className="h-8 w-24 bg-white/20 rounded mb-2" />
                                                <div className="h-4 w-16 bg-white/10 rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart Area Mock */}
                                    <div className="grid grid-cols-3 gap-6 h-48">
                                        <div className="col-span-2 rounded-xl bg-white/5 border border-white/5 p-4 relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4 pb-4 gap-2">
                                                {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                                        className="w-full bg-gradient-to-t from-primary-500/50 to-primary-400 rounded-t-sm"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                                            <div className="space-y-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-white/10" />
                                                        <div className="flex-1">
                                                            <div className="h-4 w-full bg-white/10 rounded mb-1" />
                                                            <div className="h-3 w-2/3 bg-white/5 rounded" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('landing.featuresTitle')}</h2>
                        <p className="text-muted-foreground">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Calendar className="w-6 h-6 text-primary" />}
                            title={t('landing.eventScheduling')}
                            description={t('landing.eventSchedulingDesc')}
                        />
                        <FeatureCard
                            icon={<Ticket className="w-6 h-6 text-purple-500" />}
                            title={t('landing.ticketManagement')}
                            description={t('landing.ticketManagementDesc')}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6 text-pink-500" />}
                            title={t('landing.realTimeAnalytics')}
                            description={t('landing.realTimeAnalyticsDesc')}
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
                            title={t('landing.securePayments')}
                            description={t('landing.securePaymentsDesc')}
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-500" />}
                            title={t('landing.instantCheckin')}
                            description={t('landing.instantCheckinDesc')}
                        />
                        <FeatureCard
                            icon={<Globe className="w-6 h-6 text-blue-500" />}
                            title={t('landing.globalReach')}
                            description={t('landing.globalReachDesc')}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">{t('landing.ctaTitle')}</h2>
                            <p className="text-primary-foreground/80 text-lg">
                                {t('landing.ctaSubtitle')}
                            </p>
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="h-12 px-8 rounded-full font-semibold">
                                    {t('landing.createEvent')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
    >
        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

export default LandingPage;
