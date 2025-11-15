
import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import { Role } from '@/types/common';

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
const CartPage = lazy(()=>import('../features/cart/CartPage'))
const CheckoutPage = lazy(()=> import('../features/orders/CheckoutPage'))
const KHQRPaymentPage = lazy(()=>import('../features/payments/KHQRPaymentPage'))
const PaymentSuccessPage = lazy(()=>import('../features/payments/PaymentSuccessPage'))
// const OrdersPage = lazy(()=>import('../features/orders/components/OrdersPage'));
const TicketsPage = lazy(()=>import('../features/tickets/components/TicketsPage'));

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<DashboardPage />} />
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
                        {/* <Route path="/admin/orders" element={<OrdersPage />} /> */}
                        <Route path="/admin/tickets" element={<TicketsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;