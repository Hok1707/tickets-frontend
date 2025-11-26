import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PublicFooter = () => {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <Ticket className="w-3 h-3 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg">TicketFlow</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('landing.footerDesc')}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('landing.product')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/features" className="hover:text-primary">{t('landing.features')}</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary">{t('landing.pricing')}</Link></li>
                            <li><Link to="/security" className="hover:text-primary">{t('landing.security')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('landing.company')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-primary">{t('landing.about')}</Link></li>
                            <li><Link to="/blog" className="hover:text-primary">{t('landing.blog')}</Link></li>
                            <li><Link to="/careers" className="hover:text-primary">{t('landing.careers')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">{t('landing.legal')}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/privacy" className="hover:text-primary">{t('landing.privacy')}</Link></li>
                            <li><Link to="/terms" className="hover:text-primary">{t('landing.terms')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
                    © {new Date().getFullYear()} TicketFlow. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
