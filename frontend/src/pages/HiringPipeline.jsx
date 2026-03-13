import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    Search, 
    Eye, 
    Calendar, 
    MessageSquare, 
    ArrowRightCircle, 
    Loader2, 
    RefreshCw,
    GripVertical,
    MoreHorizontal
} from 'lucide-react';
import axios from 'axios';

const STAGES = [
    'Applied', 
    'Assessment Completed', 
    'Shortlisted', 
    'Interview Scheduled', 
    'Interview Completed', 
    'Offer Sent', 
    'Hired', 
    'Rejected'
];

const STAGE_COLORS = {
    'Applied': '#3b82f6',
    'Assessment Completed': '#10b981',
    'Shortlisted': '#8b5cf6',
    'Interview Scheduled': '#f59e0b',
    'Interview Completed': '#6366f1',
    'Offer Sent': '#ec4899',
    'Hired': '#10b981',
    'Rejected': '#ef4444'
};

const CandidateCard = ({ candidate, moveCandidate, onDragStart }) => {
    const navigate = useNavigate();
    
    // Calculate display score (Technical + avg of core)
    const techScore = candidate.technicalAssessment?.overallScore || 0;
    const coreScore = ((candidate.coordinates?.X || 0) + (candidate.coordinates?.Y || 0)) / 2;
    const displayScore = Math.round((techScore + coreScore) / 1.5); // Normalized indicator

    return (
        <motion.div
            layout
            draggable
            onDragStart={(e) => onDragStart(e, candidate._id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                cursor: 'grab',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-secondary)',
                position: 'relative'
            }}
            whileHover={{ y: -2, borderColor: 'var(--accent-blue)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    {candidate.candidateId || '#' + candidate._id.slice(-4).toUpperCase()}
                </span>
                <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: displayScore > 75 ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                    color: displayScore > 75 ? '#10b981' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 900
                }}>
                    {displayScore}%
                </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>{candidate.name}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{candidate.positionApplied}</p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button 
                    onClick={() => navigate(`/admin/candidate/${candidate._id}`)}
                    className="btn btn-outline" 
                    style={{ padding: '0.3rem', flex: 1, justifyContent: 'center', fontSize: '0.7rem' }}
                >
                    <Eye size={12} /> View
                </button>
                <button 
                    onClick={() => moveCandidate(candidate._id, STAGES[STAGES.indexOf(candidate.stage) + 1])}
                    className="saas-btn-primary" 
                    style={{ padding: '0.3rem', flex: 1, justifyContent: 'center', background: 'var(--accent-blue)', fontSize: '0.7rem' }}
                    disabled={STAGES.indexOf(candidate.stage) >= STAGES.length - 2}
                >
                    Next <ArrowRightCircle size={12} />
                </button>
            </div>
        </motion.div>
    );
};

export default function HiringPipeline() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCandidates = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const res = await axios.get('http://localhost:5001/api/candidates');
            setCandidates(res.data);
        } catch (err) {
            console.error('Failed to fetch candidates:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const moveCandidate = async (id, newStage) => {
        if (!newStage || !STAGES.includes(newStage)) return;
        
        // Optimistic update
        const originalCandidates = [...candidates];
        setCandidates(candidates.map(c => c._id === id ? { ...c, stage: newStage } : c));

        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(`http://localhost:5001/api/candidates/${id}/stage`, 
                { stage: newStage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error('Failed to update stage:', err);
            setCandidates(originalCandidates);
            alert('Failed to move candidate. System logic prevented the transition.');
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('candidateId', id);
    };

    const handleDrop = (e, stage) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('candidateId');
        moveCandidate(id, stage);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const filteredCandidates = candidates.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.positionApplied?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 size={40} className="spinning" color="var(--accent-green)" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Hiring Pipeline</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Visual recruitment management system</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Find candidate..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="saas-input"
                            style={{ paddingLeft: '2.5rem', height: '40px' }}
                        />
                    </div>
                    <button onClick={() => fetchCandidates(true)} className="btn btn-outline" disabled={refreshing}>
                        <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                    </button>
                </div>
            </header>

            <div style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                overflowX: 'auto', 
                paddingBottom: '1rem',
                flexGrow: 1,
                alignItems: 'stretch'
            }}>
                {STAGES.map(stage => (
                    <div 
                        key={stage}
                        onDrop={(e) => handleDrop(e, stage)}
                        onDragOver={handleDragOver}
                        style={{ 
                            minWidth: '280px', 
                            maxWidth: '280px',
                            background: 'var(--bg-subtle)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            border: '1px solid var(--glass-border)'
                        }}
                    >
                        <div style={{ 
                            padding: '1.25rem', 
                            borderBottom: '2px solid ' + (STAGE_COLORS[stage] || '#ccc'),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stage}</h3>
                            <span style={{ 
                                background: 'var(--glass-border)', 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                fontSize: '0.7rem',
                                fontWeight: 800
                            }}>
                                {filteredCandidates.filter(c => c.stage === stage).length}
                            </span>
                        </div>

                        <div style={{ 
                            padding: '1rem', 
                            overflowY: 'auto',
                            flexGrow: 1
                        }}>
                            <AnimatePresence>
                                {filteredCandidates
                                    .filter(c => c.stage === stage || (!c.stage && stage === 'Applied'))
                                    .map(candidate => (
                                        <CandidateCard 
                                            key={candidate._id} 
                                            candidate={candidate} 
                                            moveCandidate={moveCandidate}
                                            onDragStart={handleDragStart}
                                        />
                                    ))
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx="true">{`
                ::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--glass-border);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--text-secondary);
                }
            `}</style>
        </div>
    );
}
