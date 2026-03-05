import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, HelpCircle, FastForward, ShieldAlert, Play, Info, AlertCircle, ChevronRight } from 'lucide-react';
import { intelligencePuzzles } from '../data/assessmentData';

export default function PatternPuzzle({ candidateName, onComplete }) {
    const [puzzles, setPuzzles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scores, setScores] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    // Randomly select 3 puzzles on mount
    useEffect(() => {
        const shuffled = [...intelligencePuzzles].sort(() => 0.5 - Math.random());
        setPuzzles(shuffled.slice(0, 3));
        setStartTime(Date.now());
    }, []);

    const currentPuzzle = puzzles[currentIndex];

    const handleOptionSelect = (optionId) => {
        if (selectedOption) return;
        setSelectedOption(optionId);

        const isCorrect = optionId === currentPuzzle.correctId;
        const timeTaken = Date.now() - startTime;

        // Scoring: 30 points for correct answer, 0 for wrong, bonus for speed
        let score = isCorrect ? 30 : 0;
        if (isCorrect && timeTaken < 15000) score += 3; // speed bonus

        setScores(prev => [...prev, score]);

        setTimeout(() => {
            if (currentIndex < puzzles.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setStartTime(Date.now());
            } else {
                finishAssessment([...scores, score]);
            }
        }, 800);
    };

    const finishAssessment = (finalScores) => {
        const totalScore = finalScores.reduce((a, b) => a + b, 0);
        const normalizedScore = Math.min(100, (totalScore / 90) * 100);
        sessionStorage.setItem('temp_xf', Math.round(normalizedScore));
        setIsFinished(true);
        setTimeout(onComplete, 1500);
    };

    if (!currentPuzzle) return <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>Initializing Intelligence Matrix...</div>;

    if (isFinished) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <CheckCircle size={60} color="var(--accent-green)" style={{ marginBottom: '1.5rem' }} />
                <h2>Intelligence Assessment Complete</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Synchronizing cognitive parameters...</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ maxWidth: 800, margin: '0 auto', padding: '3rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Intelligence Matrix</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>Puzzle {currentIndex + 1}<span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}> of 3</span></p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
                    {/* 3x3 Matrix Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        {currentPuzzle.grid.map((cell, i) => (
                            <div key={i} style={{
                                aspectRatio: '1/1',
                                background: cell ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {cell ? (
                                    <MatrixElement type={cell[0]} color={cell[1]} rotate={cell[2]} />
                                ) : (
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-blue)', opacity: 0.5 }}>?</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Choose the correct element:</p>
                        {currentPuzzle.options.map((opt) => (
                            <button
                                key={opt.id}
                                className={`btn btn-outline ${selectedOption === opt.id ? (opt.id === currentPuzzle.correctId ? 'success' : 'error') : ''}`}
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: '80px',
                                    borderWidth: '2px'
                                }}
                                onClick={() => handleOptionSelect(opt.id)}
                                disabled={!!selectedOption}
                            >
                                <div style={{ transform: 'scale(0.6)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MatrixElement type={opt.val[0]} color={opt.val[1]} rotate={opt.val[2]} />
                                </div>
                                <span style={{ fontWeight: 800 }}>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Brain size={18} color="var(--accent-blue)" />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                        This matrix evaluates pattern perception and logical deduction. No language or specialized knowledge is required.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function MatrixElement({ type, color, rotate }) {
    const style = {
        width: '70%',
        height: '70%',
        background: color.toLowerCase(),
        opacity: 0.8,
        transform: `rotate(${rotate}deg)`,
        transition: 'all 0.3s ease'
    };

    if (type === 'Circle') return <div style={{ ...style, borderRadius: '50%' }} />;
    if (type === 'Square') return <div style={{ ...style }} />;
    if (type === 'Triangle') return (
        <div style={{
            width: 0, height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: `35px solid ${color.toLowerCase()}`,
            transform: `rotate(${rotate}deg)`
        }} />
    );
    if (type === 'Diamond') return (
        <div style={{ ...style, transform: `rotate(${rotate + 45}deg) scale(0.8)` }} />
    );
    if (type === 'Hexagon') return (
        <div style={{
            ...style,
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            borderRadius: 0,
            transform: `rotate(${rotate}deg)`
        }} />
    );
    if (type.startsWith('Dot-')) {
        const count = parseInt(type.split('-')[1]);
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-primary)' }} />
                ))}
            </div>
        );
    }

    return <div style={{ ...style, borderRadius: '4px', transform: `rotate(${rotate}deg) skew(10deg)` }} />;
}

function CheckCircle({ size, color, style }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
