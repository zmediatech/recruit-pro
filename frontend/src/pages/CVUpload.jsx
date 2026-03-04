import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    FileText,
    CheckCircle,
    RefreshCcw,
    ShieldCheck,
    Zap,
    Terminal,
    FileSearch,
    ArrowRight
} from 'lucide-react';

export default function CVUpload() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [report, setReport] = useState(null);

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setReport(null); // Clear previous analysis results
        }
    };

    const startAnalysis = () => {
        setAnalyzing(true);

        // Simulation Profiles Pool
        const profiles = {
            technical: {
                confidenceScore: 94,
                skills: ["Full-Stack Architecture", "Cloud Infrastructure", "System Design", "Database Optimization", "Cybersecurity"],
                experience: "Over 8 years of experience building scalable distributed systems and leading engineering teams.",
                education: "M.S. in Computer Science",
                summary: "Senior technical candidate with exceptional system design and leadership capabilities."
            },
            management: {
                confidenceScore: 89,
                skills: ["Project Management", "Stakeholder Communication", "Budget Planning", "Agile Methodology", "Resource Allocation"],
                experience: "Strategic leader with a proven track record of managing multi-million dollar software projects.",
                education: "MBA / B.S. in Information Systems",
                summary: "Highly organized manager with strong communication skills and business acumen."
            },
            sales: {
                confidenceScore: 85,
                skills: ["Account Management", "B2B Sales", "Client Relations", "Market Analysis", "Public Speaking"],
                experience: "Top-performing sales executive with experience in international markets and high-ticket closing.",
                education: "B.A. in Marketing / Business Administration",
                summary: "Aggressive sales professional with a focus on client satisfaction and revenue growth."
            },
            junior: {
                confidenceScore: 91,
                skills: ["JavaScript", "HTML/CSS", "React Basics", "Git Version Control", "Python Fundamentals"],
                experience: "Recent graduate with strong internship experience and high potential for rapid technical growth.",
                education: "B.S. in Computer Science (New Graduate)",
                summary: "Eager and talented junior developer with a solid foundation in modern web technologies."
            }
        };

        // Keyword Detection Logic
        setTimeout(() => {
            const fileName = file.name.toLowerCase();
            let selectedProfile = profiles.technical; // Default

            if (fileName.includes('manager') || fileName.includes('lead') || fileName.includes('management')) {
                selectedProfile = profiles.management;
            } else if (fileName.includes('sales') || fileName.includes('market') || fileName.includes('business')) {
                selectedProfile = profiles.sales;
            } else if (fileName.includes('junior') || fileName.includes('jr') || fileName.includes('intern')) {
                selectedProfile = profiles.junior;
            }

            setReport({
                name: file.name.split('.')[0].toUpperCase(),
                ...selectedProfile
            });
            setAnalyzing(false);
        }, 3000);
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>RESUME ANALYSIS</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Extracting professional skills and experience from the document.</p>
            </header>

            <AnimatePresence mode="wait">
                {!report ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="glass-panel"
                        style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            border: '2px dashed var(--glass-border)',
                            background: 'var(--bg-subtle)'
                        }}
                    >
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                border: '1px solid var(--accent-blue)'
                            }}>
                                <UploadCloud size={40} color="var(--accent-blue)" />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>UPLOAD CANDIDATE RESUME</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Accepts .PDF, .DOCX, or .TXT formats.</p>
                        </div>

                        <input
                            type="file"
                            id="cv-input"
                            hidden
                            onChange={handleFile}
                            accept=".pdf,.docx,.txt"
                        />

                        {!analyzing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                {file && (
                                    <div style={{
                                        padding: '1rem 2rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--accent-green)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <FileText size={20} color="var(--accent-green)" />
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{file.name}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => document.getElementById('cv-input').click()}
                                    >
                                        SELECT FILE
                                    </button>
                                    {file && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={startAnalysis}
                                        >
                                            INITIALIZE SCAN <Zap size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '2rem 0' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ marginBottom: '2rem' }}
                                >
                                    <RefreshCcw size={40} color="var(--accent-blue)" />
                                </motion.div>
                                <div style={{ fontFamily: 'sans-serif', color: 'var(--accent-blue)', letterSpacing: '1px' }}>
                                    ANALYZING RESUME DATA...
                                </div>
                                <div style={{
                                    width: '200px',
                                    height: '4px',
                                    background: 'var(--border-subtle)',
                                    margin: '1.5rem auto',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        style={{ width: '100%', height: '100%', background: 'var(--accent-blue)' }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="report"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel"
                    >
                        {/* Demo Mode Banner */}
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid var(--accent-blue)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}>
                            <Terminal size={18} color="var(--accent-blue)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 800, letterSpacing: '1px' }}>
                                VISUAL DEMONSTRATION: RESULTS ARE CURRENTLY SIMULATED
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>ANALYSIS RESULTS: {report.name}</h2>
                                <div className="status-badge status-valid">PROFILE VERIFIED</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>CONFIDENCE SCORE</p>
                                <h1 style={{ color: 'var(--accent-green)', letterSpacing: '3px' }}>{report.confidenceScore}%</h1>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>KEY SKILLS</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {report.skills.map((s, i) => (
                                        <div key={i} style={{
                                            padding: '0.6rem 1rem',
                                            background: 'var(--bg-subtle)',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            border: '1px solid var(--glass-border)'
                                        }}>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>EDUCATIONAL DETAILS</h4>
                                <div style={{
                                    padding: '1rem',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    {report.education}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>PROFESSIONAL EXPERIENCE</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{report.experience}</p>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(59, 130, 246, 0.05)',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--accent-blue)',
                            marginBottom: '2rem'
                        }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>SUMMARY EVALUATION</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{report.summary}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => { setReport(null); setFile(null); }}>
                                <RefreshCcw size={18} /> SCAN NEW RESUME
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                VIEW DASHBOARD <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Simulation Disclaimer */}
                        <div style={{
                            marginTop: '2.5rem',
                            padding: '1rem',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            background: 'var(--bg-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: 0.6
                        }}>
                            <Terminal size={14} color="var(--accent-blue)" />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                                DEMO MODE: Analysis logic is currently simulated for user interface demonstration.
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
