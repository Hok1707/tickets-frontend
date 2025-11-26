import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
            <PublicNavbar />
            <main className="pt-16">
                {children || <Outlet />}
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
