import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Mail, FileText, ChevronRight } from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'General Settings',
            icon: <SettingsIcon size={24} />,
            description: 'Manage system-wide information like company name, address, time zone, and language.',
            path: '/admin/settings/general',
            color: 'var(--accent-blue)'
        },
        {
            title: 'SMTP Settings',
            icon: <Mail size={24} />,
            description: 'Configure your outgoing mail server for automated system notifications.',
            path: '/admin/settings/smtp',
            color: 'var(--accent-green)'
        },
        {
            title: 'Email Templates',
            icon: <FileText size={24} />,
            description: 'Customize the email templates used for application confirmations and interview invites.',
            path: '/admin/settings/templates',
            color: 'var(--accent-purple)'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}
        >
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    SYSTEM CONFIGURATION
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Settings</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Manage your RecruitPro environment, external connections, and automated communications.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        onClick={() => navigate(section.path)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel hover-card"
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '220px',
                            transition: 'all 0.3s ease',
                            border: '1px solid var(--glass-border)'
                        }}
                    >
                        <div>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: `rgba(${section.color === 'var(--accent-blue)' ? '59,130,246' : section.color === 'var(--accent-green)' ? '16,185,129' : '139,92,246'}, 0.1)`,
                                color: section.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {section.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{section.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{section.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: section.color, fontSize: '0.85rem', fontWeight: 700, marginTop: '2rem' }}>
                            Configure <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx="true">{`
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border-color: var(--accent-green) !important;
                }
            `}</style>
        </motion.div>
    );
}
