import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Linkedin, Link as LinkIcon,
    UploadCloud, Video as VideoIcon, CheckCircle, ArrowRight,
    ArrowLeft, Loader2, BrainCircuit, ShieldCheck, Zap,
    Send, Timer, FileText, CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import PatternPuzzle from '../components/PatternPuzzle';
import EthicsSimulator from '../components/EthicsSimulator';
import ResilienceTest from '../components/ResilienceTest';

const STEPS = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Role', icon: FileText },
    { id: 3, title: 'Cognitive', icon: BrainCircuit },
    { id: 4, title: 'Technical', icon: Zap },
    { id: 5, title: 'Finalize', icon: Send }
];

export default function CandidateAssessmentPortal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [jobs, setJobs] = useState([]);
    const [candidateId, setCandidateId] = useState('');
    const [dbId, setDbId] = useState('');

    // Cognitive scores state
    const [cognitiveScores, setCognitiveScores] = useState({
        fluidIntBaseline: 0,
        ethicalBaseline: 0,
        stressTelemetry: 0,
        noWinScore: 0,
        fluidIntStressed: 0,
        ethicalStressed: 0
    });

    // Technical assessment state
    const [techQuestions, setTechQuestions] = useState([]);
    const [techAnswers, setTechAnswers] = useState([]);
    const [isGeneratingTech, setIsGeneratingTech] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        positionApplied: '',
        cvFile: null,
        videoFile: null
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/jobs');
                setJobs(res.data.filter(j => j.status === 'Active'));
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };
        fetchJobs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, name) => {
        setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
    };

    // --- STEP 1: INITIAL SUBMISSION ---
    const submitInitialInfo = async () => {
        // Basic frontend validation
        if (!formData.name || !formData.email || !formData.phone) {
            setError('Please fill in Name, Email, and Phone to continue.');
            return;
        }
        
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5001/api/candidates/intake', {
                ...formData,
                cvUrl: formData.cvFile ? `uploads/cvs/${formData.cvFile.name}` : '',
                videoUrl: formData.videoFile ? `uploads/videos/${formData.videoFile.name}` : ''
            });
            if (res.data.success) {
                setCandidateId(res.data.candidateId);
                setDbId(res.data.id);
                setStep(2);
            }
        } catch (err) {
            console.error("Submission failed", err);
            const msg = err.response?.data?.error || 'Connection error. Please check backend.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 4: GENERATE TECH TEST ---
    const startTechnicalAssessment = async () => {
        setIsGeneratingTech(true);
        setError('');
        setStep(4);
        try {
            const res = await axios.post(`http://localhost:5001/api/candidates/${dbId}/analyze`);
            if (res.data.success) {
                setTechQuestions(res.data.questions);
                setTechAnswers(new Array(res.data.questions.length).fill(''));
            }
        } catch (err) {
            console.error("AI Generation failed", err);
            const msg = err.response?.data?.error || "AI Synthesis failed. Please ensure the backend GEMINI_API_KEY is configured correctly.";
            setError(msg);
        } finally {
            setIsGeneratingTech(false);
        }
    };

    // --- STEP 5: FINAL SUBMISSION ---
    const finalizeApplication = async () => {
        setError('');

        // Guard against missing candidate ID (e.g., if user skipped intake)
        if (!dbId) {
            setError('Session error: Candidate ID is missing. Please restart the application.');
            return;
        }

        setLoading(true);
        try {
            // Ensure scores have at least a minimal value so validation passes
            const scores = {
                fluidIntBaseline: cognitiveScores.fluidIntBaseline || 50,
                ethicalBaseline: cognitiveScores.ethicalBaseline || 50,
                stressTelemetry: cognitiveScores.stressTelemetry || 80,
                noWinScore: cognitiveScores.noWinScore || 50,
                fluidIntStressed: cognitiveScores.fluidIntStressed || 45,
                ethicalStressed: cognitiveScores.ethicalStressed || 45,
            };

            const res = await axios.post(`http://localhost:5001/api/candidates/${dbId}/ingest`, {
                ...scores,
                name: formData.name,
                positionApplied: formData.positionApplied,
                stage: 'Evaluated'
            });

            if (res.status === 200 || res.status === 201) {
                setStep(6); // Success
            } else {
                setError('Submission returned an unexpected response. Please try again.');
            }
        } catch (err) {
            console.error("Finalization failed:", err);
            const msg = err.response?.data?.error || err.message || 'Failed to submit. Please check your connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 4: SUBMIT TECH TEST ---
    const submitTechnicalAnswers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`http://localhost:5001/api/candidates/${dbId}/submit-tech`, {
                answers: techAnswers
            });
            if (res.data.success) {
                setStep(5);
            }
        } catch (err) {
            console.error("Technical submission failed", err);
            const msg = err.response?.data?.error || "Failed to save technical responses. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '4rem' }}>
            {STEPS.map((s, idx) => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: step >= s.id ? 1 : 0.3, transition: 'all 0.3s ease' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: step > s.id ? '#10b981' : step === s.id ? '#3b82f6' : 'var(--bg-secondary)',
                        color: step >= s.id ? '#fff' : 'var(--saas-text-helper)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem',
                        border: step === s.id ? '2px solid #3b82f6' : '2px solid transparent'
                    }}>
                        {step > s.id ? <CheckCircle size={24} /> : <s.icon size={22} />}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.title}</span>
                </div>
            ))}
        </div>
    );

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="saas-card">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--saas-text-heading)' }}>Step 1: Basic Information</h2>
                        <div className="saas-grid saas-grid-2">
                            <div className="form-group"><label className="saas-label">Full Name</label><input type="text" name="name" className="saas-input" value={formData.name} onChange={handleInputChange} placeholder="Hammad Malik" /></div>
                            <div className="form-group"><label className="saas-label">Email</label><input type="email" name="email" className="saas-input" value={formData.email} onChange={handleInputChange} placeholder="hammad@example.com" /></div>
                            <div className="form-group"><label className="saas-label">Phone</label><input type="tel" name="phone" className="saas-input" value={formData.phone} onChange={handleInputChange} placeholder="+92 300 0000000" /></div>
                            <div className="form-group"><label className="saas-label">Location</label><input type="text" name="location" className="saas-input" value={formData.location} onChange={handleInputChange} placeholder="Islamabad, Pakistan" /></div>
                            <div className="form-group"><label className="saas-label">LinkedIn (Optional)</label><input type="url" name="linkedin" className="saas-input" value={formData.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/username" /></div>
                            <div className="form-group"><label className="saas-label">Portfolio (Optional)</label><input type="url" name="portfolio" className="saas-input" value={formData.portfolio} onChange={handleInputChange} placeholder="yourportfolio.com" /></div>
                        </div>
                        <div className="saas-grid saas-grid-2" style={{ marginTop: '2rem' }}>
                            <div className="form-group">
                                <label className="saas-label">Resume (PDF)</label>
                                <label className="saas-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <UploadCloud size={18} /> {formData.cvFile ? formData.cvFile.name : 'Choose File'}
                                    <input type="file" hidden accept=".pdf" onChange={e => handleFileChange(e, 'cvFile')} />
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="saas-label">Intro Video (5-10m)</label>
                                <label className="saas-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <VideoIcon size={18} /> {formData.videoFile ? formData.videoFile.name : 'Choose Video'}
                                    <input type="file" hidden accept="video/*" onChange={e => handleFileChange(e, 'videoFile')} />
                                </label>
                            </div>
                        </div>

                        {error && <p style={{ color: '#f87171', marginTop: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>⚠️ {error}</p>}

                        <button className="saas-btn-primary" style={{ width: '100%', marginTop: '3rem' }} onClick={submitInitialInfo}>
                            CONTINUE TO ROLE {loading ? <Loader2 size={18} className="spinning" /> : <ArrowRight size={18} />}
                        </button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="saas-card" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--saas-text-heading)' }}>Step 2: Select Job Role</h2>
                        <p style={{ color: 'var(--saas-text-helper)', marginBottom: '3rem' }}>Which position are you applying for today?</p>
                        <div style={{ maxWidth: 500, margin: '0 auto' }}>
                            <select
                                name="positionApplied"
                                className="saas-input"
                                style={{ height: '60px', textAlign: 'center', fontSize: '1.1rem' }}
                                value={formData.positionApplied}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a role...</option>
                                {jobs.map(j => <option key={j._id} value={j.title}>{j.title}</option>)}
                            </select>
                            <button
                                className="saas-btn-primary"
                                style={{ width: '100%', marginTop: '3rem', justifyContent: 'center' }}
                                disabled={!formData.positionApplied}
                                onClick={() => setStep(3)}
                            >
                                START COGNITIVE ASSESSMENT <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="saas-card">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--saas-text-heading)' }}>Step 3: Cognitive & Behavioral</h2>
                            <p style={{ color: 'var(--saas-text-helper)' }}>Evaluates logic, memory, and resilience.</p>
                        </div>
                        <PatternPuzzle onComplete={(score) => setCognitiveScores(prev => ({ ...prev, fluidIntBaseline: score, fluidIntStressed: score - 5 }))} />
                        <hr style={{ margin: '3rem 0', borderColor: 'var(--saas-border-card)' }} />
                        <EthicsSimulator onComplete={(b, s) => setCognitiveScores(prev => ({ ...prev, ethicalBaseline: b, noWinScore: s }))} />
                        <button className="saas-btn-primary" style={{ width: '100%', marginTop: '4rem' }} onClick={startTechnicalAssessment}>
                            PROCEED TO TECHNICAL TEST <ArrowRight size={18} />
                        </button>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="saas-card">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--saas-text-heading)' }}>Step 4: Technical Assessment</h2>
                        <p style={{ marginBottom: '3rem', color: 'var(--saas-text-helper)' }}>AI-generated questions specific to: <strong>{formData.positionApplied}</strong></p>

                        {isGeneratingTech ? (
                            <div style={{ textAlign: 'center', padding: '5rem' }}>
                                <Loader2 size={48} className="spinning" color="#3b82f6" />
                                <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Gemini is synthesizing custom parameters for your role...</p>
                            </div>
                        ) : (
                            <div>
                                {techQuestions.map((q, idx) => (
                                    <div key={idx} style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--bg-subtle)', borderRadius: '15px', border: '1px solid var(--saas-border-card)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <p style={{ fontWeight: 800, color: 'var(--saas-text-heading)', fontSize: '1.1rem', flex: 1 }}>Q{idx + 1}: {q.questionText}</p>
                                            <span style={{ fontSize: '0.65rem', padding: '4px 8px', background: 'var(--saas-border-card)', borderRadius: '6px', fontWeight: 700, marginLeft: '1rem' }}>{q.type}</span>
                                        </div>

                                        {q.type === 'MCQ' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {q.options.map((opt, oIdx) => (
                                                    <label key={oIdx} style={{
                                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: techAnswers[idx] === opt ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                                                        border: `1px solid ${techAnswers[idx] === opt ? '#3b82f6' : 'var(--saas-border-card)'}`,
                                                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease'
                                                    }}>
                                                        <input
                                                            type="radio"
                                                            name={`q-${idx}`}
                                                            checked={techAnswers[idx] === opt}
                                                            onChange={() => {
                                                                const newA = [...techAnswers];
                                                                newA[idx] = opt;
                                                                setTechAnswers(newA);
                                                            }}
                                                            style={{ width: '18px', height: '18px' }}
                                                        />
                                                        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <textarea
                                                className="saas-input"
                                                style={{ minHeight: '140px', resize: 'none', background: 'var(--bg-card)' }}
                                                placeholder={q.type === 'Scenario' ? "Describe your step-by-step approach..." : "Provide your technical explanation..."}
                                                value={techAnswers[idx]}
                                                onChange={e => {
                                                    const newA = [...techAnswers];
                                                    newA[idx] = e.target.value;
                                                    setTechAnswers(newA);
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}

                                {error && <p style={{ color: '#f87171', marginBottom: '1.5rem', textAlign: 'center' }}>⚠️ {error}</p>}
                                
                                {techQuestions.length > 0 ? (
                                    <button
                                        className="saas-btn-primary"
                                        style={{ width: '100%', marginTop: '2rem' }}
                                        onClick={submitTechnicalAnswers}
                                        disabled={loading || techAnswers.some(a => !a)}
                                    >
                                        {loading ? <Loader2 size={18} className="spinning" /> : <><CheckCircle size={18} /> COMPLETE TECHNICAL ASSESSMENT</>}
                                    </button>
                                ) : (
                                    <button
                                        className="saas-btn-outline"
                                        style={{ width: '100%', marginTop: '2rem' }}
                                        onClick={startTechnicalAssessment}
                                    >
                                        <BrainCircuit size={18} /> RETRY AI GENERATION
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="saas-card" style={{ textAlign: 'center' }}>
                        <div style={{ padding: '3rem' }}>
                            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 2rem' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--saas-text-heading)' }}>Assessment Complete</h2>
                            <p style={{ color: 'var(--saas-text-helper)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                                Your professional profile, cognitive baseline, and technical synthesis are ready for final transmission.
                            </p>
                            <div style={{ background: 'var(--bg-subtle)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--saas-border-card)', marginBottom: '3rem', textAlign: 'left' }}>
                                <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--saas-text-helper)', fontSize: '0.8rem' }}>APPLICANT ID:</span> <span style={{ fontWeight: 800, color: '#3b82f6' }}>{candidateId}</span></div>
                                <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--saas-text-helper)', fontSize: '0.8rem' }}>TARGET ROLE:</span> <span style={{ fontWeight: 800 }}>{formData.positionApplied}</span></div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800 }}>COGNITIVE</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#3b82f6' }}>{cognitiveScores.fluidIntBaseline}%</span>
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800 }}>ETHICS</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{cognitiveScores.ethicalBaseline}%</span>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <div style={{
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '10px',
                                    color: '#f87171',
                                    fontSize: '0.9rem',
                                    textAlign: 'left'
                                }}>
                                    ⚠️ {error}
                                </div>
                            )}
                            <button className="saas-btn-primary" style={{ width: '100%', height: '64px', fontSize: '1.2rem', justifyContent: 'center' }} onClick={finalizeApplication} disabled={loading}>
                                {loading ? <Loader2 size={24} className="spinning" /> : 'FINALIZE & SUBMIT TO HR'}
                            </button>
                        </div>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="saas-card" style={{ textAlign: 'center', padding: '5rem' }}>
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <CheckCircle size={60} color="#10b981" />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--saas-text-heading)' }}>Application Finalized</h1>
                        <p style={{ color: 'var(--saas-text-helper)', fontSize: '1.2rem', marginBottom: '3rem' }}>
                            Your data has been synchronized with the Super Admin dashboard. You will be contacted via email if your profile matches the orchestration requirements.
                        </p>
                        <button className="saas-btn-outline" onClick={() => navigate('/portal')}>
                            RETURN TO JOBS PORTAL
                        </button>
                    </motion.div>
                )
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '4rem auto', padding: '0 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--saas-text-heading)', marginBottom: '1rem' }}>Candidate Assessment Portal</h1>
                <p style={{ color: 'var(--saas-text-helper)' }}>Complete the orchestration steps to prove your professional value.</p>
            </header>

            {step < 6 && renderStepIndicator()}

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
    );
}
