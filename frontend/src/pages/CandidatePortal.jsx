import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    MapPin,
    Clock,
    ChevronRight,
    Rocket,
    Globe,
    Building2,
    Search
} from 'lucide-react';
import axios from 'axios';

export default function CandidatePortal() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/jobs');
                setJobs(res.data.filter(j => j.status === 'Active'));
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <Rocket size={16} /> Empowering Your Career
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--saas-text-heading)', letterSpacing: '-0.02em' }}>
                        Find Your Next Big <span style={{ color: '#3b82f6' }}>Opportunity</span>
                    </h1>
                    <p style={{ color: 'var(--saas-text-helper)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
                        Join the most innovative companies and prove your potential through our AI-driven assessment orchestration.
                    </p>
                </motion.div>

                <div style={{ maxWidth: 600, margin: '3rem auto 0', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--saas-text-helper)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search for roles, locations..."
                        className="saas-input"
                        style={{ paddingLeft: '3.5rem', height: '60px', borderRadius: '15px' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="saas-grid saas-grid-3">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="saas-card" style={{ height: '300px', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                    ))
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="saas-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                            }}
                            onClick={() => navigate(`/jobs/${job._id}`)}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                                        <Briefcase size={24} />
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '100px', color: 'var(--saas-text-helper)' }}>
                                        {job.jobType[0]}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--saas-text-heading)', marginBottom: '0.5rem' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--saas-text-helper)', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MapPin size={14} /> {job.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Globe size={14} /> {job.locationType}
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.875rem', color: 'var(--saas-text-body)', lineHeight: 1.6, marginBottom: '2rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                {job.description || 'No description provided for this role.'}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--saas-border-card)' }}>
                                <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                                    PKR {job.pay.min.toLocaleString()} - {job.pay.max.toLocaleString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', fontWeight: 700, fontSize: '0.875rem' }}>
                                    DETAILS <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
                        <Building2 size={64} color="var(--saas-text-helper)" style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                        <h2 style={{ color: 'var(--saas-text-heading)' }}>No jobs found matching your criteria.</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
