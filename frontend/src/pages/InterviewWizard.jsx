import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    ChevronLeft,
    ShieldAlert,
    Terminal,
    Zap,
    Scale,
    Activity,
    ClipboardCheck,
    CheckCircle2
} from 'lucide-react';

export default function InterviewWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        fluidIntBaseline: 50,
        ethicalBaseline: 50,
        stressTelemetry: 50,
        noWinScore: 50,
        fluidIntStressed: 50,
        ethicalStressed: 50,
        evaluatorNotes: '',
        scenarioSelection: 'Zero-Day Deployment',
        stage: 'Assessment Completed'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'name' || name === 'evaluatorNotes' || name === 'scenarioSelection' || name === 'stage') ? value : Number(value)
        }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/candidates/ingest', formData);
            navigate('/');
        } catch (err) {
            console.error("Backend failed", err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const STEPS = [
        { id: 1, label: 'Cognitive' },
        { id: 2, label: 'Ethics' },
        { id: 3, label: 'Resilience' },
        { id: 4, label: 'Summary' }
    ];

    return (
        <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '10px', color: '#10b981' }}>
                        <ClipboardCheck size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>Structural Interview Evaluation</h1>
                </div>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                    Standardized manual assessment flow for direct candidate observation and behavioral metrics.
                </p>
            </header>

            <div className="saas-card" style={{ padding: '0' }}>
                <div style={{ padding: '2rem 3rem', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', borderRadius: '12px 12px 0 0' }}>
                    <div className="step-container" style={{ marginBottom: '0' }}>
                        {STEPS.map((s) => (
                            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                                <div className="step-circle" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                    {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                                </div>
                                <span className="step-label" style={{ fontSize: '0.65rem' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '3.5rem 3rem' }}>
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                <Activity size={20} color="#3b82f6" />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Phase 1: Intelligence & Reasoning</h3>
                            </div>

                            <div className="form-group">
                                <label className="saas-label">Subject Identifier / Name</label>
                                <input type="text" name="name" className="saas-input" value={formData.name} onChange={handleChange} placeholder="e.g. Hammad Malik" />
                                <p className="saas-helper">Enter the candidate's full name or system reference ID.</p>
                            </div>

                            <div className="saas-grid saas-grid-2" style={{ marginTop: '2.5rem' }}>
                                <div className="form-group">
                                    <label className="saas-label">Pattern Recognition Score (0-100)</label>
                                    <input type="number" name="fluidIntBaseline" className="saas-input" value={formData.fluidIntBaseline} onChange={handleChange} />
                                    <p className="saas-helper">Observed logical deduction capability.</p>
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">Systems Thinking Score (0-100)</label>
                                    <input type="number" name="ethicalBaseline" className="saas-input" value={formData.ethicalBaseline} onChange={handleChange} />
                                    <p className="saas-helper">Ability to map complex dependencies.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                <Scale size={20} color="#8b5cf6" />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Phase 2: Ethical Integrity Assessment</h3>
                            </div>

                            <div className="form-group">
                                <label className="saas-label">Administered Scenario Profile</label>
                                <select name="scenarioSelection" className="saas-input" value={formData.scenarioSelection} onChange={handleChange}>
                                    <option value="Zero-Day Deployment">Scenario 1: Zero-Day Deployment</option>
                                    <option value="The Whistleblower's Catch-22">Scenario 2: The Whistleblower's Catch-22</option>
                                    <option value="The Attrition Equation">Scenario 3: The Attrition Equation</option>
                                </select>
                            </div>

                            <div style={{ padding: '1.5rem', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <ShieldAlert size={16} color="#7c3aed" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>Evaluatory Directive</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#5b21b6', lineHeight: 1.6 }}>
                                    Assess consequence ownership. Observe if the subject accepts professional accountability or attempts to redirect blame during the dilemma phase.
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="saas-label" style={{ color: '#ef4444' }}>Adaptive Ethics Score (0-100)</label>
                                <input type="number" name="noWinScore" className="saas-input" value={formData.noWinScore} onChange={handleChange} />
                                <p className="saas-helper">Moral anchoring under philosophical load.</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                <Zap size={20} color="#f59e0b" />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Phase 3: Stress Resilience Evaluation</h3>
                            </div>

                            <div className="form-group">
                                <label className="saas-label">Physiological Stability / Affect (0-100)</label>
                                <input type="number" name="stressTelemetry" className="saas-input" value={formData.stressTelemetry} onChange={handleChange} />
                                <p className="saas-helper">Observed composure under direct interrogation.</p>
                            </div>

                            <div className="saas-grid saas-grid-2" style={{ marginTop: '2rem' }}>
                                <div className="form-group">
                                    <label className="saas-label">Stressed Reasoning ($G_f$ Decay)</label>
                                    <input type="number" name="fluidIntStressed" className="saas-input" value={formData.fluidIntStressed} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="saas-label">Stressed Integrity (Y Decay)</label>
                                    <input type="number" name="ethicalStressed" className="saas-input" value={formData.ethicalStressed} onChange={handleChange} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                <Terminal size={20} color="#10b981" />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Phase 4: Final Recommendation</h3>
                            </div>

                            <div className="form-group">
                                <label className="saas-label">Evaluator Rationale & Debrief</label>
                                <textarea
                                    name="evaluatorNotes"
                                    className="saas-input"
                                    rows={8}
                                    value={formData.evaluatorNotes}
                                    onChange={handleChange}
                                    placeholder="Detail the rationale behind the scores provided above..."
                                    style={{ lineHeight: 1.6 }}
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '2rem' }}>
                                <label className="saas-label">Overall Evaluation Status</label>
                                <select name="stage" className="saas-input" value={formData.stage} onChange={handleChange}>
                                    <option value="Assessment Completed">Standard Approval</option>
                                    <option value="Hold">Pending Secondary Review</option>
                                    <option value="Flagged">High Risk / Investigation Required</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div style={{ padding: '2rem 3rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        type="button"
                        className="saas-btn-outline"
                        onClick={prevStep}
                        disabled={step === 1}
                        style={{ opacity: step === 1 ? 0 : 1 }}
                    >
                        <ChevronLeft size={18} /> BACK
                    </button>

                    {step < 4 ? (
                        <button
                            type="button"
                            className="saas-btn-primary"
                            onClick={nextStep}
                        >
                            CONTINUE <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name}
                            className="saas-btn-primary"
                            style={{ padding: '0.75rem 2.5rem' }}
                        >
                            {loading ? 'SAVING...' : 'FINALIZE ASSESSMENT'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
