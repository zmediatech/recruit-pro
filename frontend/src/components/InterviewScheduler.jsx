import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Send, Loader2, CheckCircle, Info } from 'lucide-react';
import axios from 'axios';

export default function InterviewScheduler({ candidate, onScheduled }) {
    const [formData, setFormData] = useState({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'Online',
        interviewLink: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(`http://localhost:5001/api/admin/candidates/${candidate._id}/schedule`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setStatus({ type: 'success', text: 'Interview scheduled and invitation email sent!' });
                if (onScheduled) onScheduled(res.data);
            }
        } catch (err) {
            console.error("Scheduling failed:", err);
            setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to schedule interview.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Calendar size={24} color="var(--accent-green)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SCHEDULE INTERVIEW</h3>
            </div>

            {status.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 600
                }}>
                    {status.type === 'success' ? <CheckCircle size={16} /> : <Info size={16} />}
                    {status.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label className="saas-label">INTERVIEW DATE</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={16} className="saas-input-icon" />
                            <input
                                type="date"
                                className="saas-input"
                                required
                                value={formData.interviewDate}
                                onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="saas-label">INTERVIEW TIME</label>
                        <div style={{ position: 'relative' }}>
                            <Clock size={16} className="saas-input-icon" />
                            <input
                                type="time"
                                className="saas-input"
                                required
                                value={formData.interviewTime}
                                onChange={e => setFormData({ ...formData, interviewTime: e.target.value })}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">INTERVIEW TYPE</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['Online', 'Physical'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, interviewType: type })}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: formData.interviewType === type ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    color: formData.interviewType === type ? 'var(--accent-green)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {type === 'Online' ? <Video size={16} /> : <MapPin size={16} />}
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">{formData.interviewType === 'Online' ? 'MEETING LINK (GOOGLE MEET / ZOOM)' : 'LOCATION ADDRESS'}</label>
                    <div style={{ position: 'relative' }}>
                        {formData.interviewType === 'Online' ? <Video size={16} className="saas-input-icon" /> : <MapPin size={16} className="saas-input-icon" />}
                        <input
                            type="text"
                            className="saas-input"
                            required
                            placeholder={formData.interviewType === 'Online' ? 'https://meet.google.com/...' : 'Office Address...'}
                            value={formData.interviewLink}
                            onChange={e => setFormData({ ...formData, interviewLink: e.target.value })}
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="saas-label">ADDITIONAL NOTES (OPTIONAL)</label>
                    <textarea
                        className="saas-input"
                        placeholder="Any instructions for the candidate..."
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        style={{ minHeight: '100px', padding: '1rem' }}
                    />
                </div>

                <button
                    type="submit"
                    className="saas-btn-primary"
                    style={{ height: '56px', marginTop: '1rem' }}
                    disabled={loading}
                >
                    {loading ? <Loader2 size={20} className="spinning" /> : <><Send size={20} /> SCHEDULE INTERVIEW & SEND EMAIL</>}
                </button>
            </form>
        </div>
    );
}
