import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';
import { ChartBarIcon, TicketIcon, CalendarDaysIcon, UsersIcon, HomeIcon, XMarkIcon, Cog6ToothIcon, QrCodeIcon } from '@heroicons/react/24/solid';

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
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-gray-800 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="text-2xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-2">
            <TicketIcon className="h-8 w-8" />
            <span>Tickets60</span>
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
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">MENU</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <SidebarLink to="/" icon={<HomeIcon className="h-5 w-5" />} text="Dashboard" />
              </li>
              <li>
                <SidebarLink to="/events" icon={<CalendarDaysIcon className="h-5 w-5" />} text="Events" />
              </li>
              <li>
                <SidebarLink to="/my-tickets" icon={<TicketIcon className="h-5 w-5" />} text="My Tickets" />
              </li>
              <li>
                <SidebarLink to="/settings" icon={<Cog6ToothIcon className="h-5 w-5" />} text="Settings" />
              </li>
            </ul>
          </div>
          
          {(role === Role.ADMIN || role === Role.ORGANIZER || role === Role.STAFF) && (
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">MANAGEMENT</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                {(role === Role.ADMIN || role === Role.ORGANIZER) && (
                  <li>
                      <SidebarLink to="/manage-events" icon={<ChartBarIcon className="h-5 w-5" />} text="Manage Events" />
                  </li>
                )}
                <li>
                  <SidebarLink to="/scan" icon={<QrCodeIcon className="h-5 w-5" />} text="Scan Tickets" />
                </li>
              </ul>
            </div>
          )}

          {role === Role.ADMIN && (
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400">ADMIN</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                    <SidebarLink to="/admin/users" icon={<UsersIcon className="h-5 w-5" />} text="User Management" />
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