import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Building2, AlignLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GeneralSettings() {
    const navigate = useNavigate();
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
        defaultLanguage: 'English'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5001/api/admin/system-settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success && res.data.settings) {
                    setForm(res.data.settings);
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Loader2 size={40} className="spinning" color="var(--accent-green)" />
            </div>
        );
    }

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
                    CONFIGURATION
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>General Settings</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage system branding and core company details.</p>
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

            <form onSubmit={handleSave} className="glass-panel">

                {/* System Name */}
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlignLeft size={18} color="var(--accent-purple)" /> App Configuration
                    </h3>
                    <div className="form-group">
                        <label className="saas-label">SYSTEM NAME</label>
                        <input
                            type="text" name="systemName" className="saas-input" required
                            value={form.systemName} onChange={handleChange}
                            placeholder="e.g. RecruitPro AI Platform"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Used in page titles and internal dashboards.</p>
                    </div>
                </div>

                {/* Company Details */}
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} color="var(--accent-blue)" /> Company Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label className="saas-label">COMPANY NAME</label>
                            <input
                                type="text" name="companyName" className="saas-input" required
                                value={form.companyName} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="saas-label">COMPANY EMAIL</label>
                            <input
                                type="email" name="companyEmail" className="saas-input" required
                                value={form.companyEmail} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label className="saas-label">COMPANY PHONE</label>
                            <input
                                type="text" name="companyPhone" className="saas-input"
                                value={form.companyPhone} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="saas-label">HEADQUARTERS ADDRESS</label>
                            <input
                                type="text" name="companyAddress" className="saas-input"
                                value={form.companyAddress} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Region */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={18} color="var(--accent-green)" /> Regional Settings
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button type="button" onClick={() => navigate('/admin/settings')} className="btn btn-outline" style={{ minWidth: '120px', justifyContent: 'center' }}>
                        Cancel
                    </button>
                    <button type="submit" className="saas-btn-primary" disabled={saving} style={{ minWidth: '160px', justifyContent: 'center', display: 'flex', gap: '0.5rem' }}>
                        {saving ? <Loader2 size={18} className="spinning" /> : <Save size={18} />}
                        Save Settings
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
