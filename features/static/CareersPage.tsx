import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CareersPage = () => {
    const { t } = useTranslation();

    const positions = [
        {
            id: 1,
            title: "Senior Frontend Engineer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            tags: ["React", "TypeScript", "Tailwind"]
        },
        {
            id: 2,
            title: "Product Designer",
            department: "Design",
            location: "New York, NY",
            type: "Full-time",
            tags: ["Figma", "UI/UX", "Design Systems"]
        },
        {
            id: 3,
            title: "Customer Success Manager",
            department: "Sales",
            location: "London, UK",
            type: "Full-time",
            tags: ["Communication", "SaaS", "Support"]
        },
        {
            id: 4,
            title: "Backend Developer (Go)",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            tags: ["Go", "PostgreSQL", "Microservices"]
        }
    ];

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
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
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
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('careersPage.title')}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t('careersPage.subtitle')}
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">{t('careersPage.openPositions')}</h2>
                        <span className="text-muted-foreground">{positions.length} {t('careersPage.rolesAvailable')}</span>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {positions.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--primary), 0.02)" }}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <div className="mb-4 md:mb-0 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                                            {job.department}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" /> {job.type}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        {job.tags.map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Button className="group-hover:translate-x-1 transition-transform" variant="ghost">
                                        {t('careersPage.applyNow')} <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center"
                    >
                        <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t('careersPage.noRole.title')}</h3>
                        <p className="text-muted-foreground mb-6">
                            {t('careersPage.noRole.description')}
                        </p>
                        <Button variant="outline">{t('careersPage.noRole.cta')}</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
