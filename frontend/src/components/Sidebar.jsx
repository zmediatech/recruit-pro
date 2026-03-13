import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    Database,
    LogOut
} from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const isPortalPath = location.pathname.startsWith('/portal') || location.pathname.startsWith('/assess-portal');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
    };

    if (location.pathname === '/admin/login') return null;

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <BrainCircuit size={24} />
                <span>Recruit<span style={{ color: 'var(--accent-green)' }}>Pro</span></span>
            </div>

            <nav className="sidebar-nav">
                {isAdminPath ? (
                    <>
                        <div className="sidebar-section-label">SUPER ADMIN PANEL</div>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Control Center</span>
                        </NavLink>
                        <NavLink to="/admin/candidates" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Users size={18} />
                            <span>Candidates List</span>
                        </NavLink>
                        <NavLink to="/admin/pipeline" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Hiring Pipeline</span>
                        </NavLink>
                        <NavLink to="/admin/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Briefcase size={18} />
                            <span>Job Repository</span>
                        </NavLink>
                        <NavLink to="/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Settings size={18} />
                            <span>System Settings</span>
                        </NavLink>
                        <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </>
                ) : isPortalPath ? (
                    <>
                        <div className="sidebar-section-label">CANDIDATE PORTAL</div>
                        <NavLink to="/portal" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Briefcase size={18} />
                            <span>Open Roles</span>
                        </NavLink>
                        <NavLink to="/assess-portal" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Gamepad2 size={18} />
                            <span>Active Assessments</span>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <div className="sidebar-section-label">OPERATIONS</div>
                        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Overview</span>
                        </NavLink>
                        <NavLink to="/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Briefcase size={18} />
                            <span>Job Manager</span>
                        </NavLink>
                        <NavLink to="/assess" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <Gamepad2 size={18} />
                            <span>Assessment Center</span>
                        </NavLink>
                        <NavLink to="/cv-upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                            <UploadCloud size={18} />
                            <span>AI Resumes</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                {!isAdminPath && !isPortalPath && (
                    <NavLink to="/admin/login" className="sidebar-link">
                        <ShieldCheck size={18} />
                        <span>Admin Access</span>
                    </NavLink>
                )}

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
                    }}>{isAdminPath ? 'ADMIN ENCRYPTED' : 'SYSTEM STATUS'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--accent-green)',
                            boxShadow: '0 0 10px var(--accent-green)'
                        }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
