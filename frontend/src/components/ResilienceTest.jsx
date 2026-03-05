import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, AlertCircle, Terminal, Activity } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResilienceTest({ candidateName, onComplete }) {
    const [targets, setTargets] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [clicks, setClicks] = useState(0);
    const [hits, setHits] = useState(0);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (timeLeft <= 0 && isActive) {
            setIsActive(false);
            finishTest();
        }
    }, [timeLeft, isActive]);

    const spawnTarget = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const newTarget = {
            id,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            size: Math.random() * 30 + 30,
            createdAt: Date.now()
        };
        setTargets(prev => [...prev.slice(-3), newTarget]);
    };

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(spawnTarget, 800 - (hits * 10)); // Speed up as they hit
        return () => clearInterval(interval);
    }, [isActive, hits]);

    const handleHit = (id) => {
        setHits(prev => prev + 1);
        setTargets(prev => prev.filter(t => t.id !== id));
        setScore(prev => prev + 10);
    };

    const handleMiss = () => {
        setClicks(prev => prev + 1);
        setScore(prev => Math.max(0, prev - 5));
    };

    const startTest = () => {
        setIsActive(true);
        setScore(0);
        setHits(0);
        setClicks(0);
        setTimeLeft(30);
    };

    const finishTest = async () => {
        setIsFinished(true);
        const accuracy = clicks + hits > 0 ? (hits / (clicks + hits)) * 100 : 0;
        const zScore = Math.min(100, Math.round((hits * 10) + (accuracy / 2)));

        // Ensure local persistence for immediate report display
        sessionStorage.setItem('temp_zf', zScore);

        const xScore = parseInt(sessionStorage.getItem('temp_xf') || '50');
        const yScore = parseInt(sessionStorage.getItem('temp_yf') || '50');
        const rhoBase = parseFloat(sessionStorage.getItem('temp_rho_base') || '1');

        const payload = {
            name: candidateName,
            fluidIntBaseline: xScore,
            ethicalBaseline: yScore,
            stressTelemetry: zScore,
            noWinScore: Math.max(0, yScore - 10), // Simulated
            fluidIntStressed: Math.max(0, xScore - 5), // Simulated
            ethicalStressed: Math.max(0, yScore - 5), // Simulated
            evaluatorNotes: `Full assessment sequence completed. Resilience Accuracy: ${accuracy.toFixed(1)}%. Stability: ${rhoBase.toFixed(2)}.`,
            stage: 'Evaluated'
        };

        try {
            const targetId = sessionStorage.getItem('current_candidate_id');
            const url = targetId ? `http://localhost:5001/api/candidates/${targetId}/ingest` : 'http://localhost:5001/api/candidates/ingest';
            await axios.post(url, payload);
        } catch (err) {
            console.error("Final sync failed:", err);
        }

        setTimeout(onComplete, 2000);
    };

    if (isFinished) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <Activity size={64} className="glow-effect" style={{ marginBottom: '2rem', color: 'var(--accent-red)' }} />
                <h1 style={{ letterSpacing: '-1px' }}>RESILIENCE PROFILE CAPTURED</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Processing reactive telemetry and stability metrics...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ maxWidth: 900, margin: '0 auto', minHeight: '600px', position: 'relative', overflow: 'hidden' }}
            onClick={(e) => { if (isActive && e.target === e.currentTarget) handleMiss(); }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Zap className="val-z" size={24} />
                    <div>
                        <h2 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--text-secondary)' }}>RESILIENCE & SPEED</h2>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>Reactive Stability Test</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'baseline' }}>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>HITS</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-green)' }}>{hits}</span>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>TIME LEFT</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace' }}>{timeLeft}s</span>
                    </div>
                </div>
            </div>

            {!isActive && !isFinished && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10, width: '80%' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Ready for Stress Test?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Click the targets as fast as possible. Misses will penalize your stability index.
                        This measures your ability to maintain performance under increasing pressure.
                    </p>
                    <button className="btn btn-primary" onClick={startTest} style={{ padding: '1rem 3rem' }}>
                        INITIALIZE TEST <ChevronRight size={20} />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {isActive && targets.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={(e) => { e.stopPropagation(); handleHit(t.id); }}
                        style={{
                            position: 'absolute',
                            left: `${t.x}%`,
                            top: `${t.y}%`,
                            width: t.size,
                            height: t.size,
                            borderRadius: '50%',
                            background: 'var(--accent-red)',
                            boxShadow: '0 0 20px var(--accent-red)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Target size={t.size * 0.6} color="white" />
                    </motion.div>
                ))}
            </AnimatePresence>

            {isActive && (
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <AlertCircle size={14} color="var(--accent-red)" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HIGH PRESSURE NODE ACTIVE</span>
                </div>
            )}
        </motion.div>
    );
}

function ChevronRight({ size }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
}
