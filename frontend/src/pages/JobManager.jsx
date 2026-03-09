import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Trash2,
    Briefcase,
    Settings,
    ChevronRight
} from 'lucide-react';
import axios from 'axios';
import JobCreationForm from '../components/JobCreationForm';

export default function JobManager() {
    const [jobs, setJobs] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigation
        if (!window.confirm("Delete this job post?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/jobs/${id}`);
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    if (isCreating) {
        return (
            <JobCreationForm
                onComplete={() => {
                    setIsCreating(false);
                    fetchJobs();
                }}
                onCancel={() => setIsCreating(false)}
            />
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>JOB MANAGEMENT</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage active roles and recruitment pipelines.</p>
                </div>
                <button onClick={() => setIsCreating(true)} className="btn btn-primary">
                    <Plus size={20} /> POST A JOB
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {jobs.map(job => (
                    <motion.div
                        key={job._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.01, borderColor: 'var(--accent-blue)' }}
                        className="glass-panel"
                        onClick={() => navigate(`/admin/jobs/${job._id}`, { state: { job } })}
                        style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s ease' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                                <Briefcase size={24} color="var(--accent-blue)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                                    <span>{job.location || job.department || 'General'}</span>
                                    <span>•</span>
                                    <span style={{ color: 'var(--accent-green)' }}>{job.status}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button onClick={(e) => handleDelete(e, job._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', opacity: 0.6 }}>
                                    <Trash2 size={20} />
                                </button>
                                <ChevronRight size={20} color="var(--text-secondary)" />
                            </div>
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
