import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Database,
    RefreshCcw,
    Zap,
    ShieldAlert,
    ArrowRight,
    Search,
    User,
    Briefcase
} from 'lucide-react';

export default function IngestionScreen() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        positionApplied: '',
        fluidIntBaseline: '',
        ethicalBaseline: '',
        stressTelemetry: '',
        noWinScore: '',
        fluidIntStressed: '',
        ethicalStressed: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/jobs');
                setJobs(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, positionApplied: res.data[0].title }));
                }
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : (value === '' ? '' : Number(value))
        }));
    };

    const loadPreset = (type) => {
        if (type === 'optimal') {
            setFormData(prev => ({
                ...prev,
                name: "Ideal Candidate",
                fluidIntBaseline: 94,
                ethicalBaseline: 90,
                stressTelemetry: 88,
                noWinScore: 92,
                fluidIntStressed: 88,
                ethicalStressed: 88
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                name: "High Risk Candidate",
                fluidIntBaseline: 98,
                ethicalBaseline: 82,
                stressTelemetry: 95,
                noWinScore: 12,
                fluidIntStressed: 95,
                ethicalStressed: 10
            }));
        }
    };

    const handleIngest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/candidates/ingest', formData);
            navigate('/');
        } catch (err) {
            console.error(err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 1rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3b82f6' }}>
                        <Database size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--saas-text-heading)' }}>Manual Data Ingestion</h1>
                </div>
                <p style={{ color: 'var(--saas-text-helper)', fontSize: '1rem' }}>
                    Synchronize external assessment data and cognitive performance logs into the system.
                </p>
            </header>

            <div className="saas-card" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3 className="saas-label" style={{ color: 'var(--saas-text-helper)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telemetric Presets</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => loadPreset('optimal')} className="saas-btn-outline" style={{ background: 'rgba(22, 101, 52, 0.1)', color: '#166534', borderColor: 'rgba(22, 101, 52, 0.2)' }}>
                            <Zap size={14} /> Optimal Profile
                        </button>
                        <button type="button" onClick={() => loadPreset('risk')} className="saas-btn-outline" style={{ background: 'rgba(153, 27, 27, 0.1)', color: '#ef4444', borderColor: 'rgba(153, 27, 27, 0.2)' }}>
                            <ShieldAlert size={14} /> Risk Profile
                        </button>
                        <button type="button" onClick={() => setFormData({ name: '', positionApplied: jobs[0]?.title || '', fluidIntBaseline: '', ethicalBaseline: '', stressTelemetry: '', noWinScore: '', fluidIntStressed: '', ethicalStressed: '' })} className="saas-btn-outline">
                            <RefreshCcw size={14} /> Clear
                        </button>
                    </div>
                </div>

                <form onSubmit={handleIngest}>
                    <div className="saas-grid saas-grid-2" style={{ marginBottom: '2.5rem' }}>
                        <div className="form-group">
                            <label className="saas-label">Candidate Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="saas-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label className="saas-label">Target Position</label>
                            <select
                                name="positionApplied"
                                required
                                className="saas-input"
                                value={formData.positionApplied}
                                onChange={handleChange}
                            >
                                {jobs.length === 0 ? (
                                    <option value="">No roles defined</option>
                                ) : (
                                    jobs.map(j => (
                                        <option key={j._id} value={j.title}>{j.title}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 className="saas-label" style={{ borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--saas-text-heading)' }}>Cognitive Performance Matrix (0-100)</h3>
                        <div className="saas-grid saas-grid-2">
                            <div className="form-group">
                                <label className="saas-label">Fluid Intelligence ($G_f$) Baseline</label>
                                <input type="number" name="fluidIntBaseline" required min="0" max="100" className="saas-input" value={formData.fluidIntBaseline} onChange={handleChange} placeholder="85" />
                                <p className="saas-helper">Baseline cognitive reasoning score.</p>
                            </div>
                            <div className="form-group">
                                <label className="saas-label">Ethical Integrity Baseline</label>
                                <input type="number" name="ethicalBaseline" required min="0" max="100" className="saas-input" value={formData.ethicalBaseline} onChange={handleChange} placeholder="90" />
                                <p className="saas-helper">Initial alignment with core values.</p>
                            </div>
                            <div className="form-group">
                                <label className="saas-label">Stress Resilience Score</label>
                                <input type="number" name="stressTelemetry" required min="0" max="100" className="saas-input" value={formData.stressTelemetry} onChange={handleChange} placeholder="75" />
                                <p className="saas-helper">Observed physiological stability.</p>
                            </div>
                            <div className="form-group">
                                <label className="saas-label">Pressure Decision Score</label>
                                <input type="number" name="noWinScore" required min="0" max="100" className="saas-input" value={formData.noWinScore} onChange={handleChange} placeholder="80" />
                                <p className="saas-helper">Consistency in high-stakes dilemmas.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 className="saas-label" style={{ borderBottom: '1px solid var(--saas-border-card)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--saas-text-helper)' }}>Load-Induced Decay Metrics</h3>
                        <div className="saas-grid saas-grid-2">
                            <div className="form-group">
                                <label className="saas-label">Post-Stress $G_f$ Score</label>
                                <input type="number" name="fluidIntStressed" required min="0" max="100" className="saas-input" value={formData.fluidIntStressed} onChange={handleChange} placeholder="80" />
                            </div>
                            <div className="form-group">
                                <label className="saas-label">Post-Stress Ethics Score</label>
                                <input type="number" name="ethicalStressed" required min="0" max="100" className="saas-input" value={formData.ethicalStressed} onChange={handleChange} placeholder="85" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="saas-btn-primary" disabled={loading} style={{ width: '100%', height: '56px', justifyContent: 'center' }}>
                        {loading ? 'SYNCHRONIZING...' : 'FINALIZE INGESTION'} <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
