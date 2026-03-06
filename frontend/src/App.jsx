import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CandidateDetail from './pages/CandidateDetail';
import IngestionScreen from './pages/IngestionScreen';
import InterviewWizard from './pages/InterviewWizard';
import Sidebar from './components/Sidebar';
import AssessmentLauncher from './pages/AssessmentLauncher';
import CVUpload from './pages/CVUpload';
import Settings from './pages/Settings';
import IntakeGateway from './pages/IntakeGateway';
import JobManager from './pages/JobManager';
import JobDetail from './pages/JobDetail';
import TechnicalAssessment from './pages/TechnicalAssessment';
import GauntletPortal from './pages/GauntletPortal';
import CandidatePortal from './pages/CandidatePortal';
import CandidateAssessmentPortal from './pages/CandidateAssessmentPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/admin/login" />;
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app-container">
                    <Sidebar />

                    <main className="main-content">
                        <Routes>
                            {/* Candidate Panel (Public) */}
                            <Route path="/portal" element={<CandidatePortal />} />
                            <Route path="/assess-portal" element={<CandidateAssessmentPortal />} />

                            {/* Legacy Routes / Catch-alls */}
                            <Route path="/intake" element={<IntakeGateway />} />
                            <Route path="/jobs" element={<JobManager />} />
                            <Route path="/jobs/:id" element={<JobDetail />} />
                            <Route path="/cv-upload" element={<CVUpload />} />

                            {/* Super Admin Panel (Private) */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            {/* Internal Tooling Routes */}
                            <Route path="/" element={<Navigate to="/portal" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/candidate/:id" element={<CandidateDetail />} />
                            <Route path="/ingest" element={<IngestionScreen />} />
                            <Route path="/assessment" element={<TechnicalAssessment />} />
                            <Route path="/gauntlet/:id" element={<GauntletPortal />} />
                            <Route path="/interview" element={<InterviewWizard />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/assess" element={<AssessmentLauncher />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
