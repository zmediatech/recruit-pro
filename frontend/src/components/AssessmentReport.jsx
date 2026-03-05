import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart3, TrendingUp, ShieldCheck, Download, ExternalLink, User } from 'lucide-react';
import axios from 'axios';

export default function AssessmentReport({ candidateName, onFinish }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const candidateId = sessionStorage.getItem('current_candidate_id');
                if (candidateId) {
                    const res = await axios.get(`http://localhost:5001/api/candidates/${candidateId}`);
                    setData(res.data);
                } else {
                    // Fallback to local session storage if candidate not created yet (though it should be)
                    setData({
                        name: candidateName,
                        coordinates: {
                            X: sessionStorage.getItem('temp_xf') || 50,
                            Y: sessionStorage.getItem('temp_yf') || 50,
                            Z: sessionStorage.getItem('temp_zf') || 50
                        },
                        rho: 0.85
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [candidateName]);

    if (loading) return <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center' }}>Generating Final Performance Report...</div>;

    const stats = [
        { label: "Intelligence Index", val: data?.coordinates?.X || 0, color: "var(--accent-blue)", icon: <TrendingUp size={20} /> },
        { label: "Ethical Integrity", val: data?.coordinates?.Y || 0, color: "var(--accent-green)", icon: <ShieldCheck size={20} /> },
        { label: "Stress Resilience", val: data?.coordinates?.Z || 0, color: "var(--accent-red)", icon: <BarChart3 size={20} /> }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '4rem' }}
        >
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--accent-green)' }}>
                    <CheckCircle size={40} color="var(--accent-green)" />
                </div>
                <h1 style={{ marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>ASSESSMENT COMPLETE</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Performance profile for <strong>{candidateName}</strong> has been secured.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '2rem 1.5rem', background: 'var(--bg-subtle)', borderRadius: '20px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: s.color }} />
                        <div style={{ color: s.color, marginBottom: '1rem' }}>{s.icon}</div>
                        <h4 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{Math.round(s.val)}%</div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '3rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <User size={18} color="var(--accent-purple)" />
                    <h3 style={{ fontSize: '1rem' }}>Stability Index (ρ)</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data?.rho || 0) * 100}%` }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))' }}
                        />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{(data?.rho || 0).toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    A higher index indicates consistent decision-making and cognitive output regardless of situational pressure.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={onFinish} style={{ flex: 1, padding: '1.25rem' }}>
                    RETURN TO DASHBOARD <Download size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
            </div>
        </motion.div>
    );
}
