import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
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
                    <h1 className="text-4xl font-bold mb-8">{t('termsPage.title')}</h1>
                    <p className="text-muted-foreground mb-8 text-lg">{t('termsPage.lastUpdated')}</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.agreement.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.agreement.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.use.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.use.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.accounts.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.accounts.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.ip.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.ip.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.termination.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.termination.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.liability.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.liability.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.changes.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.changes.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">{t('termsPage.contact.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('termsPage.contact.content')}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
