import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeftOnRectangleIcon, SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 shrink-0 transition-colors">
            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Open sidebar"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                <div className="text-lg font-medium text-gray-800 dark:text-gray-100 hidden md:block">
                    Welcome back, {user?.name || 'User'}
                </div>
                {/* Mobile Title */}
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400 md:hidden">
                    MailGen AI
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? (
                        <SunIcon className="w-5 h-5 text-amber-400" />
                    ) : (
                        <MoonIcon className="w-5 h-5" />
                    )}
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 sm:mr-1" />
                    <span className="text-sm font-medium hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;