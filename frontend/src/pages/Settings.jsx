import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings as SettingsIcon, 
    Mail, 
    FileText, 
    Cpu, 
    Palette, 
    ChevronRight, 
    Globe,
    Zap
} from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import SmtpSetupForm from '../components/SmtpSetupForm';
import EmailTemplateManager from '../components/EmailTemplateManager';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', title: 'General Settings', icon: Globe, color: 'var(--accent-blue)' },
        { id: 'smtp', title: 'SMTP Settings', icon: Mail, color: 'var(--accent-green)' },
        { id: 'templates', title: 'Email Templates', icon: FileText, color: 'var(--accent-purple)' },
        { id: 'preferences', title: 'System Preferences', icon: Zap, color: 'var(--accent-orange)' },
        { id: 'theme', title: 'Theme Settings', icon: Palette, color: 'var(--accent-blue)' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
            case 'theme': // Both handled in GeneralSettings/Theme section per requirement
                return <GeneralSettings activeSection={activeTab} />;
            case 'smtp':
                return (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>COMMUNICATIONS</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>SMTP Configuration</h2>
                        </header>
                        <div className="glass-panel" style={{ padding: '0' }}>
                            <SmtpSetupForm />
                        </div>
                    </div>
                );
            case 'templates':
                return (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>COMMUNICATIONS</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Email Templates</h2>
                        </header>
                        <EmailTemplateManager />
                    </div>
                );
            case 'preferences':
                return (
                    <div className="animate-fade">
                        <header style={{ marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>OPERATIONS</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>System Preferences</h2>
                        </header>
                        <div className="glass-panel">
                            <p style={{ opacity: 0.7 }}>Additional system preferences and feature flags will appear here.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    SYSTEM CONFIGURATION
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Settings</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Left Sidebar Navigation */}
                <aside className="glass-panel" style={{ padding: '1rem', position: 'sticky', top: '2.5rem' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id || (tab.id === 'general' && activeTab === 'theme');
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        background: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--bg-subtle)',
                                        color: activeTab === tab.id ? 'white' : 'var(--text-secondary)'
                                    }}>
                                        <Icon size={18} />
                                    </div>
                                    <span style={{ flex: 1 }}>{tab.title}</span>
                                    {activeTab === tab.id && <ChevronRight size={16} />}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Right Content Area */}
                <main style={{ minHeight: '600px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
