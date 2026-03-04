import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ShieldAlert, Terminal, Zap, Scale, Activity } from 'lucide-react';

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
        stage: 'Evaluated'
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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ maxWidth: '850px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>

            <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-green)', letterSpacing: '1px', marginBottom: '0.5rem' }}>MANUAL EVALUATION</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Used for structured interviews or direct observation logs.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} style={{ width: '40px', height: '4px', background: step >= num ? 'var(--accent-green)' : 'var(--border-subtle)', borderRadius: '2px', boxShadow: step >= num ? '0 0 10px var(--accent-green)' : 'none' }} />
                    ))}
                </div>
            </div>

            <div style={{ padding: '4rem 3rem' }}>
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <Activity className="val-x" size={24} />
                            <h3 style={{ fontSize: '1.1rem' }}>PHASE 1: INTELLIGENCE ($G_f$) SCREENING</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">SUBJECT IDENTIFIER / NAME</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Enter name or tracking ID..." />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                            <div className="form-group">
                                <label className="form-label">PATTERN MATCHING (0-100)</label>
                                <input type="number" name="fluidIntBaseline" className="form-control" value={formData.fluidIntBaseline} onChange={handleChange} />
                                <small style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', display: 'block', fontSize: '0.7rem' }}>Observational $G_f$ baseline scoring.</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label">SYSTEMS THINKING (0-100)</label>
                                <input type="number" name="ethicalBaseline" className="form-control" value={formData.ethicalBaseline} onChange={handleChange} />
                                <small style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', display: 'block', fontSize: '0.7rem' }}>Ability to map root systemic failures.</small>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <Scale className="val-y" size={24} />
                            <h3 style={{ fontSize: '1.1rem' }}>PHASE 2: ETHICS ASSESSMENT</h3>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label className="form-label">ISSUED SCENARIO PROFILE</label>
                            <select name="scenarioSelection" className="form-control" value={formData.scenarioSelection} onChange={handleChange}>
                                <option value="Zero-Day Deployment">Scenario 1: Zero-Day Deployment (Technical Integrity)</option>
                                <option value="The Whistleblower's Catch-22">Scenario 2: The Whistleblower's Catch-22 (Organizational Ethics)</option>
                                <option value="The Attrition Equation">Scenario 3: The Attrition Equation (Leadership Under Load)</option>
                            </select>
                        </div>

                        <div style={{ padding: '2rem', background: 'var(--bg-subtle)', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                <ShieldAlert size={18} color="var(--accent-purple)" /> EVALUATORY DIRECTIVE
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                Assess consequence ownership. Does the subject accept systemic failure or attempt to bypass reality with "third options"? Higher ethical anchoring requires absorbing personal/professional pain.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ color: 'var(--accent-red)' }}>ADAPTIVE ETHICS SCORE (0-100)</label>
                            <input type="number" name="noWinScore" className="form-control" value={formData.noWinScore} onChange={handleChange} />
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <Zap className="val-z" size={24} />
                            <h3 style={{ fontSize: '1.1rem' }}>PHASE 3: STRESS RESILIENCE TEST</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="form-group">
                                <label className="form-label">PHYSIOLOGICAL TONE / HRV (0-100)</label>
                                <input type="number" name="stressTelemetry" className="form-control" value={formData.stressTelemetry} onChange={handleChange} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="form-group">
                                    <label className="form-label">STRESSED $G_f$ (IQ DECAY)</label>
                                    <input type="number" name="fluidIntStressed" className="form-control" value={formData.fluidIntStressed} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">STRESSED ETHICS (Y DECAY)</label>
                                    <input type="number" name="ethicalStressed" className="form-control" value={formData.ethicalStressed} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <Terminal size={24} color="var(--accent-green)" />
                            <h3 style={{ fontSize: '1.1rem' }}>PHASE 4: FINAL EVALUATION SUMMARY</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">EVALUATOR DEBRIEF & RATIONALE</label>
                            <textarea
                                name="evaluatorNotes"
                                className="form-control"
                                rows={8}
                                value={formData.evaluatorNotes}
                                onChange={handleChange}
                                placeholder="Detail rationale behind 'No-Win' choices and observed 'Gauntlet' behaviors..."
                                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '2rem' }}>
                            <label className="form-label">EVALUATION STATUS</label>
                            <select name="stage" className="form-control" value={formData.stage} onChange={handleChange}>
                                <option value="Evaluated">COMPLETED</option>
                                <option value="Hold">PENDING REVIEW</option>
                                <option value="Flagged">FLAGGED FOR WARNING</option>
                            </select>
                        </div>
                    </motion.div>
                )}
            </div>

            <div style={{ padding: '2.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-subtle)' }}>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    style={{ opacity: step === 1 ? 0 : 1 }}
                >
                    <ChevronLeft size={18} /> BACK
                </button>

                {step < 4 ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={nextStep}
                        style={{ padding: '0 3rem' }}
                    >
                        PROCEED <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                        className="btn btn-primary"
                        style={{ padding: '0 3rem' }}
                    >
                        {loading ? 'SAVING...' : 'FINALIZE EVALUATION'}
                    </button>
                )}
            </div>

        </motion.div>
    );
}
