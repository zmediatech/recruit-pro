import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dna,
    ShieldAlert,
    Target,
    Play,
    ArrowRight,
    Brain,
    AlertCircle,
    Activity
} from 'lucide-react';
import PatternPuzzle from '../components/PatternPuzzle';
import EthicsSimulator from '../components/EthicsSimulator';
import ResilienceTest from '../components/ResilienceTest';
import AssessmentReport from '../components/AssessmentReport';
import { useNavigate } from 'react-router-dom';

export default function AssessmentLauncher() {
    const navigate = useNavigate();
    const [stage, setStage] = useState('intro'); // intro, qf_test, ethics_test, resilience_test, report
    const [candidateName, setCandidateName] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    const startAssessment = () => {
        if (!candidateName || !jobTitle) return;
        setStage('qf_test');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <AnimatePresence mode="wait">

                {stage === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                border: '1px solid var(--accent-green)',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                            }}>
                                <Brain size={40} className="glow-effect" />
                            </div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ASSESSMENT CENTER</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                                Complete the 3-stage professional evaluation to synchronize your profile with our intelligence engine.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                            {[
                                { icon: <Target className="val-x" />, title: "Intelligence", desc: "Complex pattern recognition." },
                                { icon: <ShieldAlert className="val-y" />, title: "Ethics", desc: "Role-based decision scenarios." },
                                { icon: <Activity className="val-z" />, title: "Resilience", desc: "Performance stability under stress." }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    padding: '1.5rem',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--glass-border)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                                    <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="CANDIDATE NAME"
                                    style={{ flex: 1, fontSize: '0.9rem', padding: '1rem' }}
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="TARGET ROLE"
                                    style={{ flex: 1, fontSize: '0.9rem', padding: '1rem' }}
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '1.25rem', width: '100%', justifyContent: 'center', fontSize: '1rem' }}
                                onClick={startAssessment}
                                disabled={!candidateName || !jobTitle}
                            >
                                START EVALUATION <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {stage === 'qf_test' && (
                    <PatternPuzzle
                        candidateName={candidateName}
                        onComplete={() => setStage('ethics_test')}
                    />
                )}

                {stage === 'ethics_test' && (
                    <EthicsSimulator
                        candidateName={candidateName}
                        jobTitle={jobTitle}
                        onComplete={() => setStage('resilience_test')}
                    />
                )}

                {stage === 'resilience_test' && (
                    <ResilienceTest
                        candidateName={candidateName}
                        onComplete={() => setStage('report')}
                    />
                )}

                {stage === 'report' && (
                    <AssessmentReport
                        candidateName={candidateName}
                        onFinish={() => navigate('/')}
                    />
                )}

            </AnimatePresence>
        </div>
    );
}
