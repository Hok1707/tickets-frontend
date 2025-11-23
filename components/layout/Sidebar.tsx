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
      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-600 duration-300 ease-in-out hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 ` +
      (isActive && '!bg-primary-500 !text-white')
    }
  >
    {icon}
    {text}
  </NavLink>
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
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-gray-800 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
            <TicketIcon className="h-6 w-6" />
          </div>
          <span className="tracking-tight">TicketFlow</span>
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{t('menu.menu')}</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
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
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{t('menu.management')}</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
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
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{t('menu.admin')}</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
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
    </aside>
  );
};

export default Sidebar;