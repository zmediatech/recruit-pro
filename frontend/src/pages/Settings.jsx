import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Shield, Bell, Database, Cpu, Mail } from 'lucide-react';
import SmtpSetupForm from '../components/SmtpSetupForm';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();

    const sections = [
        // ... previous sections ...
        {
            title: 'Appearance',
            icon: <Sun size={20} />,
            description: 'Customize how RecruitPro looks on your screen.',
            content: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div>
                        <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Interface Theme</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Switch between Dark and Light modes.</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline"
                        style={{ minWidth: '140px', justifyContent: 'center' }}
                    >
                        {theme === 'dark' ? <><Moon size={16} /> Dark Mode</> : <><Sun size={16} /> Light Mode</>}
                    </button>
                </div>
            )
        },
        {
            title: 'AI Analysis',
            icon: <Cpu size={20} />,
            description: 'Configure how candidate data is analyzed and processed.',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SettingToggle label="Advanced Analysis" description="Enable deep AI insights for resume scanning and skill matching." defaultChecked />
                    <SettingToggle label="Score Adjustment" description="Automatically balance scores based on historical data patterns." defaultChecked />
                </div>
            )
        },
        {
            title: 'Data Management',
            icon: <Database size={20} />,
            description: 'Manage candidate profiles and system data exports.',
            content: (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }}>Export Profiles</button>
                    <button className="btn btn-outline" style={{ flex: 1, color: 'var(--accent-red)' }}>Clear Database Cache</button>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '5rem' }}
        >
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    SETTINGS
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Preferences</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your RecruitPro experience and system configuration.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--accent-green)' }}>{section.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{section.title}</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>{section.description}</p>
                        {section.content}
                    </motion.div>
                ))}

                {/* SMTP Setup Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ color: 'var(--accent-green)' }}><Mail size={20} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Communications</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Configure secure SMTP relay to enable automated system notifications and candidate correspondence.
                    </p>
                    <SmtpSetupForm />
                </motion.div>
            </div>
        </motion.div>
    );
}

function SettingToggle({ label, description, defaultChecked }) {
    const [checked, setChecked] = React.useState(defaultChecked);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{label}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{description}</p>
            </div>
            <div
                onClick={() => setChecked(!checked)}
                style={{
                    width: '44px',
                    height: '22px',
                    background: checked ? 'var(--accent-green)' : 'var(--text-secondary)',
                    borderRadius: '11px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: checked ? 1 : 0.3
                }}
            >
                <div style={{
                    width: '18px',
                    height: '18px',
                    background: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '24px' : '2px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </div>
        </div>
    );
}
