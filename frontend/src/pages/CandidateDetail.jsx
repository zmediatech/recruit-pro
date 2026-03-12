import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, ArrowLeft, ShieldCheck, Zap, Activity,
    Terminal, ExternalLink, Cpu, Play, Linkedin, FileText,
    User, Mail, Phone, MapPin, Video, Download, Calendar,
    Clock, X, Loader2, CheckCircle, Send, Star, Link as LinkIcon
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import axios from 'axios';
import { Award, Check, Target, Brain, Scale, ShieldAlert } from 'lucide-react';

// ─── Interview Scheduling Modal ──────────────────────────────────────────────
function ScheduleModal({ candidate, onClose, onSuccess }) {
    const [form, setForm] = useState({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'Online',
        interviewLink: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.interviewDate || !form.interviewTime) {
            setError('Please select a date and time for the interview.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(
                `http://localhost:5001/api/admin/candidates/${candidate._id}/schedule`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                onSuccess(res.data);
            } else {
                setError(res.data.message || 'Scheduling failed.');
            }
        } catch (err) {
            console.error('Scheduling error:', err);
            setError(err.response?.data?.message || 'Failed to schedule interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
        }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '560px',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>
                            INTERVIEW SCHEDULING
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{candidate.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{candidate.positionApplied}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Date & Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="saas-label">INTERVIEW DATE *</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="date"
                                    className="saas-input"
                                    style={{ paddingLeft: '2.75rem' }}
                                    min={new Date().toISOString().split('T')[0]}
                                    value={form.interviewDate}
                                    onChange={e => setForm({ ...form, interviewDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="saas-label">INTERVIEW TIME *</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="time"
                                    className="saas-input"
                                    style={{ paddingLeft: '2.75rem' }}
                                    value={form.interviewTime}
                                    onChange={e => setForm({ ...form, interviewTime: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interview Type */}
                    <div>
                        <label className="saas-label">INTERVIEW TYPE</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['Online', 'Physical'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setForm({ ...form, interviewType: type })}
                                    style={{
                                        flex: 1, padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                                        border: `2px solid ${form.interviewType === type ? 'var(--accent-green)' : 'var(--glass-border)'}`,
                                        background: form.interviewType === type ? 'rgba(16,185,129,0.1)' : 'transparent',
                                        color: form.interviewType === type ? 'var(--accent-green)' : 'var(--text-secondary)',
                                        fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {type === 'Online' ? '📹' : '🏢'} {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Meeting Link / Location */}
                    <div>
                        <label className="saas-label">
                            {form.interviewType === 'Online' ? 'MEETING LINK (ZOOM / GOOGLE MEET)' : 'LOCATION / VENUE ADDRESS'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                className="saas-input"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder={form.interviewType === 'Online' ? 'https://meet.google.com/xyz...' : 'Office address...'}
                                value={form.interviewLink}
                                onChange={e => setForm({ ...form, interviewLink: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="saas-label">ADDITIONAL NOTES (OPTIONAL)</label>
                        <textarea
                            className="saas-input"
                            placeholder="Any special instructions for the candidate..."
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            style={{ minHeight: '90px', padding: '0.9rem', resize: 'vertical' }}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ padding: '0.9rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', fontSize: '0.85rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                            Cancel
                        </button>
                        <button type="submit" className="saas-btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                            {loading ? <><Loader2 size={18} className="spinning" /> Scheduling...</> : <><Send size={18} /> Schedule & Send Email</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Main CandidateDetail Page ────────────────────────────────────────────────
export default function CandidateDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentCandidate, setCurrentCandidate] = React.useState(location.state?.candidate);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduledSuccess, setScheduledSuccess] = useState(false);

    React.useEffect(() => {
        // If no state was passed (direct navigation), fetch from API
        if (!currentCandidate && id) {
            axios.get(`http://localhost:5001/api/candidates/${id}`)
                .then(res => setCurrentCandidate(res.data))
                .catch(err => console.error('Failed to load candidate:', err));
        }
    }, [id]);

    if (currentCandidate) {
        sessionStorage.setItem('current_candidate_id', id);
        sessionStorage.setItem('current_candidate_name', currentCandidate.name);
    }

    if (!currentCandidate) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem' }}>
                <Terminal size={48} style={{ marginBottom: '2rem', opacity: 0.5 }} />
                <h3>Loading Profile...</h3>
            </div>
        );
    }

    const { coordinates, rho, flags = [], name, isRejected, evaluatorNotes, scenarioSelection, stage } = currentCandidate;

    const handleScheduleSuccess = (data) => {
        setShowScheduleModal(false);
        setScheduledSuccess(true);
        setCurrentCandidate({ ...currentCandidate, stage: 'Interview Scheduled', interviewDetails: data.interviewDetails });
        setTimeout(() => setScheduledSuccess(false), 5000);
    };

    const handleGenerateReport = () => {
        const headers = ["Metric", "Value", "Notes"];
        const rows = [
            ["Candidate Name", name, ""],
            ["Candidate ID", id, ""],
            ["Current Stage", stage || 'Evaluated', ""],
            ["Status", isRejected ? 'Declined' : 'Recommended', ""],
            ["IQ Score", coordinates?.X || 0, "Cognitive Intelligence"],
            ["Ethics Score", coordinates?.Y || 0, "Ethical Integrity"],
            ["Reliability Score", coordinates?.Z || 0, "Stress Resilience"],
            ["Final Reliability Index (rho)", (rho || 1).toFixed(2), "Performance Stability"],
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
        { subject: 'Intelligence', A: coordinates?.X || 0, fullMark: 100 },
        { subject: 'Integrity', A: coordinates?.Y || 0, fullMark: 100 },
        { subject: 'Resilience', A: coordinates?.Z || 0, fullMark: 100 },
        { subject: 'Technical', A: currentCandidate.technicalAssessment?.overallScore || 0, fullMark: 100 },
    ];

    const rhoVal = rho || 1;

    return (
        <>
            <AnimatePresence>
                {showScheduleModal && (
                    <ScheduleModal
                        candidate={currentCandidate}
                        onClose={() => setShowScheduleModal(false)}
                        onSuccess={handleScheduleSuccess}
                    />
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="candidate-detail-container">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin/candidates')}
                    className="btn btn-outline"
                    style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0, opacity: 0.6 }}
                >
                    <ArrowLeft size={16} /> BACK TO CANDIDATES
                </button>

                {/* Success Banner */}
                <AnimatePresence>
                    {scheduledSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(16,185,129,0.1)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                borderRadius: '12px',
                                color: '#10b981',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                marginBottom: '2rem', fontWeight: 600
                            }}
                        >
                            <CheckCircle size={20} />
                            Interview scheduled successfully! The candidate will receive an email confirmation.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                            CANDIDATE PROFILE
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                                ID: {currentCandidate.candidateId || id.slice(-8).toUpperCase()}
                            </span>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--glass-border)' }} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                                {stage?.toUpperCase() || 'EVALUATED'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {currentCandidate.linkedin && (
                                <a href={currentCandidate.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}>
                                    <Linkedin size={14} /> LinkedIn
                                </a>
                            )}
                            {currentCandidate.portfolio && (
                                <a href={currentCandidate.portfolio} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}>
                                    <ExternalLink size={14} /> Portfolio
                                </a>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div className={`status-badge ${isRejected ? 'status-rejected' : stage === 'Interview Scheduled' ? 'status-scheduled' : 'status-valid'}`} style={{
                            padding: '0.6rem 1.5rem',
                            background: stage === 'Interview Scheduled' ? 'rgba(139,92,246,0.1)' : undefined,
                            color: stage === 'Interview Scheduled' ? '#8b5cf6' : undefined,
                            borderColor: stage === 'Interview Scheduled' ? 'rgba(139,92,246,0.2)' : undefined
                        }}>
                            {stage === 'Interview Scheduled' ? 'Interview Scheduled' : isRejected ? 'Rejected' : 'Qualified'}
                        </div>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="saas-btn-primary"
                            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Calendar size={16} /> {stage === 'Interview Scheduled' ? 'Reschedule Interview' : 'Schedule Interview'}
                        </button>
                    </div>
                </header>

                {/* --- NEW: CANDIDATE ASSESSMENT REPORT --- */}
                <div className="glass-panel" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))', borderColor: 'rgba(59,130,246,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={22} color="var(--accent-green)" /> Candidate Assessment Report
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aggregated performance across all evaluation dimensions</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>OVERALL RATING</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-green)' }}>
                                {[1, 2, 3, 4, 5].map(star => {
                                    const avg = ((coordinates?.X || 0) + (coordinates?.Y || 0) + (coordinates?.Z || 0) + (currentCandidate.technicalAssessment?.overallScore || 0)) / 4;
                                    const rating = Math.round(avg / 20);
                                    return <Star key={star} size={16} fill={star <= rating ? 'currentColor' : 'none'} />;
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        <IntegratedMetric icon={Brain} label="Intelligence" value={coordinates?.X || 0} color="#3b82f6" />
                        <IntegratedMetric icon={Scale} label="Ethics" value={coordinates?.Y || 0} color="#8b5cf6" />
                        <IntegratedMetric icon={Zap} label="Resilience" value={coordinates?.Z || 0} color="#10b981" />
                        <IntegratedMetric icon={Cpu} label="Technical" value={currentCandidate.technicalAssessment?.overallScore || 0} color="#f59e0b" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.85fr', gap: '2rem' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Basic Info Card */}
                        <div className="glass-panel">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} color="var(--accent-blue)" /> Basic Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { icon: Mail, label: 'Email', value: currentCandidate.email },
                                    { icon: Phone, label: 'Phone', value: currentCandidate.phone },
                                    { icon: MapPin, label: 'Location', value: currentCandidate.location },
                                    { icon: Cpu, label: 'Role Applied', value: currentCandidate.positionApplied },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                            <Icon size={13} color="var(--text-secondary)" />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, wordBreak: 'break-all' }}>{value || '—'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assessment Radar */}
                        <div className="glass-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={18} color="var(--accent-green)" /> Assessment Results
                                </h3>
                            </div>
                            <div style={{ width: '100%', height: '280px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="var(--glass-border)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Candidate" dataKey="A"
                                            stroke={isRejected ? "var(--accent-red)" : "var(--accent-green)"}
                                            fill={isRejected ? "var(--accent-red)" : "var(--accent-green)"}
                                            fillOpacity={0.2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                <MetricBox label="Logic" value={`${coordinates?.X || 0}`} color="var(--accent-blue)" />
                                <MetricBox label="Ethics" value={`${coordinates?.Y || 0}`} color="var(--accent-purple)" />
                                <MetricBox label="Pressure" value={`${coordinates?.Z || 0}`} color="var(--accent-green)" />
                            </div>
                        </div>

                        {/* Technical Results Card */}
                        <div className="glass-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Terminal size={18} color="var(--accent-green)" /> Technical Assessment Results
                                </h3>
                                {currentCandidate.technicalAssessment?.recommendedLevel && (
                                    <span style={{ 
                                        fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', 
                                        background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.3)'
                                    }}>
                                        {currentCandidate.technicalAssessment.recommendedLevel.toUpperCase()} LEVEL
                                    </span>
                                )}
                            </div>

                            {currentCandidate.technicalAssessment?.questions?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    
                                    {/* AI Evaluation Summary */}
                                    {currentCandidate.technicalAssessment.evaluationSummary && (
                                        <div style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ padding: '8px', background: 'var(--accent-green)', borderRadius: '8px', color: 'white' }}>
                                                    <Cpu size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AI EVALUATION SUMMARY</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>Technical Score: {currentCandidate.technicalAssessment.overallScore}%</div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                                "{currentCandidate.technicalAssessment.evaluationSummary}"
                                            </p>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Check size={12} /> STRENGTHS
                                                    </div>
                                                    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                                        {currentCandidate.technicalAssessment.strengths?.map((s, i) => (
                                                            <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} /> {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <ShieldAlert size={12} /> WEAKNESSES
                                                    </div>
                                                    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                                        {currentCandidate.technicalAssessment.weaknesses?.map((w, i) => (
                                                            <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f87171' }} /> {w}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '1rem' }}>DETAILED Q&A LOG</div>
                                    {currentCandidate.technicalAssessment.questions.map((q, i) => (
                                        <div key={i} style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: '12px', borderLeft: `4px solid ${q.score >= 70 ? '#10b981' : q.score >= 40 ? '#f59e0b' : '#f87171'}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 800, flex: 1, paddingRight: '1rem' }}>Q{i + 1}: {q.questionText || q.question}</p>
                                                <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'var(--glass-border)', borderRadius: '6px', fontWeight: 800 }}>{q.type}</span>
                                            </div>
                                            
                                            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--glass-border)', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Candidate Response</p>
                                                    {q.type === 'MCQ' && (
                                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: q.candidateAnswer === q.correctAnswer ? '#10b981' : '#f87171' }}>
                                                            {q.candidateAnswer === q.correctAnswer ? 'CORRECT' : 'INCORRECT'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                                    {q.candidateAnswer || 'No response provided.'}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Target size={12} color="var(--text-secondary)" />
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                    <strong>Reference Answer:</strong> {q.correctAnswer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                    <AlertTriangle size={32} style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ fontSize: '0.85rem' }}>No technical assessment data available.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Stability Score */}
                        <div className="glass-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Performance Stability Index</h3>
                                <Zap size={18} color={isRejected ? 'var(--accent-red)' : 'var(--accent-green)'} />
                            </div>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: rhoVal >= 0.8 ? 'var(--accent-green)' : rhoVal < 0.5 ? 'var(--accent-red)' : 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1 }}>
                                {(rhoVal * 100).toFixed(0)}<span style={{ fontSize: '1.75rem', fontWeight: 600 }}>%</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Probability of consistent performance under organizational pressure.
                            </p>
                        </div>

                        {/* Uploaded Files */}
                        <div className="glass-panel">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Download size={18} color="var(--accent-purple)" /> Uploaded Files
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <FileLink icon={FileText} label="Resume / CV" url={currentCandidate.cvUrl} />
                                <FileLink icon={Video} label="Introduction Video" url={currentCandidate.videoUrl} />
                            </div>
                        </div>

                        {/* Interview Details (if scheduled) */}
                        {currentCandidate.interviewDetails && (
                            <div className="glass-panel" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                                    <Calendar size={18} /> Interview Scheduled
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <InfoRow label="Date" value={currentCandidate.interviewDetails.date || currentCandidate.interviewDetails.interviewDate} />
                                    <InfoRow label="Time" value={currentCandidate.interviewDetails.time || currentCandidate.interviewDetails.interviewTime} />
                                    <InfoRow label="Type" value={currentCandidate.interviewDetails.type || currentCandidate.interviewDetails.interviewType} />
                                    {(currentCandidate.interviewDetails.link || currentCandidate.interviewDetails.interviewLink) && (
                                        <InfoRow label="Link" value={currentCandidate.interviewDetails.link || currentCandidate.interviewDetails.interviewLink} isLink />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Flags */}
                        {flags.length > 0 && (
                            <div className="glass-panel" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
                                <h4 style={{ color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                    <AlertTriangle size={16} /> ATTENTION REQUIRED
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {flags.map((f, i) => (
                                        <div key={i} style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--accent-red)' }}>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Analysis */}
                        {currentCandidate.aiAnalysis && (
                            <div className="glass-panel" style={{ background: 'rgba(59,130,246,0.02)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Cpu size={18} color="var(--accent-blue)" /> AI Analysis
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <MetricBox label="Skill Match" value={`${currentCandidate.aiAnalysis.skillMatch}%`} color="var(--accent-blue)" />
                                    <MetricBox label="Suitability" value={`${currentCandidate.aiAnalysis.suitabilityScore}%`} color="var(--accent-green)" />
                                </div>
                                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Experience Level</p>
                                    <p style={{ fontWeight: 700 }}>{currentCandidate.aiAnalysis.experienceDepth}</p>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                    "{currentCandidate.aiAnalysis.summary}"
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="glass-panel">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={18} color="var(--accent-purple)" /> Evaluator Notes
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                {evaluatorNotes || "No evaluator notes recorded."}
                            </p>
                            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }} onClick={handleGenerateReport}>
                                <FileText size={16} /> Export Profile as CSV
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// ─── Helper Components ────────────────────────────────────────────────────────
// ─── Assessment Report Metric ──────────────────────────────────────────
function IntegratedMetric({ icon: Icon, label, value, color }) {
    return (
        <div style={{ 
            padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: '15px', 
            border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: `${color}15`, color: color }}>
                    <Icon size={16} />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{value}%</div>
            </div>
            <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ width: '100%', height: '4px', background: 'var(--bg-subtle)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }}
                        style={{ height: '100%', background: color }} 
                    />
                </div>
            </div>
        </div>
    );
}

function MetricBox({ label, value, color }) {
    return (
        <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color }}>{value}</h2>
        </div>
    );
}

function FileLink({ icon: Icon, label, url }) {
    if (!url) return (
        <div style={{ padding: '0.9rem', background: 'var(--bg-subtle)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>
            <Icon size={18} color="var(--text-secondary)" />
            <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{label}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Not uploaded</p>
            </div>
        </div>
    );
    return (
        <a href={`http://localhost:5001/${url}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '0.9rem', background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.07)'}
            >
                <Icon size={18} color="#3b82f6" />
                <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6' }}>{label}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Click to open</p>
                </div>
                <ExternalLink size={14} color="#3b82f6" style={{ marginLeft: 'auto' }} />
            </div>
        </a>
    );
}

function InfoRow({ label, value, isLink }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{label}</span>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</a>
            ) : (
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{value || '—'}</span>
            )}
        </div>
    );
}
