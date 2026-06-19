import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChartBarIcon, ClockIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const Sidebar = ({ open, onClose }) => {
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose();
    }, [location.pathname]);

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: HomeIcon, end: true },
        { to: '/dashboard/history', label: 'History', icon: ClockIcon },
        { to: '/dashboard/analytics', label: 'Analytics', icon: ChartBarIcon },
    ];

    const navContent = (
        <>
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">MailGen AI</h1>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar — always visible on md+ */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors">
                {navContent}
            </div>

            {/* Mobile Sidebar — slide-over drawer */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity md:hidden ${
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {navContent}
            </div>
        </>
    );
};

export default Sidebar;