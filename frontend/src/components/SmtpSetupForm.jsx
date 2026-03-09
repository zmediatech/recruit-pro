import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, Loader2, Server, Shield, Mail, User, Hash } from 'lucide-react';
import axios from 'axios';

export default function SmtpSetupForm() {
    const [config, setConfig] = useState({
        host: '',
        port: 587,
        username: '',
        password: '',
        encryption: 'TLS',
        fromEmail: '',
        fromName: ''
    });
    const [testEmail, setTestEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5001/api/admin/smtp', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.config) {
                setConfig(res.data.config);
            }
        } catch (err) {
            console.error("Failed to fetch SMTP config:", err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('http://localhost:5001/api/admin/smtp', config, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'SMTP Settings Saved Successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleTest = async () => {
        if (!testEmail) {
            setMessage({ type: 'error', text: 'Please enter a test email address first.' });
            return;
        }
        setTesting(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('http://localhost:5001/api/admin/smtp/test', { testEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Test Email Sent! Check your inbox.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Test connection failed.' });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="saas-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '1rem' }}>
                <Server size={24} color="#3b82f6" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SMTP CONFIGURATION</h3>
            </div>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                        border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="saas-grid saas-grid-2" style={{ gap: '2rem' }}>
                <div className="form-group">
                    <label className="saas-label">SMTP HOST</label>
                    <div style={{ position: 'relative' }}>
                        <Server size={16} className="saas-input-icon" />
                        <input
                            type="text"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="smtp.example.com"
                            value={config.host}
                            onChange={e => setConfig({ ...config, host: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">SMTP PORT</label>
                    <div style={{ position: 'relative' }}>
                        <Hash size={16} className="saas-input-icon" />
                        <input
                            type="number"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="587"
                            value={config.port || ''}
                            onChange={e => setConfig({ ...config, port: e.target.value === '' ? '' : parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">USERNAME / EMAIL</label>
                    <div style={{ position: 'relative' }}>
                        <User size={16} className="saas-input-icon" />
                        <input
                            type="text"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="postmaster@yourdomain.com"
                            value={config.username}
                            onChange={e => setConfig({ ...config, username: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">PASSWORD</label>
                    <div style={{ position: 'relative' }}>
                        <Shield size={16} className="saas-input-icon" />
                        <input
                            type="password"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="••••••••"
                            value={config.password}
                            onChange={e => setConfig({ ...config, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">ENCRYPTION TYPE</label>
                    <select
                        className="saas-input"
                        value={config.encryption}
                        onChange={e => setConfig({ ...config, encryption: e.target.value })}
                    >
                        <option value="TLS">STARTTLS (Port 587)</option>
                        <option value="SSL">SSL/TLS (Port 465)</option>
                        <option value="None">None (Unencrypted)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="saas-label">FROM EMAIL ADDRESS</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={16} className="saas-input-icon" />
                        <input
                            type="email"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="noreply@recruitpro.com"
                            value={config.fromEmail}
                            onChange={e => setConfig({ ...config, fromEmail: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">FROM DISPLAY NAME</label>
                    <div style={{ position: 'relative' }}>
                        <User size={16} className="saas-input-icon" />
                        <input
                            type="text"
                            className="saas-input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="RecruitPro HR"
                            value={config.fromName}
                            onChange={e => setConfig({ ...config, fromName: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--saas-border-card)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ width: '300px' }}>
                    <label className="saas-label" style={{ fontSize: '0.7rem' }}>TEST RECIPIENT EMAIL</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            className="saas-input"
                            placeholder="test@example.com"
                            style={{ height: '40px', fontSize: '0.8rem' }}
                            value={testEmail}
                            onChange={e => setTestEmail(e.target.value)}
                        />
                        <button
                            className="saas-btn-outline"
                            style={{ height: '40px', padding: '0 1rem', fontSize: '0.75rem' }}
                            onClick={handleTest}
                            disabled={testing}
                        >
                            {testing ? <Loader2 size={16} className="spinning" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    className="saas-btn-primary"
                    style={{ height: '56px', padding: '0 3rem' }}
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? <Loader2 size={20} className="spinning" /> : <><Save size={20} /> SAVE CONFIGURATION</>}
                </button>
            </div>
        </div>
    );
}
