import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminLogin() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/admin/login', formData);
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check connectivity.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="saas-card"
                style={{ width: '100%', maxWidth: '450px', padding: '3.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--saas-text-heading)' }}>Admin Access</h1>
                    <p style={{ color: 'var(--saas-text-helper)', marginTop: '0.5rem' }}>Enter credentials to access Super Admin Panel</p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="saas-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saas-text-helper)' }} />
                            <input
                                type="text"
                                className="saas-input"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="Admin ID"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                        <label className="saas-label">Secret Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saas-text-helper)' }} />
                            <input
                                type="password"
                                className="saas-input"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="saas-btn-primary"
                        style={{ width: '100%', height: '56px', justifyContent: 'center', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={20} className="spinning" /> : <>AUTHENTICATE <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 700, letterSpacing: '1px' }}>RECRUITPRO ENGINE v2.0</p>
                </div>
            </motion.div>
        </div>
    );
}
