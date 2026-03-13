import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users, Search, Eye, Calendar, ChevronRight,
    Loader2, Filter, RefreshCw, Download, Circle
} from 'lucide-react';
import axios from 'axios';

const STATUS_COLORS = {
    'Applied': { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', dot: '#3b82f6' },
    'Assessment Completed': { bg: 'rgba(16,185,129,0.1)', text: '#10b981', dot: '#10b981' },
    'Shortlisted': { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6', dot: '#8b5cf6' },
    'Interview Scheduled': { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', dot: '#f59e0b' },
    'Interview Completed': { bg: 'rgba(99,102,241,0.1)', text: '#6366f1', dot: '#6366f1' },
    'Offer Sent': { bg: 'rgba(236,72,153,0.1)', text: '#ec4899', dot: '#ec4899' },
    'Hired': { bg: 'rgba(16,185,129,0.2)', text: '#10b981', dot: '#10b981' },
    'Rejected': { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', dot: '#ef4444' },
    'default': { bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', dot: '#94a3b8' }
};

function StatusBadge({ status }) {
    const style = STATUS_COLORS[status] || STATUS_COLORS['default'];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.8rem', borderRadius: '20px',
            background: style.bg, color: style.text,
            fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap'
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot, display: 'inline-block' }} />
            {status || 'Intake'}
        </span>
    );
}

export default function CandidatesList() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('All');
    const [refreshing, setRefreshing] = useState(false);

    const fetchCandidates = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await axios.get('http://localhost:5001/api/candidates');
            // Sort newest first
            const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setCandidates(sorted);
        } catch (err) {
            console.error('Failed to fetch candidates:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin/login');
        fetchCandidates();
    }, []);

    const stages = ['All', 'Applied', 'Assessment Completed', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Offer Sent', 'Hired', 'Rejected'];

    const filtered = candidates.filter(c => {
        const matchesSearch =
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.candidateId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.positionApplied?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStage === 'All' || c.stage === filterStage;
        return matchesSearch && matchesFilter;
    });

    const stageCounts = stages.reduce((acc, s) => {
        acc[s] = s === 'All' ? candidates.length : candidates.filter(c => c.stage === s).length;
        return acc;
    }, {});

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        SUPER ADMIN PANEL
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>Candidates</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {candidates.length} applicant{candidates.length !== 1 ? 's' : ''} in the recruitment pipeline
                    </p>
                </div>
                <button
                    onClick={() => fetchCandidates(true)}
                    className="btn btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={refreshing}
                >
                    <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                    Refresh
                </button>
            </header>

            {/* Stage Filter Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {stages.map(stage => {
                    const isActive = filterStage === stage;
                    const stColor = STATUS_COLORS[stage] || STATUS_COLORS['default'];
                    return (
                        <button
                            key={stage}
                            onClick={() => setFilterStage(stage)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '20px',
                                border: '1px solid var(--glass-border)',
                                background: isActive ? stColor.bg : 'transparent',
                                color: isActive ? stColor.text : 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            {stage}
                            <span style={{
                                background: isActive ? stColor.text : 'var(--glass-border)',
                                color: isActive ? '#fff' : 'var(--text-secondary)',
                                borderRadius: '10px',
                                padding: '0 6px',
                                fontSize: '0.65rem',
                                fontWeight: 800
                            }}>
                                {stageCounts[stage]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search by name, ID, email, or role..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="saas-input"
                    style={{ paddingLeft: '3rem', height: '48px' }}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <Loader2 size={40} className="spinning" color="var(--accent-green)" />
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading candidates...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                    <Users size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No Candidates Found</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {searchTerm ? 'Try adjusting your search query.' : 'No candidates have applied yet.'}
                    </p>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '140px 1fr 1fr 130px 160px 130px',
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--glass-border)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: 'var(--text-secondary)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        <span>APPLICANT ID</span>
                        <span>CANDIDATE</span>
                        <span>JOB APPLIED FOR</span>
                        <span>DATE</span>
                        <span>STATUS</span>
                        <span>ACTION</span>
                    </div>

                    {/* Table Rows */}
                    {filtered.map((candidate, idx) => (
                        <motion.div
                            key={candidate._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '140px 1fr 1fr 130px 160px 130px',
                                padding: '1.1rem 1.5rem',
                                borderBottom: '1px solid var(--glass-border)',
                                alignItems: 'center',
                                transition: 'background 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                                {candidate.candidateId || '#' + candidate._id.slice(-6).toUpperCase()}
                            </span>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.1rem' }}>{candidate.name}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{candidate.email || '—'}</p>
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{candidate.positionApplied || '—'}</p>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {candidate.createdAt
                                    ? new Date(candidate.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
                                    : '—'}
                            </span>
                            <StatusBadge status={candidate.stage} />
                            <button
                                onClick={() => navigate(`/admin/candidate/${candidate._id}`, { state: { candidate } })}
                                className="btn btn-outline"
                                style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <Eye size={14} />
                                View
                            </button>
                        </motion.div>
                    ))}

                    {/* Footer count */}
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Showing {filtered.length} of {candidates.length} candidates
                        </span>
                        <button
                            onClick={() => {
                                const token = localStorage.getItem('adminToken');
                                window.open(`http://localhost:5001/api/admin/export?token=${token}`, '_blank');
                            }}
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <Download size={14} /> Export Excel
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
