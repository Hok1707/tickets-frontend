import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  BellIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageToggle from "@/components/common/LanguageToggle";
import { motion, AnimatePresence } from "framer-motion";

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
  const { theme } = useThemeStore();
  const { cart } = useCartStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <header className="sticky top-0 z-40 flex w-full bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
        <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="z-50 block rounded-lg border border-border bg-background p-2 shadow-sm lg:hidden hover:bg-muted transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-foreground" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block max-w-md w-full">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search events, tickets..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-secondary/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
              </button>

              {/* Shopping Cart */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <ShoppingCartIcon className="h-6 w-6" />
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-gradient-to-r from-destructive to-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </Link>

              <div className="h-8 w-px bg-border mx-1"></div>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Dropdown */}
              <div className="relative ml-2">
                <button
                  ref={trigger}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <span className="hidden text-right lg:block">
                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user?.username || t('header.guest')}
                    </span>
                    <span className="block text-xs font-medium text-muted-foreground">
                      {role}
                    </span>
                  </span>
                  <div className="relative">
                    <span className="h-11 w-11 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/10 group-hover:ring-4 group-hover:ring-primary/10 transition-all duration-300">
                      {user ? getInitials(user.username) : <UserCircleIcon className="h-8 w-8" />}
                    </span>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      ref={dropdown}
                      className="absolute right-0 mt-4 flex w-72 flex-col rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden z-50"
                    >
                      <div className="px-6 py-5 border-b border-border bg-muted/30">
                        <p className="font-bold text-base text-foreground truncate">
                          {user?.username}
                        </p>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {user?.email}
                        </p>
                      </div>
                      <ul className="flex flex-col p-2">
                        <li>
                          <Link
                            to="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium duration-200 ease-in-out hover:bg-secondary text-foreground"
                          >
                            <Cog6ToothIcon className="h-5 w-5 text-muted-foreground" />
                            {t('menu.settings')}
                          </Link>
                        </li>
                      </ul>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={handleLogoutClick}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium duration-200 ease-in-out hover:bg-destructive/10 text-destructive"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          {t('header.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ul>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title={t('header.logout')}
        message="Are you sure you want to log out of your account?"
        confirmButtonText={t('header.logout')}
        variant="primary"
      />
    </>
  );
};

export default Header;