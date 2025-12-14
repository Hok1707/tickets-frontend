import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ChartBarIcon, TicketIcon, CalendarDaysIcon, UsersIcon, HomeIcon, XMarkIcon, Cog6ToothIcon, QrCodeIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { Role } from '@/types/common';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 rounded-lg py-3 px-4 font-medium duration-200 ease-in-out transition-all ` +
      (isActive
        ? 'bg-primary/20 text-primary shadow-sm dark:text-primary-foreground dark:bg-primary/30 border border-primary/20 backdrop-blur-sm'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground dark:hover:bg-white/5')
    }
  >
    {({ isActive }) => (
      <>
        <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-y-0'}`} />
        <span className={`relative z-10 duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </span>
        <span className="relative z-10">{text}</span>
      </>
    )}
  </NavLink >
);


const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { role } = useAuthStore();
  const { pathname } = location;
  const { t } = useTranslation();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-background/80 backdrop-blur-xl duration-300 ease-linear border-r border-border lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between gap-2 px-6 py-6 lg:py-8">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
            <div className="relative w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground">
              TicketFlow
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Management
            </span>
          </div>
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear px-4 py-4 scrollbar-hide">
        <nav className="space-y-8">
          <div>
            <h3 className="mb-4 ml-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('menu.menu')}
            </h3>
            <ul className="flex flex-col gap-1.5">
              <li>
                <SidebarLink to="/dashboard" icon={<HomeIcon className="h-5 w-5" />} text={t('menu.dashboard')} />
              </li>
              <li>
                <SidebarLink to="/events" icon={<CalendarDaysIcon className="h-5 w-5" />} text={t('menu.events')} />
              </li>
              <li>
                <SidebarLink to="/my-tickets" icon={<TicketIcon className="h-5 w-5" />} text={t('menu.myTickets')} />
              </li>
              <li>
                <SidebarLink to="/settings" icon={<Cog6ToothIcon className="h-5 w-5" />} text={t('menu.settings')} />
              </li>
            </ul>
          </div>

          {(role === Role.ADMIN || role === Role.ORGANIZER || role === Role.STAFF) && (
            <div>
              <h3 className="mb-4 ml-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('menu.management')}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {(role === Role.ADMIN || role === Role.ORGANIZER) && (
                  <li>
                    <SidebarLink to="/manage-events" icon={<ChartBarIcon className="h-5 w-5" />} text={t('menu.manageEvents')} />
                  </li>
                )}
                <li>
                  <SidebarLink to="/scan" icon={<QrCodeIcon className="h-5 w-5" />} text={t('menu.scanTickets')} />
                </li>
              </ul>
            </div>
          )}

          {role === Role.ADMIN && (
            <div>
              <h3 className="mb-4 ml-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('menu.admin')}
              </h3>
              <ul className="flex flex-col gap-1.5">
                <li>
                  <SidebarLink to="/admin/users" icon={<UsersIcon className="h-5 w-5" />} text={t('menu.userManagement')} />
                </li>
                <li>
                  <SidebarLink to="/admin/orders" icon={<ShoppingCartIcon className="h-5 w-5" />} text={t('menu.ordersManagement')} />
                </li>
                <li>
                  <SidebarLink to="/admin/tickets" icon={<TicketIcon className="h-5 w-5" />} text={t('menu.ticketsManagement')} />
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* User Profile Summary / Bottom Area (Optional) */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="bg-muted/30 border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">System Operational</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;