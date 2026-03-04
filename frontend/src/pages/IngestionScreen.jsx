import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function IngestionScreen() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        fluidIntBaseline: '',
        ethicalBaseline: '',
        stressTelemetry: '',
        noWinScore: '',
        fluidIntStressed: '',
        ethicalStressed: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : Number(value)
        }));
    };

    // Provide two preset buttons for easy demo
    const loadPolymathPreset = () => {
        setFormData({
            name: "Ideal Candidate",
            fluidIntBaseline: 94,
            ethicalBaseline: 90,
            stressTelemetry: 88,
            noWinScore: 92,
            fluidIntStressed: 88,
            ethicalStressed: 88
        });
    };

    const loadSaboteurPreset = () => {
        setFormData({
            name: "High Risk Candidate",
            fluidIntBaseline: 98,
            ethicalBaseline: 82,
            stressTelemetry: 95,
            noWinScore: 12,
            fluidIntStressed: 95,
            ethicalStressed: 10
        });
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ padding: '3.5rem', maxWidth: '900px', margin: '0 auto', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}
        >
            <div style={{ marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>DATA INGESTION ENGINE</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                    Manually sync psychometric telemetry and cognitive performance data to the central intelligence repository.
                </p>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <p style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase'
                }}>QUICK SYNC PRESETS</p>
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)', background: 'hsla(155, 80%, 45%, 0.05)' }} onClick={loadPolymathPreset}>
                        LOAD 'OPTIMAL' PRESET
                    </button>
                    <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)', background: 'hsla(0, 85%, 60%, 0.05)' }} onClick={loadSaboteurPreset}>
                        LOAD 'RISK' PRESET
                    </button>
                    <button type="button" className="btn btn-outline" style={{ opacity: 0.6 }} onClick={() => setFormData({ name: '', fluidIntBaseline: '', ethicalBaseline: '', stressTelemetry: '', noWinScore: '', fluidIntStressed: '', ethicalStressed: '' })}>
                        CLEAR STREAM
                    </button>
                </div>
            </div>

            <form onSubmit={handleIngest}>
                <div style={{ marginBottom: '3rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '1rem' }}>CANDIDATE IDENTIFICATION</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ENTER FULL NAME"
                        style={{ fontSize: '1.25rem', padding: '1.25rem 2rem', background: 'var(--bg-subtle)', fontWeight: 600 }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>BASELINE IQ</label>
                        <input type="number" name="fluidIntBaseline" required min="0" max="100" className="form-control" value={formData.fluidIntBaseline} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>BASELINE ETHICS</label>
                        <input type="number" name="ethicalBaseline" required min="0" max="100" className="form-control" value={formData.ethicalBaseline} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>STRESS RESILIENCE</label>
                        <input type="number" name="stressTelemetry" required min="0" max="100" className="form-control" value={formData.stressTelemetry} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-red)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>SCENARIO DECISION</label>
                        <input type="number" name="noWinScore" required min="0" max="100" className="form-control" value={formData.noWinScore} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>STRESSED IQ</label>
                        <input type="number" name="fluidIntStressed" required min="0" max="100" className="form-control" value={formData.fluidIntStressed} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>STRESSED ETHICS</label>
                        <input type="number" name="ethicalStressed" required min="0" max="100" className="form-control" value={formData.ethicalStressed} onChange={handleChange} placeholder="0-100" style={{ background: 'var(--bg-subtle)' }} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: '70px', fontSize: '1.1rem', background: 'var(--accent-green)', fontWeight: 800 }}>
                    {loading ? 'SYNCING DATASET...' : 'COMMENCE DATA SYNC'}
                </button>
            </form>
        </motion.div>
    );
}
