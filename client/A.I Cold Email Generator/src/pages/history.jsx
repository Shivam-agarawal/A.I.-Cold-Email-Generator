import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { exportAsTxt, exportAsPdf } from '../utils/exportEmail';
import {
    ClipboardDocumentIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    InboxIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/ai/history');
            setHistory(data.emailHistory || []);
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(''), 2000);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleExport = (item, format) => {
        const data = {
            subject: item.subject,
            emailBody: item.emailBody,
            linkedinDM: item.linkedinDM,
            followUpEmail: item.followUpEmail,
            prompt: item.prompt,
        };
        if (format === 'pdf') {
            exportAsPdf(data);
            toast.success('PDF downloaded!');
        } else {
            exportAsTxt(data);
            toast.success('TXT downloaded!');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const filteredHistory = history
        .filter((item) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                item.prompt?.toLowerCase().includes(q) ||
                item.subject?.toLowerCase().includes(q) ||
                item.emailBody?.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const CopyButton = ({ text, id }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(text, id);
            }}
            className="shrink-0 p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
            title="Copy"
        >
            {copied === id ? (
                <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
            )}
        </button>
    );

    const SectionBlock = ({ label, content, copyId }) => (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {label}
                </span>
                <CopyButton text={content} id={copyId} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
    );

    // Loading skeleton
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
                                </div>
                                <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email History</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {filteredHistory.length} {filteredHistory.length === 1 ? 'generation' : 'generations'}
                    {search && ' found'}
                </p>
            </div>

            {/* Search */}
            {history.length > 0 && (
                <div className="relative mb-6">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by prompt, subject, or email body..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
            )}

            {/* Empty State */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <InboxIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No emails generated yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                        Head over to the Dashboard and generate your first cold email. It will appear here automatically.
                    </p>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MagnifyingGlassIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">No results found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Try a different search term.</p>
                </div>
            ) : (
                /* History List */
                <div className="space-y-4">
                    {filteredHistory.map((item) => {
                        const isExpanded = expandedId === item._id;
                        return (
                            <div
                                key={item._id}
                                className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
                                    isExpanded
                                        ? 'border-primary-200 dark:border-primary-700 shadow-md shadow-primary-500/5'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                }`}
                            >
                                {/* Card Header */}
                                <button
                                    onClick={() => toggleExpand(item._id)}
                                    className="w-full flex items-start justify-between p-5 text-left cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-[15px]">
                                            {item.subject || 'Untitled'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                            {item.prompt}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                                            <ClockIcon className="w-3.5 h-3.5 mr-1" />
                                            {formatDate(item.createdAt)}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                        {/* Export buttons */}
                                        <div className="flex items-center justify-end gap-2 mb-1">
                                            <button
                                                onClick={() => handleExport(item, 'txt')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <DocumentTextIcon className="w-3.5 h-3.5" />
                                                TXT
                                            </button>
                                            <button
                                                onClick={() => handleExport(item, 'pdf')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                                            >
                                                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                                PDF
                                            </button>
                                        </div>

                                        {/* Prompt */}
                                        <div className="bg-primary-50/50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 block mb-2">
                                                Original Prompt
                                            </span>
                                            <p className="text-sm text-gray-700 dark:text-gray-200">{item.prompt}</p>
                                        </div>

                                        {item.subject && (
                                            <SectionBlock label="Subject Line" content={item.subject} copyId={`subject-${item._id}`} />
                                        )}
                                        {item.emailBody && (
                                            <SectionBlock label="Cold Email" content={item.emailBody} copyId={`email-${item._id}`} />
                                        )}
                                        {item.linkedinDM && (
                                            <SectionBlock label="LinkedIn DM" content={item.linkedinDM} copyId={`linkedin-${item._id}`} />
                                        )}
                                        {item.followUpEmail && (
                                            <SectionBlock label="Follow-up Email" content={item.followUpEmail} copyId={`followup-${item._id}`} />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
