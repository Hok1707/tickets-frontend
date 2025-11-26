import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PricingPage = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('pricingPage.title')}</h1>
                    <p className="text-xl text-muted-foreground">
                        {t('pricingPage.subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start"
                >
                    {/* Basic Plan */}
                    <PricingCard
                        variants={cardVariants}
                        title={t('pricingPage.starter.title')}
                        price="$0"
                        description={t('pricingPage.starter.description')}
                        features={t('pricingPage.starter.features', { returnObjects: true })}
                        cta={t('pricingPage.starter.cta')}
                        ctaLink="/register"
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        variants={cardVariants}
                        title={t('pricingPage.professional.title')}
                        price="$29"
                        period={t('pricingPage.professional.period')}
                        description={t('pricingPage.professional.description')}
                        features={t('pricingPage.professional.features', { returnObjects: true })}
                        highlighted={true}
                        cta={t('pricingPage.professional.cta')}
                        ctaLink="/register"
                        mostPopularText={t('pricingPage.mostPopular')}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard
                        variants={cardVariants}
                        title={t('pricingPage.enterprise.title')}
                        price={t('pricingPage.enterprise.price')}
                        description={t('pricingPage.enterprise.description')}
                        features={t('pricingPage.enterprise.features', { returnObjects: true })}
                        cta={t('pricingPage.enterprise.cta')}
                        ctaLink="/register"
                    />
                </motion.div>
            </div>
        </div>
    );
};

const PricingCard = ({ title, price, period, description, features, highlighted = false, cta, ctaLink, variants, mostPopularText }: any) => (
    <motion.div
        variants={variants}
        whileHover={{ y: -10 }}
        className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${highlighted
            ? 'border-primary bg-background shadow-2xl shadow-primary/10 scale-105 z-10'
            : 'border-border bg-card/50 hover:border-primary/30'
            }`}
    >
        {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                {mostPopularText}
            </div>
        )}

        <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="mb-8">
            <div className="flex items-baseline">
                <span className="text-5xl font-bold">{price}</span>
                {period && <span className="text-muted-foreground ml-2">{period}</span>}
            </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {Array.isArray(features) && features.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${highlighted ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm">{feature}</span>
                </li>
            ))}
        </ul>

        <Link to={ctaLink} className="w-full">
            <Button
                className="w-full h-12 text-base rounded-xl"
                variant={highlighted ? "default" : "outline"}
            >
                {cta}
            </Button>
        </Link>
    </motion.div>
);

export default PricingPage;
