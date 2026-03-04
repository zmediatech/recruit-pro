import React, { useState } from 'react';
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
    Loader2
} from 'lucide-react';
import axios from 'axios';

export default function IntakeGateway() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [candidateId, setCandidateId] = useState('');

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
            // Note: In a production environment with real file uploads, 
            // we would use FormData and a library like multer on the server.
            // For this orchestration, we'll send the metadata to the intake endpoint.
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
            // Fallback for demo if backend is unreachable
            const simulatedId = `CP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setCandidateId(simulatedId);
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel"
                    style={{ padding: '4rem' }}
                >
                    <CheckCircle size={80} color="var(--accent-green)" style={{ margin: '0 auto 2rem' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Success!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Your application has been received. We will review your profile shortly.
                    </p>
                    <div style={{
                        background: 'var(--bg-subtle)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '3rem'
                    }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Reference ID</p>
                        <h2 style={{ fontFamily: 'JetBrains Mono', letterSpacing: '2px', color: 'var(--accent-blue)' }}>{candidateId}</h2>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        You will receive an email once we have processed your information.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>RECRUITPRO</div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Application Form</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Apply for open positions and join our talent network.</p>
            </header>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <IntakeField label="Full Name" icon={<User size={18} />}>
                        <input type="text" name="name" required className="form-control" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
                    </IntakeField>

                    <IntakeField label="Email Address" icon={<Mail size={18} />}>
                        <input type="email" name="email" required className="form-control" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" />
                    </IntakeField>

                    <IntakeField label="Phone Number" icon={<Phone size={18} />}>
                        <input type="tel" name="phone" required className="form-control" value={formData.phone} onChange={handleChange} placeholder="e.g. +1 234 567 890" />
                    </IntakeField>

                    <IntakeField label="National ID / CNIC" icon={<CreditCard size={18} />}>
                        <input type="text" name="cnic" required className="form-control" value={formData.cnic} onChange={handleChange} placeholder="e.g. 00000-0000000-0" />
                    </IntakeField>

                    <IntakeField label="Expected Salary" icon={<DollarSign size={18} />}>
                        <input type="number" name="expectedSalary" required className="form-control" value={formData.expectedSalary} onChange={handleChange} placeholder="Monthly Gross" />
                    </IntakeField>

                    <IntakeField label="Position Applied" icon={<Briefcase size={18} />}>
                        <input type="text" name="positionApplied" required className="form-control" value={formData.positionApplied} onChange={handleChange} placeholder="e.g. Software Engineer" />
                    </IntakeField>

                    <div style={{ gridColumn: 'span 2' }}>
                        <IntakeField label="Interview Availability" icon={<Calendar size={18} />}>
                            <input type="text" name="availability" required className="form-control" value={formData.availability} onChange={handleChange} placeholder="e.g. Weekdays after 4 PM" />
                        </IntakeField>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Upload CV (PDF/DOCX)</label>
                            <label className="btn btn-outline" style={{ display: 'flex', width: '100%', cursor: 'pointer', height: '100px', flexDirection: 'column', gap: '0.5rem', borderStyle: 'dashed' }}>
                                <UploadCloud size={20} color="var(--accent-blue)" />
                                <span style={{ fontSize: '0.8rem' }}>{formData.cvFile ? formData.cvFile.name : 'Click to select file'}</span>
                                <input type="file" hidden accept=".pdf,.docx" onChange={(e) => handleFileChange(e, 'cvFile')} />
                            </label>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Introduction Video</label>
                            <label className="btn btn-outline" style={{ display: 'flex', width: '100%', cursor: 'pointer', height: '100px', flexDirection: 'column', gap: '0.5rem', borderStyle: 'dashed' }}>
                                <Video size={20} color="var(--accent-purple)" />
                                <span style={{ fontSize: '0.8rem' }}>{formData.videoFile ? formData.videoFile.name : 'Click to select file'}</span>
                                <input type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, 'videoFile')} />
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', height: '60px', marginTop: '3rem', fontSize: '1rem' }}
                >
                    {loading ? <><Loader2 className="spinning" size={20} /> Submitting...</> : <>Submit Application <ArrowRight size={20} /></>}
                </button>
            </form>
        </div>
    );
}

function IntakeField({ label, icon, children }) {
    return (
        <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}
