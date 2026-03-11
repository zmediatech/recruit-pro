import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmailTemplateManager from '../components/EmailTemplateManager';

export default function TemplateSettingsPage() {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
            <button
                onClick={() => navigate('/admin/settings')}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0, opacity: 0.7 }}
            >
                <ArrowLeft size={16} /> BACK TO SETTINGS
            </button>

            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    COMMUNICATIONS
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={32} color="var(--accent-purple)" /> Email Templates
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Manage the subjects and body content for automated system emails like interview invitations and confirmations.
                </p>
            </header>

            <EmailTemplateManager />
        </motion.div>
    );
}
