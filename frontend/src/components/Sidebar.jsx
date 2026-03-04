import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    Gamepad2,
    ShieldCheck,
    Settings,
    BrainCircuit,
    UploadCloud,
    UserPlus,
    Briefcase,
    Database
} from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <BrainCircuit size={24} />
                <span>Recruit<span style={{ color: 'var(--accent-green)' }}>Pro</span></span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={18} />
                    <span>Recruitment Overview</span>
                </NavLink>

                <NavLink to="/intake" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <UserPlus size={18} />
                    <span>Candidate Form</span>
                </NavLink>

                <NavLink to="/ingest" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Database size={18} />
                    <span>Add Candidate</span>
                </NavLink>

                <NavLink to="/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Briefcase size={18} />
                    <span>Job Manager</span>
                </NavLink>

                <NavLink to="/interview" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <ShieldCheck size={18} />
                    <span>Interview Guides</span>
                </NavLink>

                <NavLink to="/assess" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Gamepad2 size={18} />
                    <span>Assessment Center</span>
                </NavLink>

                <NavLink to="/cv-upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <UploadCloud size={18} />
                    <span>Scan Resume</span>
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <Settings size={18} />
                    <span>Settings</span>
                </NavLink>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem',
                        fontWeight: 700
                    }}>System Status</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--accent-green)',
                            boxShadow: '0 0 10px var(--accent-green)'
                        }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
