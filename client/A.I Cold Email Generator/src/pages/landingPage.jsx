import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRightIcon, BoltIcon, ChartBarIcon, DocumentTextIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    const { user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();

    const features = [
        {
            name: 'Lightning Fast Generation',
            description: 'Generate highly custom cold emails in seconds using state-of-the-art AI.',
            icon: BoltIcon,
        },
        {
            name: 'Omnichannel Outreach',
            description: 'Get an email, a follow-up, and a LinkedIn DM perfectly synced for your prospect.',
            icon: DocumentTextIcon,
        },
        {
            name: ' Higher Conversion Rates',
            description: 'Personalized copy ensures higher open rates and better reply outcomes.',
            icon: ChartBarIcon,
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans selection:bg-primary-100 dark:selection:bg-primary-900 selection:text-primary-900 dark:selection:text-primary-100 transition-colors">
            {/* Navigation */}
            <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed w-full z-50 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                MailGen AI
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {darkMode ? (
                                    <SunIcon className="w-5 h-5 text-amber-400" />
                                ) : (
                                    <MoonIcon className="w-5 h-5" />
                                )}
                            </button>

                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-2 text-sm transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
                        Write Cold Emails That <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Actually Get Replies</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Stop wasting hours drafting outreach. Enter your prospect's context, and let our AI generate the perfect structured sequence. Email, Follow-up, and LinkedIn DM all at once.
                    </p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <Link
                            to={user ? "/dashboard" : "/signup"}
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105 transition-all duration-200"
                        >
                            Start Generating for Free
                            <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="py-24 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need to close more deals</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 border-b-2 border-transparent inline-block pb-1">Built for sales teams who demand performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Look CTA */}
            <div className="relative isolate overflow-hidden bg-gray-900 dark:bg-gray-950">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to scale your outreach?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                            Join hundreds of sales professionals using MailGen to accelerate their pipeline today.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/signup"
                                className="rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>
                <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
                    <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
                    <defs>
                        <radialGradient id="gradient">
                            <stop stopColor="#4f46e5" />
                            <stop offset="1" stopColor="#818cf8" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <span className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">
                        MailGen AI
                    </span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">© {new Date().getFullYear()} MailGen AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;