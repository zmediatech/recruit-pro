import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ShieldCheck, Zap, Activity, Terminal, ExternalLink, Cpu, Play } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function CandidateDetail() {
    const { id } = useParams();
    const location = useLocation();
    const candidate = location.state?.candidate;
    const navigate = useNavigate();

    // Ensure session tracking for the gauntlet
    if (candidate) {
        sessionStorage.setItem('current_candidate_id', id);
        sessionStorage.setItem('current_candidate_name', candidate.name);
    }

    if (!candidate) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <Terminal size={48} style={{ marginBottom: '2rem', opacity: 0.5 }} />
                <h3>NO ANALYTIC DATA IN STREAM</h3>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '2rem' }}>RETURN TO OPERATIONS</button>
            </div>
        );
    }

    const { coordinates, rho, flags, name, isRejected, evaluatorNotes, scenarioSelection, stage } = candidate;

    const handleGenerateReport = () => {
        // Generating a structured CSV report for Excel compatibility
        const headers = ["Metric", "Value", "Notes"];
        const rows = [
            ["Candidate Name", name, ""],
            ["Candidate ID", id, ""],
            ["Current Stage", stage || 'Evaluated', ""],
            ["Status", isRejected ? 'Declined' : 'Recommended', ""],
            ["IQ Score", coordinates.X, "Cognitive Intelligence"],
            ["Ethics Score", coordinates.Y, "Ethical Integrity"],
            ["Reliability Score", coordinates.Z, "Stress Resilience"],
            ["Final Reliability Index (rho)", rho.toFixed(2), "Performance Stability"],
            ["Evaluator Notes", evaluatorNotes || "N/A", ""],
            ["Anomalies", flags.length > 0 ? flags.join('; ') : "None", ""]
        ];

        const csvContent = [headers, ...rows].map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Evaluation_Report_${name.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const radarData = [
        { subject: 'Intelligence', A: coordinates.X, fullMark: 100 },
        { subject: 'Integrity', A: coordinates.Y, fullMark: 100 },
        { subject: 'Resilience', A: coordinates.Z, fullMark: 100 },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="candidate-detail-container">
            <button
                onClick={() => navigate('/')}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0, opacity: 0.6 }}
            >
                <ArrowLeft size={16} /> BACK TO DASHBOARD
            </button>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        CANDIDATE PROFILE
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>ID: {id.slice(-8).toUpperCase()}</span>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--glass-border)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{stage?.toUpperCase() || 'EVALUATED'}</span>
                    </div>
                </div>
                <div className={`status-badge ${isRejected ? 'status-rejected' : 'status-valid'}`} style={{ padding: '0.75rem 2rem' }}>
                    {isRejected ? 'Rejected' : 'Qualified'}
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '2rem' }}>

                <div className="glass-panel" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Assessment Results</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Performance across key evaluation areas</p>
                        </div>
                        <Activity size={20} color="var(--accent-green)" />
                    </div>

                    <div style={{ flex: 1, width: '100%', minHeight: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="var(--glass-border)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Candidate"
                                    dataKey="A"
                                    stroke={isRejected ? "var(--accent-red)" : "var(--accent-green)"}
                                    fill={isRejected ? "var(--accent-red)" : "var(--accent-green)"}
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                        <DetailMetric label="Logic" value={coordinates.X} color="var(--accent-blue)" />
                        <DetailMetric label="Ethics" value={coordinates.Y} color="var(--accent-purple)" />
                        <DetailMetric label="Pressure" value={coordinates.Z} color="var(--accent-green)" />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Performance Stability</h3>
                            <Zap size={18} color={isRejected ? 'var(--accent-red)' : 'var(--accent-green)'} />
                        </div>
                        <div style={{ fontSize: '4rem', fontWeight: 800, color: rho >= 0.8 ? 'var(--accent-green)' : rho < 0.5 ? 'var(--accent-red)' : 'var(--text-primary)', marginBottom: '1rem' }}>
                            {(rho * 100).toFixed(0)}<span style={{ fontSize: '2rem' }}>%</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Calculated probability of consistent performance and decision making under organizational pressure.
                        </p>
                    </div>

                    {flags.length > 0 && (
                        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <h4 style={{ color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                <AlertTriangle size={16} /> ATTENTION REQUIRED
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {flags.map((f, i) => (
                                    <div key={i} style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stage === 'Intake' && (
                        <div className="glass-panel" style={{ border: '1px solid var(--accent-green)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Play size={18} color="var(--accent-green)" />
                                <h3 style={{ fontSize: '1rem' }}>Assessment Center</h3>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Application verified. Candidate is ready for full skill assessment and technical evaluation.
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                                onClick={() => navigate(`/gauntlet/${id}`, { state: { candidate } })}
                            >
                                START ASSESSMENT
                            </button>
                        </div>
                    )}

                    <div className="glass-panel" style={{ background: 'rgba(59, 130, 246, 0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Cpu size={18} color="var(--accent-blue)" />
                            <h3 style={{ fontSize: '1rem' }}>AI Resume Analysis</h3>
                        </div>

                        {candidate.aiAnalysis ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <DetailMetric label="Skill Match" value={`${candidate.aiAnalysis.skillMatch}%`} color="var(--accent-blue)" />
                                    <DetailMetric label="Suitability" value={`${candidate.aiAnalysis.suitabilityScore}%`} color="var(--accent-green)" />
                                </div>
                                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Experience Level</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{candidate.aiAnalysis.experienceDepth}</p>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    "{candidate.aiAnalysis.summary}"
                                </p>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', background: 'var(--accent-blue)' }}
                                onClick={async () => {
                                    try {
                                        const res = await axios.post(`http://localhost:5001/api/candidates/${id}/analyze`);
                                        if (res.data.success) {
                                            alert("Analysis complete.");
                                            navigate('/assessment', { state: { candidate: res.data.candidate || candidate, questions: res.data.questions } });
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("AI Analysis Failed.");
                                    }
                                }}
                            >
                                ANALYZE WITH AI
                            </button>
                        )}
                    </div>

                    <div className="glass-panel">
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <ShieldCheck size={18} color="var(--accent-purple)" />
                                <h3 style={{ fontSize: '1rem' }}>Interview Notes</h3>
                            </div>
                            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Context</p>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{scenarioSelection || 'Standard Interview'}</div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {evaluatorNotes || "No specific notes provided."}
                            </p>
                        </div>

                        <button
                            className="btn btn-outline"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleGenerateReport}
                        >
                            <FileText size={18} /> EXPORT PROFILE
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function DetailMetric({ label, value, color }) {
    return (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>{label}</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</h2>
        </div>
    );
}
