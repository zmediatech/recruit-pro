import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Scale, ArrowRight, Save, Terminal } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ROLE_SCENARIOS = {
    technical: [
        {
            id: 'intro',
            title: "SITUATION: CRITICAL SOFTWARE BUG",
            text: "You are the lead developer for a major update. You just found a bug that might expose user data. It's a small risk (2%), but the launch is in 1 hour and your boss says we must go live.",
            options: [
                { text: "Option A: HALT THE LAUNCH (High Cost, High Honesty)", next: 'halt', score: 95 },
                { text: "Option B: LAUNCH AND PATCH LATER (Low Cost, High Risk)", next: 'silent', score: 30 },
                { text: "Option C: ASK THE BOSS TO DECIDE (Avoid Responsibility)", next: 'defer', score: 50 }
            ]
        },
        {
            id: 'halt',
            title: "CONSEQUENCE: THE PRESSURE",
            text: "Your boss is very angry. The company's reputation is at risk. A coworker offers to help you fake a quick 'fix' so the launch can proceed immediately.",
            options: [
                { text: "REFUSE THE FAKE FIX (Integrity)", next: 'finish', score: 100 },
                { text: "ACCEPT THE FAKE FIX (Dishonesty)", next: 'finish', score: 10 }
            ]
        },
        {
            id: 'silent',
            title: "CONSEQUENCE: THE DATA LEAK",
            text: "The risk became a reality. User data was stolen. You can delete the system records to hide your mistake and keep your job.",
            options: [
                { text: "REPORT THE LEAK IMMEDIATELY", next: 'finish', score: 40 },
                { text: "DELETE THE RECORDS (Unethical)", next: 'finish', score: 0 }
            ]
        },
        {
            id: 'defer',
            title: "CONSEQUENCE: THE SIGN-OFF",
            text: "The company orders the launch. You are asked to sign a document saying the software is 100% safe, even though you know it's not.",
            options: [
                { text: "REFUSE TO SIGN", next: 'finish', score: 80 },
                { text: "SIGN THE DOCUMENT", next: 'finish', score: 20 }
            ]
        }
    ],
    management: [
        {
            id: 'intro',
            title: "SITUATION: PROJECT DEADLINE",
            text: "Your team is failing to meet a critical deadline. To stay on track, you are asked to ignore mandatory quality checks. This will save time but might cause major failures later.",
            options: [
                { text: "STOP THE PROJECT (Delay, but Safe)", next: 'halt', score: 90 },
                { text: "SKIP THE CHECKS (Fast, but Risky)", next: 'silent', score: 20 },
                { text: "LET THE TEAM DECIDE (Shift Responsibility)", next: 'defer', score: 40 }
            ]
        },
        {
            id: 'halt',
            title: "CONSEQUENCE: LEADERSHIP CHALLENGE",
            text: "Upper management is questioning your leadership. They offer you a bonus if you can 'guarantee' completion by tomorrow, even if the work is incomplete.",
            options: [
                { text: "REJECT THE BONUS (Honesty)", next: 'finish', score: 100 },
                { text: "ACCEPT THE BONUS (Deceit)", next: 'finish', score: 10 }
            ]
        },
        {
            id: 'silent',
            title: "CONSEQUENCE: SYSTEM FAILURE",
            text: "The skipped checks caused a major outage. You can blame a junior team member to save your own position.",
            options: [
                { text: "TAKE FULL RESPONSIBILITY", next: 'finish', score: 50 },
                { text: "BLAME THE TEAM MEMBER (Unethical)", next: 'finish', score: 0 }
            ]
        },
        {
            id: 'defer',
            title: "CONSEQUENCE: THE AUDIT",
            text: "An internal audit is happening. You are asked to provide a summary that hides the team's struggles and shows everything is perfect.",
            options: [
                { text: "PROVIDE AN HONEST REPORT", next: 'finish', score: 85 },
                { text: "SURE, HIDE THE ISSUES", next: 'finish', score: 15 }
            ]
        }
    ],
    general: [
        {
            id: 'intro',
            title: "SITUATION: WORKPLACE ETHICS",
            text: "You see a coworker taking expensive company equipment home for personal use. They tell you it's 'no big deal' and offer to bring something for you as well.",
            options: [
                { text: "REPORT THE BEHAVIOR (Honest)", next: 'halt', score: 90 },
                { text: "IGNORE IT (Avoid Conflict)", next: 'silent', score: 40 },
                { text: "JOIN THEM (Stealing)", next: 'defer', score: 0 }
            ]
        },
        {
            id: 'halt',
            title: "CONSEQUENCE: SOCIAL PRESSURE",
            text: "The coworker finds out you reported them. They start spreading rumors about you. Your manager asks if you want to retract your statement to 'keep the peace'.",
            options: [
                { text: "STAND BY THE TRUTH", next: 'finish', score: 100 },
                { text: "RETRACT STATEMENT", next: 'finish', score: 30 }
            ]
        },
        {
            id: 'silent',
            title: "CONSEQUENCE: THE INVESTIGATION",
            text: "A company-wide theft investigation begins. You are asked if you knew about any theft. Lying now would protect your coworker but risk your job.",
            options: [
                { text: "TELL THE TRUTH", next: 'finish', score: 60 },
                { text: "LIE TO PROTECT THEM", next: 'finish', score: 10 }
            ]
        },
        {
            id: 'defer',
            title: "CONSEQUENCE: THE COVER-UP",
            text: "Your coworker asks you to help them sneak the items back into the office before the next inspection.",
            options: [
                { text: "REFUSE TO HELP", next: 'finish', score: 80 },
                { text: "HELP THEM HIDE IT", next: 'finish', score: 20 }
            ]
        }
    ]
};

export default function EthicsSimulator({ candidateName, jobTitle, onComplete }) {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState('intro');
    const [scores, setScores] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(30);
    const [pressureScale, setPressureScale] = useState(1);

    // Determine which scenario set to use based on job title
    const getScenarioSet = () => {
        const title = jobTitle?.toLowerCase() || '';
        if (title.includes('dev') || title.includes('eng') || title.includes('tech') || title.includes('code')) {
            return ROLE_SCENARIOS.technical;
        }
        if (title.includes('manag') || title.includes('lead') || title.includes('direct') || title.includes('head')) {
            return ROLE_SCENARIOS.management;
        }
        return ROLE_SCENARIOS.general;
    };

    const scenarios = getScenarioSet();
    const scenario = scenarios.find(s => s.id === currentId);

    useEffect(() => {
        if (isSubmitting) return;
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    handleOption({ score: 10, next: 'finish', text: 'TIMEOUT' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [currentId, isSubmitting]);

    const handleOption = (option) => {
        const timeBonus = timer > 20 ? 5 : 0;
        const finalOptionScore = Math.max(0, option.score + timeBonus);
        const newScores = [...scores, finalOptionScore];
        setScores(newScores);

        if (option.score > 80) setPressureScale(prev => prev + 0.5);

        if (option.next === 'finish') {
            submitAssessment(newScores);
        } else {
            setCurrentId(option.next);
            setTimer(Math.max(10, 30 - (pressureScale * 5)));
        }
    };

    const submitAssessment = async (finalScores) => {
        setIsSubmitting(true);
        const avgEthics = finalScores.reduce((a, b) => a + b, 0) / finalScores.length;
        const xScore = parseInt(sessionStorage.getItem('temp_xf') || '50');
        const zScore = Math.round(80 + (timer / 2) - (pressureScale * 10));

        const payload = {
            name: candidateName,
            fluidIntBaseline: xScore,
            ethicalBaseline: avgEthics,
            stressTelemetry: zScore,
            noWinScore: Math.min(...finalScores),
            fluidIntStressed: Math.max(0, xScore - (pressureScale * 5)),
            ethicalStressed: Math.max(0, avgEthics - (pressureScale * 3)),
            evaluatorNotes: `No-Win Protocol completed. Pressure Scale reached: ${pressureScale.toFixed(2)}.`,
            stage: 'Evaluated'
        };

        try {
            const targetId = sessionStorage.getItem('current_candidate_id');
            const url = targetId ? `http://localhost:5001/api/candidates/${targetId}/ingest` : 'http://localhost:5001/api/candidates/ingest';
            await axios.post(url, payload);
            setTimeout(() => { navigate(targetId ? `/candidate/${targetId}` : '/'); }, 2000);
        } catch (err) {
            console.error(err);
            navigate('/');
        }
    };

    if (isSubmitting) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-secondary)' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 2rem' }} />
                <h1 style={{ letterSpacing: '-1px' }}>SYNCHRONIZING DATA</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Finalizing psychometric profile and pressure telemetry...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ maxWidth: 800, margin: '0 auto', border: pressureScale > 2 ? '1px solid var(--accent-red)' : '1px solid var(--glass-border)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Scale className="val-y" size={24} />
                    <h2 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px' }}>NO-WIN SCENARIO SIMULATION</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: timer < 10 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    <Terminal size={16} />
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.2rem' }}>00:{timer < 10 ? `0${timer}` : timer}</span>
                </div>
            </div>

            <div style={{ padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: pressureScale > 1.5 ? 'var(--accent-red)' : 'var(--accent-purple)', fontSize: '1.1rem', fontWeight: 800 }}>{scenario.title}</h3>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>PRESSURE: x{pressureScale.toFixed(1)}</span>
                </div>

                <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '3.5rem', fontWeight: 500 }}>
                    {scenario.text}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {scenario.options.map((opt, i) => (
                        <button
                            key={i}
                            className="btn btn-outline"
                            style={{
                                justifyContent: 'space-between',
                                padding: '1.75rem',
                                textAlign: 'left',
                                borderColor: i === 0 ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-border)',
                                fontSize: '1rem'
                            }}
                            onClick={() => handleOption(opt)}
                        >
                            <span style={{ maxWidth: '85%' }}>{opt.text}</span>
                            <ArrowRight size={18} style={{ opacity: 0.5 }} />
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', opacity: pressureScale > 1.5 ? 1 : 0.5 }}>
                <ShieldAlert size={18} color="var(--accent-red)" />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Hesitation and decision reversals are being analyzed. Withdrawal from the stream will result in immediate disqualification.
                </p>
            </div>
        </motion.div>
    );
}
