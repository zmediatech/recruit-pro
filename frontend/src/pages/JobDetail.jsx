import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    Clock,
    Users,
    DollarSign,
    Target,
    Activity,
    FileText,
    Calendar
} from 'lucide-react';
import axios from 'axios';

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [job, setJob] = useState(location.state?.job || null);
    const [loading, setLoading] = useState(!job);

    useEffect(() => {
        if (!job) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/jobs/${id}`);
            setJob(res.data);
        } catch (err) {
            console.error("Failed to fetch job:", err);
        } finally {
            setLoading(false);
        }
    };

    const isAdminPath = location.pathname.startsWith('/admin');

    if (loading) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <Activity className="spinning" size={48} style={{ marginBottom: '2rem', opacity: 0.5 }} />
                <h3>SYNCHRONIZING JOB DATA...</h3>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <Briefcase size={48} style={{ marginBottom: '2rem', opacity: 0.5 }} />
                <h3>JOB SPECIFICATION NOT FOUND</h3>
                <button onClick={() => navigate(isAdminPath ? '/admin/jobs' : '/portal')} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    RETURN TO {isAdminPath ? 'JOB MANAGER' : 'PORTAL'}
                </button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1000, margin: '0 auto' }}>
            <button
                onClick={() => navigate(isAdminPath ? '/admin/jobs' : '/portal')}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0, opacity: 0.6 }}
            >
                <ArrowLeft size={16} /> BACK TO {isAdminPath ? 'JOB MANAGER' : 'PORTAL'}
            </button>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '3rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        {job.department} ROLE
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{job.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {job.location || 'Remote'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {job.jobType.join(', ')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={16} /> {job.peopleToHire} Positions</span>
                    </div>
                </div>
                <div className="status-badge status-valid" style={{ padding: '0.75rem 2rem' }}>
                    {job.status}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={20} color="var(--accent-blue)" /> Job Description
                        </h3>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                            {job.description || "No detailed description provided."}
                        </div>
                    </div>

                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h4 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                            COMPENSATION DETAILS
                        </h4>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            {job.pay.showBy === 'Fixed' ? (
                                `PKR ${job.pay.min?.toLocaleString()}`
                            ) : (
                                `PKR ${job.pay.min?.toLocaleString()} - PKR ${job.pay.max?.toLocaleString()}`
                            )}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            Expected rate {job.pay.rate}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Timeline</span>
                                <span style={{ fontWeight: 600 }}>{job.timeline}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Environment</span>
                                <span style={{ fontWeight: 600 }}>{job.locationType}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Posted</span>
                                <span style={{ fontWeight: 600 }}>{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-subtle)' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{isAdminPath ? 'Candidate Inflow' : 'Join the Team'}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            {isAdminPath
                                ? 'New applicants are being processed by the AI orchestration engine.'
                                : 'Ready to showcase your skills? Start our AI-driven assessment orchestration.'}
                        </p>
                        <button
                            onClick={() => navigate(isAdminPath ? '/admin/dashboard' : '/assess-portal')}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {isAdminPath ? 'VIEW APPLICANTS' : 'APPLY FOR JOB'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function TargetMetric({ label, value, color }) {
    return (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 800 }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color }}>{value}+</div>
        </div>
    );
}
