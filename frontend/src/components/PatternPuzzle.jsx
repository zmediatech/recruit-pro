import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, HelpCircle, FastForward, ShieldAlert, Play, Info, AlertCircle } from 'lucide-react';

export default function PatternPuzzle({ candidateName, onComplete }) {
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userInput, setUserInput] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [stage, setStage] = useState('active'); // active, failed
    const [metrics, setMetrics] = useState({
        errors: 0,
        times: []
    });

    const [showInterrupt, setShowInterrupt] = useState(false);
    const [interruptData, setInterruptData] = useState(null);

    // Cognitive Reflection Interrupts
    const interruptPuzzles = [
        { q: "A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?", a: "5", options: ["10", "5", "1", "0.5"] },
        { q: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", a: "5", options: ["100", "50", "5", "1"] },
        { q: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half the lake?", a: "47", options: ["24", "47", "40", "12"] }
    ];

    const generateSequence = useCallback(() => {
        const newSeq = [];
        const length = 2 + Math.floor(level / 2);
        for (let i = 0; i < length; i++) {
            newSeq.push(Math.floor(Math.random() * 9));
        }
        setSequence(newSeq);
        setUserInput([]);
        setIsReady(true);

        // Randomly trigger interrupt at higher levels
        if (level > 3 && Math.random() > 0.6) {
            setInterruptData(interruptPuzzles[Math.floor(Math.random() * interruptPuzzles.length)]);
        } else {
            setInterruptData(null);
        }
    }, [level]);

    useEffect(() => {
        generateSequence();
    }, [level, generateSequence]);

    const startSequence = async () => {
        setIsReady(false);
        setIsPlaying(true);
        setUserInput([]);

        await new Promise(r => setTimeout(r, 800));

        for (const id of sequence) {
            await new Promise(r => setTimeout(r, 600 - Math.min(level * 20, 300)));
            highlightCell(id);
            await new Promise(r => setTimeout(r, 500));
        }

        setIsPlaying(false);
        setStartTime(Date.now());
    };

    const highlightCell = (id) => {
        const el = document.getElementById(`cell-${id}`);
        if (el) {
            el.classList.add('active-cell');
            setTimeout(() => {
                el.classList.remove('active-cell');
            }, 400);
        }
    };

    const handleCellClick = (id) => {
        if (isPlaying || isReady || stage === 'failed' || showInterrupt) return;

        const now = Date.now();
        const latency = now - (userInput.length === 0 ? startTime : metrics.times[metrics.times.length - 1]);

        const newUserInput = [...userInput, id];
        setUserInput(newUserInput);
        highlightCell(id);

        if (id !== sequence[userInput.length]) {
            setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
            setStage('failed');
            return;
        }

        setMetrics(prev => ({ ...prev, times: [...prev.times, now] }));

        if (newUserInput.length === sequence.length) {
            if (interruptData) {
                setTimeout(() => setShowInterrupt(true), 500);
            } else if (level >= 8) {
                finishTest();
            } else {
                setLevel(prev => prev + 1);
            }
        }
    };

    const handleInterruptSolved = (choice) => {
        setShowInterrupt(false);
        setInterruptData(null);
        if (level >= 8) {
            finishTest();
        } else {
            setLevel(prev => prev + 1);
        }
    };

    const finishTest = () => {
        const totalDuration = metrics.times[metrics.times.length - 1] - startTime;
        const avgLatency = metrics.times.length > 0 ? totalDuration / metrics.times.length : 0;
        const score = Math.max(0, 100 - (metrics.errors * 8) - (avgLatency / 150));
        sessionStorage.setItem('temp_xf', Math.round(score));
        onComplete();
    };

    return (
        <div style={{ position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ maxWidth: 600, margin: '0 auto', padding: '3rem', filter: showInterrupt ? 'blur(4px)' : 'none' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1rem', color: 'var(--accent-green)', marginBottom: '0.25rem' }}>PART 1: MEMORY AND PATTERN TEST</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CANDIDATE: {candidateName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'sans-serif' }}>LEVEL {level}<span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/08</span></span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {stage === 'active' ? (
                        <motion.div key="active">
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <Info size={20} color="var(--accent-blue)" />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    {isReady ? "Click 'START' to see the pattern." :
                                        isPlaying ? "Watch the flashes closely." : "Now repeat the sequence."}
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                aspectRatio: '1/1',
                                marginBottom: '2rem'
                            }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div
                                        key={i}
                                        id={`cell-${i}`}
                                        onClick={() => handleCellClick(i)}
                                        className={`grid-cell ${isPlaying ? 'watching' : 'active-input'}`}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            cursor: (isPlaying || isReady) ? 'default' : 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                                    </div>
                                ))}
                            </div>

                            {isReady && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1.2rem' }}
                                    onClick={startSequence}
                                >
                                    START SEQUENCE <Play size={18} />
                                </motion.button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="failed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '4rem 0' }}
                        >
                            <ShieldAlert size={60} color="var(--accent-red)" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>INCORRECT SEQUENCE</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
                                The sequence was incorrect. Please try again to continue the assessment.
                            </p>
                            <button className="btn btn-primary" onClick={() => { setStage('active'); setLevel(1); setMetrics({ errors: 0, times: [] }); }}>RETRY TEST</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2rem', opacity: 0.6 }}>
                    <Brain size={14} />
                    <span>MEASURING MEMORY AND RESPONSE TIME</span>
                </div>
            </motion.div>

            <AnimatePresence>
                {showInterrupt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '450px',
                            background: 'var(--bg-secondary)',
                            padding: '3rem',
                            borderRadius: '24px',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                            border: '1px solid var(--accent-purple)',
                            zIndex: 100,
                            textAlign: 'center'
                        }}
                    >
                        <AlertCircle size={32} color="var(--accent-purple)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '2px', marginBottom: '2rem' }}>COGNITIVE INTERRUPT</h3>
                        <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 600 }}>{interruptData.q}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {interruptData.options.map(opt => (
                                <button
                                    key={opt}
                                    className="btn btn-outline"
                                    style={{ padding: '1rem', fontSize: '1.1rem' }}
                                    onClick={() => handleInterruptSolved(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
