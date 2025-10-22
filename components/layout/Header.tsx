import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const getInitials = (name?: string | null): string => {
  if (!name) return "...";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout, role } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { cart } = useCartStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="z-50 block rounded-sm border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="hidden sm:block"></div>

          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* Shopping Cart with Badge */}
              <Link to="/cart" className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "light" ? (
                  <MoonIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <SunIcon className="h-6 w-6 text-yellow-400" />
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  ref={trigger}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 rounded-full"
                >
                  <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-gray-800 dark:text-white">
                      {user?.username || "Guest"}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {role}
                    </span>
                  </span>
                  <span className="h-10 w-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                    {user ? getInitials(user.username) : <UserCircleIcon className="h-8 w-8" />}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    ref={dropdown}
                    className="absolute right-0 mt-2.5 flex w-64 flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <ul className="flex flex-col p-2">
                      <li>
                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 duration-200 ease-in-out hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Settings
                        </Link>
                      </li>
                    </ul>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2.5 border-t border-gray-200 dark:border-gray-700 py-2 px-4 text-sm font-medium duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 m-2 rounded-md"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </ul>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmButtonText="Log Out"
        variant="primary"
      />
    </>
  );
};

export default Header;