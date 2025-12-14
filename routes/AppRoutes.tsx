
import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import { Role } from '@/types/common';
import PublicLayout from '../components/layout/PublicLayout';

const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const EventListPage = lazy(() => import('../features/events/EventListPage'));
const EventDetailsPage = lazy(() => import('../features/events/EventDetailsPage'));
const MyTicketsPage = lazy(() => import('../features/tickets/MyTicketsPage'));
const UserManagementPage = lazy(() => import('../features/admin/UserManagementPage'));
const EventManagementPage = lazy(() => import('../features/events/EventManagementPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));
const ScanTicketPage = lazy(() => import('../features/tickets/ScanTicketPage'));
const CartPage = lazy(() => import('../features/cart/CartPage'))
const CheckoutPage = lazy(() => import('../features/orders/CheckoutPage'))
const KHQRPaymentPage = lazy(() => import('../features/payments/KHQRPaymentPage'))
const PaymentSuccessPage = lazy(() => import('../features/payments/PaymentSuccessPage'))
const OrdersPage = lazy(() => import('../features/orders/components/OrderManagementPage'));
const TicketsPage = lazy(() => import('../features/tickets/components/TicketsPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/ResetPassword'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPassword'));
const VerifyEmailPage = lazy(() => import('../features/auth/VerifyEmailPage'));
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const FeaturesPage = lazy(() => import('../features/static/FeaturesPage'));
const PricingPage = lazy(() => import('../features/static/PricingPage'));
const SecurityPage = lazy(() => import('../features/static/SecurityPage'));
const AboutPage = lazy(() => import('../features/static/AboutPage'));
const BlogPage = lazy(() => import('../features/static/BlogPage'));
const CareersPage = lazy(() => import('../features/static/CareersPage'));
const PrivacyPage = lazy(() => import('../features/static/PrivacyPage'));
const TermsPage = lazy(() => import('../features/static/TermsPage'));

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/" element={<LandingPage />} />

            <Route element={<PublicLayout />}>
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/events" element={<EventListPage />} />
                    <Route path="/events/:eventId" element={<EventDetailsPage />} />
                    <Route path="/my-tickets" element={<MyTicketsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment/khqr/:orderId" element={<KHQRPaymentPage />} />
                    <Route path="/payment-success/:orderId" element={<PaymentSuccessPage />} />
                    <Route element={<RoleBasedRoute allowedRoles={[Role.ADMIN, Role.ORGANIZER]} />}>
                        <Route path="/manage-events" element={<EventManagementPage />} />
                    </Route>
                    <Route element={<RoleBasedRoute allowedRoles={[Role.ADMIN, Role.ORGANIZER, Role.STAFF]} />}>
                        <Route path="/scan" element={<ScanTicketPage />} />
                    </Route>

                    <Route element={<RoleBasedRoute allowedRoles={[Role.ADMIN]} />}>
                        <Route path="/admin/users" element={<UserManagementPage />} />
                        <Route path="/admin/orders" element={<OrdersPage />} />
                        <Route path="/admin/tickets" element={<TicketsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;