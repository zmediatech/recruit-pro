import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Zap,
    ShieldAlert,
    Brain,
    Activity,
    Terminal,
    ChevronRight,
    Lock
} from 'lucide-react';

export default function GauntletPortal() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const candidate = location.state?.candidate;

    const [activeStage, setActiveStage] = useState('Overview');

    const stages = [
        { id: 'fluid', name: 'Logic & Reasoning', icon: <Brain />, status: 'OPEN', color: 'var(--accent-blue)' },
        { id: 'reflection', name: 'Reflective Thinking', icon: <Terminal />, status: 'LOCKED', color: 'var(--accent-purple)' },
        { id: 'ethics', name: 'Ethics & Decisions', icon: <Lock />, status: 'LOCKED', color: 'var(--accent-red)' },
        { id: 'resilience', name: 'Pressure Handling', icon: <Zap />, status: 'LOCKED', color: 'var(--accent-green)' },
    ];

    if (!candidate) return <div style={{ padding: '4rem', textAlign: 'center' }}>Unauthorized access. Please return to the dashboard.</div>;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', paddingTop: '2rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                    <ShieldAlert size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Assessment Center</span>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Career Path Assessment: <span style={{ color: 'var(--text-secondary)' }}>{candidate.name}</span></h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stages.map(stage => (
                        <div
                            key={stage.id}
                            className={`glass-panel ${activeStage === stage.id ? 'active' : ''}`}
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: stage.status === 'LOCKED' ? 0.5 : 1,
                                cursor: stage.status === 'LOCKED' ? 'not-allowed' : 'pointer',
                                borderLeft: `3px solid ${stage.color}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {stage.icon}
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{stage.name}</span>
                            </div>
                            {stage.status === 'LOCKED' ? <Lock size={14} /> : <ChevronRight size={14} />}
                        </div>
                    ))}
                </aside>

                <main>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-panel"
                            style={{ padding: '3rem', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <Brain size={32} color="var(--accent-blue)" />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Ready to Start</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                                This assessment will evaluate your core skills and professional decision-making style to help us find the best fit for your talents.
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{ width: '240px', margin: '0 auto', height: '54px' }}
                                onClick={() => navigate('/assess')}
                            >
                                Begin Section
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
