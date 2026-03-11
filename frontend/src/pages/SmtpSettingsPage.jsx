import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SmtpSetupForm from '../components/SmtpSetupForm';

export default function SmtpSettingsPage() {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <button
                onClick={() => navigate('/admin/settings')}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0, opacity: 0.7 }}
            >
                <ArrowLeft size={16} /> BACK TO SETTINGS
            </button>

            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    COMMUNICATIONS
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={32} color="var(--accent-green)" /> SMTP Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Configure the secure mail relay to enable automated system notifications and candidate correspondence.
                </p>
            </header>

            <article className="glass-panel" style={{ padding: '0' }}>
                <SmtpSetupForm />
            </article>
        </motion.div>
    );
}
