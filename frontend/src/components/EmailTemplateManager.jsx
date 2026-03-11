import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Edit3, Save, Loader2, Info, ChevronRight, Check } from 'lucide-react';
import axios from 'axios';

export default function EmailTemplateManager() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5001/api/admin/templates', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTemplates(res.data.templates);
                if (res.data.templates.length > 0) {
                    setSelectedTemplate(res.data.templates[0]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch templates:", err);
            setMessage({ type: 'error', text: 'Failed to load email templates.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.put(`http://localhost:5001/api/admin/templates/${selectedTemplate._id}`, {
                subject: selectedTemplate.subject,
                body: selectedTemplate.body
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTemplates(prev => prev.map(t => t._id === selectedTemplate._id ? res.data.template : t));
                setMessage({ type: 'success', text: 'Template updated successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update template.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={40} className="spinning" color="var(--accent-green)" />
        </div>
    );

    return (
        <div className="saas-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--saas-border-card)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '600px' }}>
                {/* Sidebar */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--saas-border-card)', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <Mail size={20} color="var(--accent-green)" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>TEMPLATES</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {templates.map(t => (
                            <button
                                key={t._id}
                                onClick={() => setSelectedTemplate(t)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: selectedTemplate?._id === t._id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    color: selectedTemplate?._id === t._id ? 'var(--accent-green)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</span>
                                {selectedTemplate?._id === t._id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div style={{ padding: '2.5rem', background: 'var(--bg-main)' }}>
                    <AnimatePresence mode="wait">
                        {selectedTemplate ? (
                            <motion.div
                                key={selectedTemplate._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>{selectedTemplate.name}</h2>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modify the content and subject line for this trigger.</p>
                                    </div>
                                    <button
                                        className="saas-btn-primary"
                                        style={{ height: '44px', padding: '0 1.5rem' }}
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? <Loader2 size={18} className="spinning" /> : <><Save size={18} /> SAVE CHANGES</>}
                                    </button>
                                </div>

                                {message.text && (
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginBottom: '2rem',
                                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {message.type === 'success' ? <Check size={16} /> : <Info size={16} />}
                                        {message.text}
                                    </div>
                                )}

                                <div style={{ marginBottom: '2rem' }}>
                                    <label className="saas-label">EMAIL SUBJECT</label>
                                    <input
                                        className="saas-input"
                                        value={selectedTemplate.subject}
                                        onChange={e => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                                        placeholder="Enter subject line..."
                                    />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <label className="saas-label">EMAIL BODY</label>
                                    <textarea
                                        className="saas-input"
                                        style={{ flex: 1, minHeight: '300px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6', padding: '1.5rem', resize: 'none' }}
                                        value={selectedTemplate.body}
                                        onChange={e => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                                        placeholder="Compose your email..."
                                    />
                                </div>

                                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--saas-border-card)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <Info size={16} color="var(--accent-green)" />
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Available Dynamic Variables</h4>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {selectedTemplate.variables.map(v => (
                                            <code
                                                key={v}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--accent-green)',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    const textarea = document.querySelector('textarea');
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const text = selectedTemplate.body;
                                                    const newText = text.substring(0, start) + `{${v}}` + text.substring(end);
                                                    setSelectedTemplate({ ...selectedTemplate, body: newText });
                                                }}
                                            >
                                                {`{${v}}`}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                <p>Select a template from the sidebar to edit.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
