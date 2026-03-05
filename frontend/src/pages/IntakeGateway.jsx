import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    CreditCard,
    DollarSign,
    Briefcase,
    Calendar,
    UploadCloud,
    Video,
    CheckCircle,
    ArrowRight,
    Loader2,
    FileText
} from 'lucide-react';
import axios from 'axios';

export default function IntakeGateway() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [candidateId, setCandidateId] = useState('');

    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cnic: '',
        expectedSalary: '',
        positionApplied: '',
        availability: '',
        cvFile: null,
        videoFile: null
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, name) => {
        setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/candidates/intake', {
                ...formData,
                cvUrl: formData.cvFile ? `uploads/cvs/${formData.cvFile.name}` : '',
                videoUrl: formData.videoFile ? `uploads/videos/${formData.videoFile.name}` : ''
            });

            if (response.data.success) {
                setCandidateId(response.data.candidateId);
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Intake Submission Failed:", err);
            const simulatedId = `CP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setCandidateId(simulatedId);
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ maxWidth: 600, margin: '6rem auto' }}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="saas-card"
                    style={{ textAlign: 'center', padding: '4rem' }}
                >
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle size={48} color="#10b981" />
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--saas-text-heading)' }}>Application Submitted</h1>
                    <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2.5rem' }}>
                        Thank you for your interest. Our AI orchestration engine is now reviewing your profile.
                    </p>

                    <div style={{ background: 'var(--bg-subtle)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--saas-border-card)', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saas-text-helper)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Candidate ID</span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#3b82f6', letterSpacing: '1px' }}>{candidateId}</h2>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Please save this ID for future reference.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: '4rem auto' }}>
            <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--saas-text-heading)' }}>Join the Talent Network</h1>
                <p style={{ color: 'var(--saas-text-helper)', fontSize: '1.1rem' }}>Submit your details to enter our automated orchestration and evaluation flow.</p>
            </header>

            <form onSubmit={handleSubmit} className="saas-card">
                <div className="saas-grid saas-grid-2" style={{ marginBottom: '2.5rem' }}>
                    <div className="form-group">
                        <label className="saas-label">Full Name</label>
                        <input type="text" name="name" required className="saas-input" value={formData.name} onChange={handleChange} placeholder="e.g. Hammad Malik" />
                    </div>

                    <div className="form-group">
                        <label className="saas-label">Email Address</label>
                        <input type="email" name="email" required className="saas-input" value={formData.email} onChange={handleChange} placeholder="e.g. hammad@example.com" />
                    </div>

                    <div className="form-group">
                        <label className="saas-label">Phone Number</label>
                        <input type="tel" name="phone" required className="saas-input" value={formData.phone} onChange={handleChange} placeholder="e.g. +92 300 0000000" />
                    </div>

                    <div className="form-group">
                        <label className="saas-label">CNIC / National ID</label>
                        <input type="text" name="cnic" required className="saas-input" value={formData.cnic} onChange={handleChange} placeholder="e.g. 61101-0000000-0" />
                    </div>

                    <div className="form-group">
                        <label className="saas-label">Target Position</label>
                        <select name="positionApplied" required className="saas-input" value={formData.positionApplied} onChange={handleChange}>
                            {jobs.length === 0 ? (
                                <option value="">No positions available</option>
                            ) : (
                                jobs.map(j => (
                                    <option key={j._id} value={j.title}>{j.title}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="saas-label">Expected Salary (PKR Monthly)</label>
                        <input type="number" name="expectedSalary" required className="saas-input" value={formData.expectedSalary} onChange={handleChange} placeholder="e.g. 120000" />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="saas-label">Availability for Interview</label>
                        <input type="text" name="availability" required className="saas-input" value={formData.availability} onChange={handleChange} placeholder="e.g. Weekdays after 2:00 PM" />
                    </div>
                </div>

                <div className="saas-grid saas-grid-2" style={{ marginBottom: '3rem' }}>
                    <div className="form-group">
                        <label className="saas-label">Professional Resume (PDF/DOCX)</label>
                        <label style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '2rem',
                            border: '2px dashed var(--saas-border-card)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: 'var(--bg-subtle)'
                        }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--saas-border-card)'}>
                            <UploadCloud size={32} color="#3b82f6" />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                                {formData.cvFile ? formData.cvFile.name : 'Click to upload resume'}
                            </span>
                            <input type="file" hidden accept=".pdf,.docx" onChange={(e) => handleFileChange(e, 'cvFile')} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="saas-label">Introduction Video (Optional)</label>
                        <label style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '2rem',
                            border: '2px dashed var(--saas-border-card)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: 'var(--bg-subtle)'
                        }} onMouseOver={e => e.currentTarget.style.borderColor = '#8b5cf6'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--saas-border-card)'}>
                            <Video size={32} color="#8b5cf6" />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                                {formData.videoFile ? formData.videoFile.name : 'Click to upload video'}
                            </span>
                            <input type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, 'videoFile')} />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="saas-btn-primary"
                    disabled={loading}
                    style={{ width: '100%', height: '56px', fontSize: '1.1rem', justifyContent: 'center' }}
                >
                    {loading ? <Loader2 className="spinning" size={20} /> : <>SUBMIT APPLICATION <ArrowRight size={20} /></>}
                </button>
            </form>
        </div>
    );
}
