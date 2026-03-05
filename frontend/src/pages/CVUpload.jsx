import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    FileText,
    CheckCircle,
    RefreshCcw,
    Zap,
    Terminal,
    FileSearch,
    ArrowRight,
    FileUp,
    CheckCircle2
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
            setReport(null);
        }
    };

    const startAnalysis = () => {
        setAnalyzing(true);
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
            }
        };

        setTimeout(() => {
            const fileName = file.name.toLowerCase();
            let selectedProfile = profiles.technical;
            if (fileName.includes('manager') || fileName.includes('lead')) {
                selectedProfile = profiles.management;
            }
            setReport({
                name: file.name.split('.')[0].toUpperCase(),
                ...selectedProfile
            });
            setAnalyzing(false);
        }, 3000);
    };

    return (
        <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3b82f6' }}>
                        <FileSearch size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--saas-text-heading)' }}>Intelligence Uplink</h1>
                </div>
                <p style={{ color: 'var(--saas-text-helper)', fontSize: '1rem' }}>
                    Upload professional resumes for automated skill extraction and cognitive profiling.
                </p>
            </header>

            <AnimatePresence mode="wait">
                {!report ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="saas-card"
                        style={{
                            padding: '5rem 2rem',
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            background: 'var(--bg-subtle)'
                        }}
                    >
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                border: '1px solid var(--saas-border-card)',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                <UploadCloud size={32} color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--saas-text-heading)', marginBottom: '0.75rem' }}>Select Document</h3>
                            <p style={{ color: 'var(--saas-text-helper)', fontSize: '0.875rem' }}>PDF, DOCX, or TXT formats accepted.</p>
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
                                        padding: '0.75rem 1.5rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '8px',
                                        border: '1px solid #10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}>
                                        <FileText size={18} color="#10b981" />
                                        <span style={{ fontWeight: 600, color: 'var(--accent-green)', fontSize: '0.875rem' }}>{file.name}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="saas-btn-outline"
                                        onClick={() => document.getElementById('cv-input').click()}
                                    >
                                        CHOOSE FILE
                                    </button>
                                    {file && (
                                        <button
                                            className="saas-btn-primary"
                                            onClick={startAnalysis}
                                        >
                                            INITIALIZE ANALYSIS <Zap size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '2rem 0' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
                                >
                                    <RefreshCcw size={48} color="#3b82f6" />
                                </motion.div>
                                <div style={{ fontWeight: 700, color: '#3b82f6', letterSpacing: '0.05em' }}>
                                    PARSING RECURSIVE DATA STRUCTURES...
                                </div>
                                <div style={{
                                    width: '240px',
                                    height: '6px',
                                    background: 'var(--saas-border-card)',
                                    margin: '2rem auto',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        style={{ width: '100%', height: '100%', background: '#3b82f6' }}
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
                        className="saas-card"
                        style={{ padding: '0', overflow: 'hidden' }}
                    >
                        <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem 3rem', borderBottom: '1px solid var(--saas-border-card)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saas-text-helper)', textTransform: 'uppercase' }}>Extraction Report</span>
                                        <CheckCircle2 size={14} color="#10b981" />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--saas-text-heading)' }}>{report.name}</h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: 'var(--saas-text-helper)', fontSize: '0.75rem', fontWeight: 700 }}>MATCH CONFIDENCE</p>
                                    <h1 style={{ color: '#3b82f6', fontSize: '2.5rem', fontWeight: 900 }}>{report.confidenceScore}%</h1>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '3rem' }}>
                            <div className="saas-grid saas-grid-2" style={{ marginBottom: '3rem' }}>
                                <div>
                                    <h4 className="saas-label" style={{ borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Extracted Skills</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {report.skills.map((s, i) => (
                                            <div key={i} style={{
                                                padding: '0.5rem 0.875rem',
                                                background: 'var(--bg-subtle)',
                                                borderRadius: '6px',
                                                fontSize: '0.8125rem',
                                                border: '1px solid var(--saas-border-card)',
                                                color: 'var(--saas-text-body)',
                                                fontWeight: 600
                                            }}>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="saas-label" style={{ borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Academic Context</h4>
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--bg-subtle)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--saas-border-card)',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6
                                    }}>
                                        {report.education}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '3rem' }}>
                                <h4 className="saas-label" style={{ borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Professional Trajectory</h4>
                                <p style={{ fontSize: '1rem', color: 'var(--saas-text-body)', lineHeight: 1.6 }}>{report.experience}</p>
                            </div>

                            <div style={{
                                padding: '1.5rem 2rem',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #3b82f6',
                                marginBottom: '4rem'
                            }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>AI Summary Synthesis</h4>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--saas-text-body)', lineHeight: 1.6 }}>{report.summary}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="saas-btn-outline" onClick={() => { setReport(null); setFile(null); }}>
                                    <RefreshCcw size={18} /> NEW UPLOAD
                                </button>
                                <button className="saas-btn-primary" onClick={() => navigate('/')}>
                                    RETURN TO DASHBOARD <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Banner for simulated results */}
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--saas-border-card)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--saas-text-helper)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Terminal size={14} /> DEMONSTRATION MODE: DATA SYNTHESIS IS CURRENTLY SIMULATED
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
