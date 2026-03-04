import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Target,
    Settings,
    Save,
    X
} from 'lucide-react';
import axios from 'axios';

export default function JobManager() {
    const [jobs, setJobs] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        status: 'Active',
        description: '',
        technicalParameters: {
            minIQ: 70,
            minEthics: 70,
            minResilience: 70
        }
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/jobs');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/jobs', formData);
            setFormData({
                title: '',
                department: '',
                status: 'Active',
                description: '',
                technicalParameters: { minIQ: 70, minEthics: 70, minResilience: 70 }
            });
            setIsCreating(false);
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job post?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/jobs/${id}`);
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>JOB MANAGEMENT</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Define roles and target psychometric profiles.</p>
                </div>
                <button onClick={() => setIsCreating(true)} className="btn btn-primary">
                    <Plus size={20} /> CREATE NEW ROLE
                </button>
            </header>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                        style={{ padding: '3rem', marginBottom: '3rem', border: '1px solid var(--accent-blue)' }}
                    >
                        <form onSubmit={handleCreate}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Settings size={20} color="var(--accent-blue)" /> CONFIGURE RECRUITMENT PARAMETERS
                                </h3>
                                <button type="button" onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div className="form-group">
                                    <label className="form-label">JOB TITLE</label>
                                    <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Lead Software Architect" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DEPARTMENT</label>
                                    <input type="text" className="form-control" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required placeholder="e.g. Core Engineering" />
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-subtle)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid var(--border-subtle)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--accent-green)' }}>
                                    <Target size={18} /> PSYCHOMETRIC FILTERS (TARGET BASES)
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">MIN IQ (X-Axis)</label>
                                        <input type="number" className="form-control" value={formData.technicalParameters.minIQ} onChange={e => setFormData({ ...formData, technicalParameters: { ...formData.technicalParameters, minIQ: Number(e.target.value) } })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">MIN ETHICS (Y-Axis)</label>
                                        <input type="number" className="form-control" value={formData.technicalParameters.minEthics} onChange={e => setFormData({ ...formData, technicalParameters: { ...formData.technicalParameters, minEthics: Number(e.target.value) } })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">MIN RELIANCE (Z-Axis)</label>
                                        <input type="number" className="form-control" value={formData.technicalParameters.minResilience} onChange={e => setFormData({ ...formData, technicalParameters: { ...formData.technicalParameters, minResilience: Number(e.target.value) } })} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                <Save size={20} /> PUBLISH ROLE
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {jobs.map(job => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-panel"
                        style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                                <Briefcase size={24} color="var(--accent-blue)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                                    <span>{job.department}</span>
                                    <span>•</span>
                                    <span style={{ color: 'var(--accent-green)' }}>{job.status}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Badge label="X" value={job.technicalParameters.minIQ} color="var(--accent-blue)" />
                                <Badge label="Y" value={job.technicalParameters.minEthics} color="var(--accent-purple)" />
                                <Badge label="Z" value={job.technicalParameters.minResilience} color="var(--accent-green)" />
                            </div>
                            <button onClick={() => handleDelete(job._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', opacity: 0.6 }}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {jobs.length === 0 && !loading && (
                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                        <p>No active job posts. Initialize your first recruitment pipeline.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Badge({ label, value, color }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color }}>{value}+</div>
        </div>
    );
}
