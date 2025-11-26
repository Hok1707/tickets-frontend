import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, Eye, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SecurityPage = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('securityPage.title')}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t('securityPage.description')}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                >
                    <SecuritySection
                        variants={itemVariants}
                        icon={<Lock className="w-6 h-6 text-primary" />}
                        title={t('securityPage.encryption.title')}
                        description={t('securityPage.encryption.description')}
                    />
                    <SecuritySection
                        variants={itemVariants}
                        icon={<Shield className="w-6 h-6 text-primary" />}
                        title={t('securityPage.compliance.title')}
                        description={t('securityPage.compliance.description')}
                    />
                    <SecuritySection
                        variants={itemVariants}
                        icon={<Server className="w-6 h-6 text-primary" />}
                        title={t('securityPage.infrastructure.title')}
                        description={t('securityPage.infrastructure.description')}
                    />
                    <SecuritySection
                        variants={itemVariants}
                        icon={<Eye className="w-6 h-6 text-primary" />}
                        title={t('securityPage.monitoring.title')}
                        description={t('securityPage.monitoring.description')}
                    />
                </motion.div>

                {/* Trust Badge Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-24 p-8 md:p-12 bg-card border border-border rounded-3xl max-w-5xl mx-auto text-center"
                >
                    <h2 className="text-2xl font-bold mb-8">{t('securityPage.trustedBy.title')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            t('securityPage.trustedBy.uptime'),
                            t('securityPage.trustedBy.support'),
                            t('securityPage.trustedBy.backups'),
                            t('securityPage.trustedBy.fraudProtection')
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-background/50">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                                <span className="font-semibold">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SecuritySection = ({ icon, title, description, variants }: any) => (
    <motion.div
        variants={variants}
        className="flex gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
    >
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    </motion.div>
);

export default SecurityPage;
