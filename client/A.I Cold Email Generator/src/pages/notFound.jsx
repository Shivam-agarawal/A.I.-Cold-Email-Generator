import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
            <div className="max-w-md w-full text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[10rem] font-black leading-none text-gray-100 dark:text-gray-800 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
                            <span className="text-4xl">🔍</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Page not found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 hover:scale-105"
                    >
                        <HomeIcon className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
