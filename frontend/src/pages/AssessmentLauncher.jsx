import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dna,
    ShieldAlert,
    Target,
    Play,
    ArrowRight,
    Brain,
    AlertCircle
} from 'lucide-react';
import PatternPuzzle from '../components/PatternPuzzle';
import EthicsSimulator from '../components/EthicsSimulator';

export default function AssessmentLauncher() {
    const [stage, setStage] = useState('intro'); // intro, qf_test, ethics_test, final_loading
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
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>CANDIDATE ASSESSMENT</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                                You are beginning the professional evaluation. This system measures your intelligence, ethics, and ability to handle pressure.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                            {[
                                { icon: <Target className="val-x" />, title: "Intelligence", desc: "Pattern recognition and logic puzzles." },
                                { icon: <ShieldAlert className="val-y" />, title: "Ethics", desc: "Decision scenarios based on your role." },
                                { icon: <Dna className="val-z" />, title: "Resilience", desc: "Performance stability under load." }
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

                        <div style={{
                            padding: '2rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            marginBottom: '3rem',
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center'
                        }}>
                            <AlertCircle size={32} color="var(--accent-red)" />
                            <div>
                                <h4 style={{ color: 'var(--accent-red)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>IMPORTANT INSTRUCTIONS</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Please answer all questions honestly. Your progress is saved automatically.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ENTER FULL NAME"
                                    style={{ flex: 1, fontSize: '1rem', padding: '1rem' }}
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ENTER JOB TITLE (e.g. Developer, Manager)"
                                    style={{ flex: 1, fontSize: '1rem', padding: '1rem' }}
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '1rem', width: '100%', justifyContent: 'center' }}
                                onClick={startAssessment}
                                disabled={!candidateName || !jobTitle}
                            >
                                START ASSESSMENT <ArrowRight size={20} />
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
                        onComplete={() => setStage('final_loading')}
                    />
                )}

            </AnimatePresence>
        </div>
    );
}
