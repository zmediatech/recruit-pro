import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Briefcase,
    TrendingUp,
    FileText,
    Download,
    Plus,
    ChevronRight,
    MoreHorizontal,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    FileDown
} from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin/login');

        const fetchData = async () => {
            try {
                const [candRes, jobRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/candidates'),
                    axios.get('http://localhost:5001/api/jobs')
                ]);
                setCandidates(candRes.data);
                setJobs(jobRes.data);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.candidateId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.positionApplied?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { title: 'Total Applicants', value: candidates.length, icon: Users, color: '#3b82f6' },
        { title: 'Active Jobs', value: jobs.filter(j => j.status === 'Active').length, icon: Briefcase, color: '#10b981' },
        { title: 'Screening Flow', value: candidates.filter(c => c.stage !== 'Assessment Completed').length, icon: TrendingUp, color: '#8b5cf6' },
        { title: 'Evaluated', value: candidates.filter(c => c.stage === 'Assessment Completed').length, icon: CheckCircle2, color: '#f59e0b' }
    ];

    const exportToExcel = () => {
        window.open('http://localhost:5001/api/admin/export', '_blank');
    };

    return (
        <div style={{ padding: '2rem 3rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--saas-text-heading)' }}>Recruitment Orchestration</h1>
                    <p style={{ color: 'var(--saas-text-helper)', marginTop: '0.25rem' }}>Super Admin Control Panel</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="saas-btn-outline" onClick={exportToExcel}>
                        <FileDown size={18} /> EXCEL EXPORT
                    </button>
                    <button className="saas-btn-primary" onClick={() => navigate('/admin/jobs')}>
                        <Plus size={18} /> NEW JOB ROLE
                    </button>
                </div>
            </header>

            <div className="saas-grid saas-grid-4" style={{ marginBottom: '4rem' }}>
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="saas-card"
                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                    >
                        <div style={{ padding: '0.75rem', background: `${s.color}15`, color: s.color, borderRadius: '12px' }}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saas-text-helper)', textTransform: 'uppercase' }}>{s.title}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--saas-text-heading)' }}>{s.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="saas-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--saas-border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>CANDIDATE RESPONSES</h2>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saas-text-helper)' }} />
                        <input
                            type="text"
                            className="saas-input"
                            style={{ height: '36px', fontSize: '0.85rem', paddingLeft: '2.5rem', borderRadius: '8px' }}
                            placeholder="Filter candidates..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--saas-border-card)', background: 'var(--bg-subtle)' }}>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>CANDIDATE ID</th>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>NAME</th>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>JOB ROLE</th>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>DATE</th>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>STATUS</th>
                                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--saas-text-helper)', fontWeight: 800 }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((c, i) => (
                                <tr
                                    key={c._id}
                                    style={{ borderBottom: '1px solid var(--saas-border-card)', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => navigate(`/admin/candidate/${c._id}`)}
                                >
                                    <td style={{ padding: '1rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6' }}>{c.candidateId || 'N/A'}</td>
                                    <td style={{ padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: 600 }}>{c.name}</td>
                                    <td style={{ padding: '1rem 2rem', fontSize: '0.85rem' }}>{c.positionApplied}</td>
                                    <td style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--saas-text-helper)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '6px',
                                            background: c.stage === 'Assessment Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: c.stage === 'Assessment Completed' ? '#10b981' : '#3b82f6'
                                        }}>
                                            {c.stage?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <ChevronRight size={18} color="var(--saas-text-helper)" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
