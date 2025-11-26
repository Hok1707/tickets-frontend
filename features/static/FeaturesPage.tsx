import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, BarChart3, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesPage = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            {t('landing.featuresTitle', 'Powerful Features')}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {t('landing.featuresSubtitle', 'Everything you need to manage your events successfully. Built for organizers, loved by attendees.')}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            variants={itemVariants}
                            icon={<Calendar className="w-8 h-8 text-primary" />}
                            title={t('landing.eventScheduling', 'Event Scheduling')}
                            description={t('landing.eventSchedulingDesc', 'Easily schedule and manage your events with our intuitive calendar interface. Drag, drop, and done.')}
                            delay={0}
                        />
                        <FeatureCard
                            variants={itemVariants}
                            icon={<Ticket className="w-8 h-8 text-purple-500" />}
                            title={t('landing.ticketManagement', 'Ticket Management')}
                            description={t('landing.ticketManagementDesc', 'Create multiple ticket types, set prices, and manage inventory in real-time with advanced controls.')}
                            delay={0.1}
                        />
                        <FeatureCard
                            variants={itemVariants}
                            icon={<BarChart3 className="w-8 h-8 text-pink-500" />}
                            title={t('landing.realTimeAnalytics', 'Real-time Analytics')}
                            description={t('landing.realTimeAnalyticsDesc', 'Track sales, revenue, and attendee data with comprehensive dashboards that help you make better decisions.')}
                            delay={0.2}
                        />
                        <FeatureCard
                            variants={itemVariants}
                            icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
                            title={t('landing.securePayments', 'Secure Payments')}
                            description={t('landing.securePaymentsDesc', 'Process payments securely with integrated payment gateways and fraud protection you can trust.')}
                            delay={0.3}
                        />
                        <FeatureCard
                            variants={itemVariants}
                            icon={<Zap className="w-8 h-8 text-yellow-500" />}
                            title={t('landing.instantCheckin', 'Instant Check-in')}
                            description={t('landing.instantCheckinDesc', 'Speed up entry with our mobile QR code scanning app. Keep lines moving and attendees happy.')}
                            delay={0.4}
                        />
                        <FeatureCard
                            variants={itemVariants}
                            icon={<Globe className="w-8 h-8 text-blue-500" />}
                            title={t('landing.globalReach', 'Global Reach')}
                            description={t('landing.globalReachDesc', 'Reach audiences worldwide with multi-language support and international currency handling.')}
                            delay={0.5}
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, variants }: any) => (
    <motion.div
        variants={variants}
        whileHover={{ y: -10, transition: { duration: 0.2 } }}
        className="group p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
        <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
);

export default FeaturesPage;
