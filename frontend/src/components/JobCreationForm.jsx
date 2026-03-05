import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ArrowLeft,
    Plus,
    Minus,
    Check,
    Info,
    Search,
    DollarSign,
    Target
} from 'lucide-react';
import axios from 'axios';

const STEPS = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Job Description' },
    { id: 3, label: 'Specifications' },
    { id: 4, label: 'Salary & Benefits' },
    { id: 5, label: 'Review' }
];

export default function JobCreationForm({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        locationType: 'In person',
        location: '',
        timeline: '',
        peopleToHire: 1,
        jobType: ['Full-time'],
        pay: {
            showBy: 'Range',
            min: '',
            max: '',
            rate: 'per month'
        },
        description: '',
        technicalParameters: {
            minIQ: 70,
            minEthics: 70,
            minResilience: 70
        }
    });

    const nextStep = () => setStep(s => Math.min(5, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/jobs', formData);
            onComplete();
        } catch (err) {
            console.error("Failed to create job:", err);
            alert("Error creating job post. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="step-container">
            {STEPS.map((s) => (
                <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                    <div className="step-circle">
                        {step > s.id ? <Check size={16} /> : s.id}
                    </div>
                    <span className="step-label">{s.label}</span>
                </div>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="saas-grid saas-grid-2">
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="saas-label">Job Title</label>
                            <input
                                className="saas-input"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. MERN Stack Developer"
                                required
                            />
                            <p className="saas-helper">Enter a clear, descriptive title for the position.</p>
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Location Type</label>
                            <select
                                className="saas-input"
                                value={formData.locationType}
                                onChange={e => setFormData({ ...formData, locationType: e.target.value })}
                            >
                                <option>In person</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Specific Location</label>
                            <input
                                className="saas-input"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Islamabad, Pakistan"
                            />
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Hiring Timeline</label>
                            <select
                                className="saas-input"
                                value={formData.timeline}
                                onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                            >
                                <option value="">Select an option</option>
                                <option>Immediate</option>
                                <option>1 to 2 weeks</option>
                                <option>2 to 4 weeks</option>
                                <option>More than 4 weeks</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Number of Positions</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button type="button" onClick={() => setFormData({ ...formData, peopleToHire: Math.max(1, formData.peopleToHire - 1) })} className="saas-btn-outline" style={{ padding: '0.5rem 1rem' }}>-</button>
                                <input className="saas-input" style={{ width: '60px', textAlign: 'center' }} value={formData.peopleToHire} readOnly />
                                <button type="button" onClick={() => setFormData({ ...formData, peopleToHire: formData.peopleToHire + 1 })} className="saas-btn-outline" style={{ padding: '0.5rem 1rem' }}>+</button>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="form-group">
                            <label className="saas-label">Job Description</label>
                            <textarea
                                className="saas-input"
                                style={{ minHeight: '300px', resize: 'vertical' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the role, responsibilities, and day-to-day activities..."
                            />
                            <p className="saas-helper">Be as detailed as possible to attract the best talent.</p>
                        </div>
                    </motion.div>
                );
            case 3:
                const types = ['Full-time', 'Part-time', 'Temporary', 'Contract', 'Internship', 'Fresher'];
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="form-group">
                            <label className="saas-label">Job Type Classifications</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                                {types.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                            const newTypes = formData.jobType.includes(t)
                                                ? formData.jobType.filter(i => i !== t)
                                                : [...formData.jobType, t];
                                            setFormData({ ...formData, jobType: newTypes });
                                        }}
                                        className={formData.jobType.includes(t) ? 'saas-btn-primary' : 'saas-btn-outline'}
                                        style={{ fontSize: '0.875rem' }}
                                    >
                                        {formData.jobType.includes(t) && <Check size={14} />} {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="saas-grid saas-grid-2">
                        <div className="form-group">
                            <label className="saas-label">Show Pay By</label>
                            <select
                                className="saas-input"
                                value={formData.pay.showBy}
                                onChange={e => setFormData({ ...formData, pay: { ...formData.pay, showBy: e.target.value } })}
                            >
                                <option>Range</option>
                                <option>Starting at</option>
                                <option>Fixed rate</option>
                                <option>Amount up to</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Rate</label>
                            <select
                                className="saas-input"
                                value={formData.pay.rate}
                                onChange={e => setFormData({ ...formData, pay: { ...formData.pay, rate: e.target.value } })}
                            >
                                <option>per hour</option>
                                <option>per month</option>
                                <option>per year</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Minimum Salary (PKR)</label>
                            <input
                                type="number"
                                className="saas-input"
                                value={formData.pay.min}
                                onChange={e => setFormData({ ...formData, pay: { ...formData.pay, min: e.target.value } })}
                                placeholder="e.g. 80000"
                            />
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Maximum Salary (PKR)</label>
                            <input
                                type="number"
                                className="saas-input"
                                disabled={formData.pay.showBy === 'Starting at' || formData.pay.showBy === 'Fixed rate'}
                                value={formData.pay.max}
                                style={{ opacity: (formData.pay.showBy === 'Starting at' || formData.pay.showBy === 'Fixed rate') ? 0.5 : 1 }}
                                onChange={e => setFormData({ ...formData, pay: { ...formData.pay, max: e.target.value } })}
                                placeholder="e.g. 150000"
                            />
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="saas-card" style={{ padding: '2rem', background: 'var(--bg-subtle)', border: '1px dashed var(--saas-border-card)', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--saas-text-heading)' }}>
                                <Check size={20} color="#10b981" /> Confirmation Review
                            </h3>
                            <div className="saas-grid saas-grid-2" style={{ fontSize: '0.875rem' }}>
                                <div>
                                    <span style={{ color: 'var(--saas-text-helper)' }}>Title:</span>
                                    <p style={{ fontWeight: 600, color: 'var(--saas-text-heading)' }}>{formData.title}</p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--saas-text-helper)' }}>Location:</span>
                                    <p style={{ fontWeight: 600, color: 'var(--saas-text-heading)' }}>{formData.locationType} - {formData.location}</p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--saas-text-helper)' }}>Positions:</span>
                                    <p style={{ fontWeight: 600, color: 'var(--saas-text-heading)' }}>{formData.peopleToHire}</p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--saas-text-helper)' }}>Salary range:</span>
                                    <p style={{ fontWeight: 600, color: 'var(--saas-text-heading)' }}>
                                        {formData.pay.showBy} PKR {formData.pay.min} {formData.pay.max ? `- PKR ${formData.pay.max}` : ''} {formData.pay.rate}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--saas-text-helper)', textAlign: 'center' }}>
                            By publishing this role, it will become active and available for candidate applications.
                        </p>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div className="saas-card">
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--saas-text-heading)' }}>Create New Job Posting</h1>
                    <p style={{ color: 'var(--saas-text-helper)' }}>Fill out the details below to launch your intelligence-driven recruitment campaign.</p>
                </div>

                {renderStepIndicator()}

                <div style={{ minHeight: '400px' }}>
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--saas-border-card)' }}>
                    <button onClick={step === 1 ? onCancel : prevStep} className="saas-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> BACK
                    </button>
                    <button
                        onClick={step === 5 ? handleSubmit : nextStep}
                        className="saas-btn-primary"
                        disabled={loading}
                        style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                    >
                        {loading ? 'PUBLISHING...' : (step === 5 ? 'REVIEW & PUBLISH' : 'CONTINUE')} <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
