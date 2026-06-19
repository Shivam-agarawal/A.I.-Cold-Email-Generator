import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { exportAsTxt, exportAsPdf } from '../utils/exportEmail';
import {
    ClipboardDocumentIcon,
    CheckIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

const TONES = [
    { value: 'professional', label: '💼 Professional' },
    { value: 'casual', label: '😊 Casual' },
    { value: 'persuasive', label: '🎯 Persuasive' },
    { value: 'humorous', label: '😄 Humorous' },
    { value: 'urgent', label: '⚡ Urgent' },
];

const FRAMEWORKS = [
    { value: '', label: 'None (Default)' },
    { value: 'aida', label: 'AIDA — Attention, Interest, Desire, Action' },
    { value: 'pas', label: 'PAS — Problem, Agitate, Solve' },
    { value: 'bab', label: 'BAB — Before, After, Bridge' },
];

const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState('professional');
    const [framework, setFramework] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const payload = { prompt, tone };
            if (framework) payload.framework = framework;
            const { data } = await api.post('/ai/generate-email', payload);
            setResult(data);
            toast.success('Successfully generated!');
        } catch (error) {
            toast.error('Failed to generate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(''), 2000);
    };

    const handleExport = (format) => {
        if (!result) return;
        const data = {
            subject: result.subject,
            emailBody: result.emailBody,
            linkedinDM: result.linkedinDM,
            followUpEmail: result.followUpEmail,
            prompt,
        };
        if (format === 'pdf') {
            exportAsPdf(data);
            toast.success('PDF downloaded!');
        } else {
            exportAsTxt(data);
            toast.success('TXT downloaded!');
        }
    };

    const SelectField = ({ label, value, onChange, options }) => (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 pr-9 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow cursor-pointer"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );

    const ResultCard = ({ title, content, type }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-4 transition-colors">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{title}</h3>
                <button
                    onClick={() => copyToClipboard(content, type)}
                    className="text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Copy"
                >
                    {copied === type ? (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
            {/* Input Section */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-colors">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">New Campaign</h2>
                <form onSubmit={handleGenerate} className="flex-1 flex flex-col gap-4">
                    {/* Tone & Framework Selectors */}
                    <div className="grid grid-cols-2 gap-3">
                        <SelectField label="Tone" value={tone} onChange={setTone} options={TONES} />
                        <SelectField label="Framework" value={framework} onChange={setFramework} options={FRAMEWORKS} />
                    </div>

                    {/* Active Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                            {TONES.find(t => t.value === tone)?.label}
                        </span>
                        {framework && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                {framework.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Context / Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1 w-full min-h-[120px] border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow resize-none placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g. Write a cold email to a marketing director at a SaaS company offering our AI-driven analytics tool that increases retention by 20%..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : 'Generate Output'}
                    </button>
                </form>
            </div>

            {/* Output Section */}
            <div className="w-full lg:w-2/3 flex flex-col overflow-y-auto">
                {result ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Results</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleExport('txt')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    title="Export as TXT"
                                >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    TXT
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                                    title="Export as PDF"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    PDF
                                </button>
                            </div>
                        </div>
                        <ResultCard title="Subject Line" content={result.subject} type="subject" />
                        <ResultCard title="Cold Email" content={result.emailBody} type="email" />
                        <ResultCard title="LinkedIn DM" content={result.linkedinDM} type="linkedin" />
                        <ResultCard title="Follow-up Email" content={result.followUpEmail} type="followup" />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <ClipboardDocumentIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-sm">Submit a prompt to generate AI outputs.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;