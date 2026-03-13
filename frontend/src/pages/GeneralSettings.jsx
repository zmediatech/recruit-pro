import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Building2, AlignLeft, Globe, Palette, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

export default function GeneralSettings({ activeSection }) {
    const navigate = useNavigate();
    const { theme, setThemeMode } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        systemName: '',
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyAddress: '',
        timeZone: 'UTC',
        defaultLanguage: 'English',
        theme: 'dark'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5001/api/admin/system-settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success && res.data.settings) {
                    setForm(prev => ({ ...prev, ...res.data.settings }));
                }
            } catch (err) {
                console.error("Failed to load general settings", err);
                setError('Failed to load settings. Ensure backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleThemeChange = (mode) => {
        setForm({ ...form, theme: mode });
        setThemeMode(mode); // Preview theme instantly
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('http://localhost:5001/api/admin/system-settings', form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setError(res.data.message || 'Failed to save settings.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                <Loader2 size={40} className="spinning" color="var(--accent-green)" />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade">
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    CONFIGURATION
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                    {activeSection === 'theme' ? 'Theme Settings' : 'General Configuration'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    {activeSection === 'theme' ? 'Customize the visual appearance of the platform.' : 'Manage system branding and core company details.'}
                </p>
            </header>

            {(message || error) && (
                <div style={{
                    padding: '1rem', marginBottom: '2rem', borderRadius: '10px',
                    background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: error ? '#f87171' : '#10b981',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`
                }}>
                    {error || message}
                </div>
            )}

            <form onSubmit={handleSave} className="glass-panel" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                
                {/* Theme Mode Toggle - New Section */}
                <div style={{ 
                    marginBottom: '2rem', 
                    paddingBottom: '2.5rem', 
                    borderBottom: '1px solid var(--glass-border)',
                    background: activeSection === 'theme' ? 'rgba(59,130,246,0.03)' : 'transparent',
                    padding: activeSection === 'theme' ? '1.5rem' : '0 0 2.5rem 0',
                    borderRadius: '12px'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Palette size={18} color="var(--accent-blue)" /> Theme Mode
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[
                            { id: 'light', label: 'Light Mode', icon: Sun, color: '#f59e0b' },
                            { id: 'dark', label: 'Dark Mode', icon: Moon, color: '#3b82f6' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                type="button"
                                onClick={() => handleThemeChange(mode.id)}
                                style={{
                                    flex: 1,
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: `2px solid ${form.theme === mode.id ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
                                    background: form.theme === mode.id ? 'rgba(59,130,246,0.05)' : 'var(--bg-primary)',
                                    color: form.theme === mode.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                <mode.icon size={24} color={form.theme === mode.id ? mode.color : 'currentColor'} />
                                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{mode.label}</span>
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Applying a theme will affect all interfaces including the candidate portal.</p>
                </div>

                {activeSection !== 'theme' && (
                    <>
                        {/* App Configuration */}
                        <div style={{ marginBottom: '2rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlignLeft size={18} color="var(--accent-purple)" /> App Configuration
                            </h3>
                            <div className="form-group">
                                <label className="saas-label">SYSTEM NAME</label>
                                <input
                                    type="text" name="systemName" className="saas-input" required
                                    value={form.systemName} onChange={handleChange}
                                    placeholder="e.g. RecruitPro AI Platform"
                                />
                                <p className="saas-helper">Used in page titles and internal dashboards.</p>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div style={{ marginBottom: '2rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Building2 size={18} color="var(--accent-blue)" /> Company Information
                            </h3>
                            <div className="saas-grid saas-grid-2">
                                <div className="form-group">
                                    <label className="saas-label">COMPANY NAME</label>
                                    <input type="text" name="companyName" className="saas-input" required value={form.companyName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">COMPANY EMAIL</label>
                                    <input type="email" name="companyEmail" className="saas-input" required value={form.companyEmail} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">COMPANY PHONE</label>
                                    <input type="text" name="companyPhone" className="saas-input" value={form.companyPhone} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">HEADQUARTERS ADDRESS</label>
                                    <input type="text" name="companyAddress" className="saas-input" value={form.companyAddress} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Regional Settings */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={18} color="var(--accent-green)" /> Regional Settings
                            </h3>
                            <div className="saas-grid saas-grid-2">
                                <div className="form-group">
                                    <label className="saas-label">TIME ZONE</label>
                                    <select name="timeZone" className="saas-input" value={form.timeZone} onChange={handleChange}>
                                        <option value="UTC">UTC (Universal Coordinated Time)</option>
                                        <option value="EST">EST (Eastern Standard Time)</option>
                                        <option value="PST">PST (Pacific Standard Time)</option>
                                        <option value="PKT">PKT (Pakistan Standard Time)</option>
                                        <option value="IST">IST (Indian Standard Time)</option>
                                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">DEFAULT LANGUAGE</label>
                                    <select name="defaultLanguage" className="saas-input" value={form.defaultLanguage} onChange={handleChange}>
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button type="submit" className="saas-btn-primary" disabled={saving} style={{ minWidth: '160px', justifyContent: 'center' }}>
                        {saving ? <Loader2 size={18} className="spinning" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
