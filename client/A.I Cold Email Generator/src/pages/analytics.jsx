import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
    EnvelopeIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarDaysIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/ai/stats');
            setStats(data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const weekDelta = stats ? stats.thisWeek - stats.lastWeek : 0;
    const weekPercent = stats && stats.lastWeek > 0
        ? Math.round(((stats.thisWeek - stats.lastWeek) / stats.lastWeek) * 100)
        : stats?.thisWeek > 0 ? 100 : 0;

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                            <div className="h-8 w-16 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-72 animate-pulse"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Your email generation activity at a glance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Total Emails */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Generated</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmails}</p>
                </div>

                {/* This Week */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${weekDelta >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            {weekDelta >= 0 ? (
                                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <ArrowTrendingDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.thisWeek}</p>
                        {weekPercent !== 0 && (
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full mb-1 ${weekDelta >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                {weekDelta >= 0 ? '+' : ''}{weekPercent}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Avg Per Day */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <CalendarDaysIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg / Day (30d)</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgPerDay}</p>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                    <ChartBarIcon className="w-5 h-5 text-gray-400" />
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Generation Activity (Last 30 Days)</h2>
                </div>
                {stats.emailsPerDay.some(d => d.count > 0) ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={stats.emailsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                            <XAxis
                                dataKey="label"
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval={Math.floor(stats.emailsPerDay.length / 7)}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#f3f4f6',
                                    fontSize: '13px',
                                }}
                                labelStyle={{ color: '#9ca3af' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                name="Emails"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
                        No data yet. Generate some emails to see your activity chart!
                    </div>
                )}
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tone Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Tone Distribution</h2>
                    {stats.toneDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={stats.toneDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {stats.toneDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6', fontSize: '13px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-60 text-gray-400 dark:text-gray-500 text-sm">No data</div>
                    )}
                </div>

                {/* Framework Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Framework Usage</h2>
                    {stats.frameworkDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={stats.frameworkDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {stats.frameworkDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6', fontSize: '13px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-60 text-gray-400 dark:text-gray-500 text-sm">
                            No frameworks used yet. Try selecting AIDA, PAS, or BAB when generating!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
