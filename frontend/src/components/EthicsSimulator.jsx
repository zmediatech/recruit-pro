import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Scale, ArrowRight, Save, Terminal, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ethicsScenarios } from '../data/assessmentData';

export default function EthicsSimulator({ candidateName, jobTitle, onComplete }) {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scores, setScores] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(30);
    const [pressureScale, setPressureScale] = useState(1);

    // Randomly select 3 scenarios on mount
    useEffect(() => {
        const shuffled = [...ethicsScenarios].sort(() => 0.5 - Math.random());
        setScenarios(shuffled.slice(0, 3));
    }, []);

    const scenario = scenarios[currentIndex];

    useEffect(() => {
        if (isSubmitting || !scenario) return;
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    handleOption({ score: 10, text: 'TIMEOUT' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [currentIndex, isSubmitting, scenario]);

    const handleOption = (option) => {
        const timeBonus = timer > 20 ? 5 : 0;
        const finalOptionScore = Math.max(0, (option.score || 10) + timeBonus);
        const newScores = [...scores, finalOptionScore];
        setScores(newScores);

        if (option.score > 80) setPressureScale(prev => prev + 0.3);

        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimer(30);
        } else {
            submitAssessment(newScores);
        }
    };

    const submitAssessment = (finalScores) => {
        setIsSubmitting(true);
        const avgEthics = finalScores.reduce((a, b) => a + b, 0) / finalScores.length;
        sessionStorage.setItem('temp_yf', Math.round(avgEthics));
        sessionStorage.setItem('temp_rho_base', pressureScale);

        // Brief loading state for "Syncing" effect
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    if (!scenario) return <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center' }}>Preparing Ethical Simulation...</div>;

    if (isSubmitting) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-secondary)' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 2rem' }} />
                <h1 style={{ letterSpacing: '-1px' }}>SYNCHRONIZING DATA</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Finalizing psychometric profile and performance stability metrics...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ maxWidth: 800, margin: '0 auto', border: pressureScale > 1.8 ? '1px solid var(--accent-red)' : '1px solid var(--glass-border)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Scale className="val-y" size={24} />
                    <div>
                        <h2 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--text-secondary)' }}>ETHICS ASSESSMENT</h2>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>Scenario {currentIndex + 1} of 3</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: timer < 10 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    <Terminal size={16} />
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.5rem' }}>00:{timer < 10 ? `0${timer}` : timer}</span>
                </div>
            </div>

            <div style={{ padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: pressureScale > 2 ? 'var(--accent-red)' : 'var(--accent-purple)', fontSize: '1.3rem', fontWeight: 800 }}>{scenario.title}</h3>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>STABILITY INDEX: x{pressureScale.toFixed(1)}</span>
                </div>

                <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '3rem', fontWeight: 500 }}>
                    {scenario.text}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {scenario.options.map((opt, i) => (
                        <button
                            key={i}
                            className="btn btn-outline"
                            style={{
                                justifyContent: 'space-between',
                                padding: '1.5rem',
                                textAlign: 'left',
                                fontSize: '1rem',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                            onClick={() => handleOption(opt)}
                        >
                            <span style={{ maxWidth: '90%' }}>{opt.text}</span>
                            <ArrowRight size={18} style={{ opacity: 0.5 }} />
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', opacity: pressureScale > 1.5 ? 1 : 0.5 }}>
                <ShieldAlert size={18} color="var(--accent-red)" />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Your responses are being analyzed for ethical consistency and decision stability under professional load.
                </p>
            </div>
        </motion.div>
    );
}
