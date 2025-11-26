import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">{t('aboutPage.title')}</h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-2xl text-muted-foreground mb-12 leading-relaxed font-light"
                        >
                            {t('aboutPage.mission')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid gap-12"
                        >
                            <section>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    {t('aboutPage.story.title')}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {t('aboutPage.story.content')}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                                    {t('aboutPage.values.title')}
                                </h2>
                                <ul className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { title: t('aboutPage.values.simplicity.title'), desc: t('aboutPage.values.simplicity.desc') },
                                        { title: t('aboutPage.values.community.title'), desc: t('aboutPage.values.community.desc') },
                                        { title: t('aboutPage.values.innovation.title'), desc: t('aboutPage.values.innovation.desc') },
                                        { title: t('aboutPage.values.trust.title'), desc: t('aboutPage.values.trust.desc') }
                                    ].map((val, i) => (
                                        <li key={i} className="p-6 bg-card rounded-xl border border-border">
                                            <span className="font-bold text-foreground block mb-2 text-lg">{val.title}</span>
                                            <span className="text-muted-foreground">{val.desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                                <h2 className="text-2xl font-bold mb-4">{t('aboutPage.joinUs.title')}</h2>
                                <p className="text-muted-foreground mb-6">
                                    {t('aboutPage.joinUs.content')}
                                </p>
                                <a href="/careers" className="text-primary font-semibold hover:underline">{t('aboutPage.joinUs.cta')}</a>
                            </section>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
