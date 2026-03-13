import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Activity,
    AlertTriangle,
    Users,
    UserPlus,
    CheckCircle,
    Zap,
    TrendingUp,
    Cpu,
    FileText
} from 'lucide-react';

export default function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/candidates');
                if (res.data.length > 0) {
                    setCandidates(res.data);
                } else {
                    setCandidates([{ name: "No data available", _id: "none", isPlaceholder: true }]);
                }
            } catch (err) {
                console.warn("Backend API not reachable. Loading demo data...");
                setCandidates([
                    {
                        _id: '8472-Alpha',
                        name: 'Syed Adeel',
                        coordinates: { X: 98.0, Y: 96.0, Z: 92.0 },
                        rho: 0.98,
                        flags: [],
                        isRejected: false,
                        stage: 'Evaluated'
                    },
                    {
                        _id: '9921-Beta',
                        name: 'Victor Void',
                        coordinates: { X: 94.0, Y: 12.0, Z: 96.0 },
                        rho: 0.12,
                        flags: ["Ethics concerns detected in decision making."],
                        isRejected: true,
                        stage: 'Evaluated'
                    },
                    {
                        _id: '1021-Gamma',
                        name: 'Sarah Stoic',
                        coordinates: { X: 85.0, Y: 99.0, Z: 88.0 },
                        rho: 0.94,
                        flags: [],
                        isRejected: false,
                        stage: 'Assessment Completed'
                    },
                    {
                        _id: '1122-Delta',
                        name: 'John Doe',
                        positionApplied: 'Software Architect',
                        stage: 'Applied',
                        isRejected: false
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                <Cpu size={48} color="var(--accent-green)" />
            </motion.div>
            <p style={{ marginTop: '2rem', fontWeight: 600, color: 'var(--accent-green)', letterSpacing: '1px' }}>Loading Dashboard...</p>
        </div>
    );

    const activeCandidates = candidates.filter(c => !c.isPlaceholder);
    const intakeCandidates = activeCandidates.filter(c => c.stage === 'Applied');
    const evaluatedCandidates = activeCandidates.filter(c => c.stage === 'Assessment Completed');

    const qualifiedCount = evaluatedCandidates.filter(c => c.rho >= 0.8 && !c.isRejected).length;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-container">

            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>
                            <Cpu size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Recruitment Dashboard</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Overview</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Track candidate progress and assessment results.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <StatItem icon={<Users size={16} />} label="Total Profiles" value={activeCandidates.length} />
                        <StatItem icon={<UserPlus size={16} />} label="New Apps" value={intakeCandidates.length} color="var(--accent-blue)" />
                        <StatItem icon={<CheckCircle size={16} />} label="High Potential" value={qualifiedCount} color="var(--accent-green)" />
                    </div>
                </div>

                <div style={{ height: '1px', width: '100%', background: 'var(--glass-border)' }} />
            </header>

            {intakeCandidates.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1rem', color: 'var(--accent-blue)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} /> New Applications
                    </h2>
                    <div className="dashboard-grid">
                        {intakeCandidates.map((c, i) => (
                            <CandidateCard key={c._id} c={c} delay={i * 0.05} />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 style={{ fontSize: '1rem', color: 'var(--accent-green)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> Assessed Candidates
                </h2>
                <div className="dashboard-grid">
                    {evaluatedCandidates.map((c, i) => (
                        <CandidateCard key={c._id} c={c} delay={i * 0.05} />
                    ))}
                    {evaluatedCandidates.length === 0 && (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', opacity: 0.6, gridColumn: 'span 3' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No assessed candidates yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}

function CandidateCard({ c, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Link to={`/admin/candidate/${c._id}`} state={{ candidate: c }} className="glass-panel candidate-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{c.name}</h3>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                            ID: {c.candidateId || (c._id?.length > 8 ? c._id.slice(-8).toUpperCase() : c._id)}
                        </p>
                    </div>
                    <span className={`status-badge ${c.stage === 'Applied' ? 'status-pending' : c.isRejected ? 'status-rejected' : 'status-valid'}`}>
                        {c.stage === 'Applied' ? 'Pending' : c.isRejected ? 'Rejected' : 'Qualified'}
                    </span>
                </div>

                {c.stage === 'Applied' ? (
                    <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Position Applied:</p>
                        <p style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{c.positionApplied || 'General Role'}</p>
                    </div>
                ) : (
                    <>
                        <div className="metrics-row">
                            <div className="metric-mini">
                                <div className="metric-label">Logic</div>
                                <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>{c.coordinates?.X}</div>
                            </div>
                            <div className="metric-mini">
                                <div className="metric-label">Ethics</div>
                                <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>{c.coordinates?.Y}</div>
                            </div>
                            <div className="metric-mini">
                                <div className="metric-label">Pressure</div>
                                <div className="metric-value">{c.coordinates?.Z}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Stability</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.rho >= 0.8 ? 'var(--accent-green)' : c.rho < 0.5 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                                    {(c.rho * 100).toFixed(0)}%
                                </div>
                            </div>
                            {c.rho >= 0.9 && <Zap size={20} color="var(--accent-green)" fill="var(--accent-green)" style={{ opacity: 0.5 }} />}
                        </div>
                    </>
                )}

                {c.flags?.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontSize: '0.7rem', fontWeight: 700 }}>
                        <AlertTriangle size={12} /> ATTENTION REQUIRED
                    </div>
                )}
            </Link>
        </motion.div>
    );
}

function StatItem({ icon, label, value, color = "inherit" }) {
    return (
        <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{value}</div>
        </div>
    );
}

function MetricMini({ label, value, color }) {
    return (
        <div className="metric-mini">
            <div className="metric-label">{label}</div>
            <div className="metric-value" style={{ color }}>{value}</div>
        </div>
    );
}
