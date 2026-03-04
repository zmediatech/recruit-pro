import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Send, Timer, AlertOctagon, BrainCircuit } from 'lucide-react';
import axios from 'axios';

export default function TechnicalAssessment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { candidate, questions } = location.state || {};

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState(questions ? questions.map(() => '') : []);
    const [timeLeft, setTimeLeft] = useState(questions ? questions.length * 120 : 600); // 2 mins per q
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!candidate || !questions) {
            navigate('/');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Post results to telemetry
            await axios.post(`http://localhost:5001/api/candidates/${candidate._id}/ingest`, {
                coordinates: {
                    X: candidate.coordinates?.X || 70,
                    Y: candidate.coordinates?.Y || 70,
                    Z: 85 // Technical skill boost
                },
                rho: 0.88, // Simulated rho update
                evaluatorNotes: `Completed adaptive technical assessment with ${questions.length} Gemini-generated questions.`
            });
            navigate(`/candidate/${candidate._id}`);
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!questions) return null;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: '4rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                        <BrainCircuit size={18} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Technical Assessment</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Candidate: {candidate.name}</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                    <Timer size={18} color={timeLeft < 60 ? 'var(--accent-red)' : 'var(--text-secondary)'} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: timeLeft < 60 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{formatTime(timeLeft)}</span>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="glass-panel"
                    style={{ padding: '2.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>Section {currentStep + 1} / {questions.length}</span>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.75rem', lineHeight: 1.4 }}>{questions[currentStep].QuestionText}</h2>
                    </div>

                    <textarea
                        className="form-control"
                        style={{ flex: 1, minHeight: '180px', background: 'var(--bg-subtle)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '1.5rem', fontSize: '1rem', lineHeight: 1.6, resize: 'none', marginBottom: '2rem' }}
                        placeholder="Type your explanation or solution here..."
                        value={answers[currentStep]}
                        onChange={e => {
                            const newAnswers = [...answers];
                            newAnswers[currentStep] = e.target.value;
                            setAnswers(newAnswers);
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {questions.map((_, i) => (
                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === currentStep ? 'var(--accent-blue)' : i < currentStep ? 'var(--accent-green)' : 'var(--glass-border)' }} />
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (currentStep < questions.length - 1) {
                                    setCurrentStep(prev => prev + 1);
                                } else {
                                    handleSubmit();
                                }
                            }}
                            disabled={!answers[currentStep] || isSubmitting}
                        >
                            {currentStep === questions.length - 1 ? 'Submit Results' : 'Next Question'} <Send size={16} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: '2.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.6, background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                <CheckCircle size={20} color="var(--accent-green)" />
                <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                    Your responses are being analyzed to provide a comprehensive professional profile. Accuracy and depth of reasoning are highly valued.
                </p>
            </div>
        </div>
    );
}
