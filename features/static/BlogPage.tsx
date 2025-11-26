import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
    const { t } = useTranslation();

    const posts = [
        {
            id: 1,
            title: "10 Tips for a Successful Event",
            excerpt: "Learn how to plan, promote, and execute an event that your attendees will love. From venue selection to post-event engagement.",
            date: "Nov 24, 2024",
            author: "Sarah Johnson",
            category: "Event Planning",
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "The Future of Ticketing is Digital",
            excerpt: "Why paper tickets are becoming obsolete and how digital ticketing improves security, reduces fraud, and enhances the user experience.",
            date: "Nov 20, 2024",
            author: "Mike Chen",
            category: "Technology",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "Maximizing Revenue with Early Bird Pricing",
            excerpt: "Strategies to boost your ticket sales early on and create momentum. How to structure your pricing tiers for maximum conversion.",
            date: "Nov 15, 2024",
            author: "Alex Turner",
            category: "Marketing",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
        }
    ];

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
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
                    className="max-w-5xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('blogPage.title')}</h1>
                    <p className="text-xl text-muted-foreground">{t('blogPage.subtitle')}</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {posts.map((post) => (
                        <motion.article
                            key={post.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 bg-background/90 backdrop-blur text-xs font-bold rounded-full text-foreground">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3" />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default BlogPage;
