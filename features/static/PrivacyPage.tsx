import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto prose dark:prose-invert"
                >
                    <h1 className="text-4xl font-bold mb-8">{t('privacyPage.title')}</h1>
                    <p className="text-muted-foreground mb-8 text-lg">{t('privacyPage.lastUpdated')}</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('privacyPage.intro.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('privacyPage.intro.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('privacyPage.dataCollect.title')}</h2>
                            <p className="text-muted-foreground mb-4">
                                {t('privacyPage.dataCollect.content')}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li><strong>{t('privacyPage.dataCollect.identity')}</strong></li>
                                <li><strong>{t('privacyPage.dataCollect.contact')}</strong></li>
                                <li><strong>{t('privacyPage.dataCollect.financial')}</strong></li>
                                <li><strong>{t('privacyPage.dataCollect.transaction')}</strong></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('privacyPage.dataUse.title')}</h2>
                            <p className="text-muted-foreground mb-4">
                                {t('privacyPage.dataUse.content')}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>{t('privacyPage.dataUse.contract')}</li>
                                <li>{t('privacyPage.dataUse.legitimate')}</li>
                                <li>{t('privacyPage.dataUse.legal')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('privacyPage.security.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('privacyPage.security.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('privacyPage.contact.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('privacyPage.contact.content')}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPage;
