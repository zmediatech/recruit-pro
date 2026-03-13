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
import CandidatesList from './pages/CandidatesList';
import HiringPipeline from './pages/HiringPipeline';
import GeneralSettings from './pages/GeneralSettings';
import SmtpSettingsPage from './pages/SmtpSettingsPage';
import TemplateSettingsPage from './pages/TemplateSettingsPage';
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
                            <Route path="/" element={<Navigate to="/portal" replace />} />
                            <Route path="/portal" element={<CandidatePortal />} />
                            <Route path="/assess-portal" element={<CandidateAssessmentPortal />} />
                            <Route path="/jobs/:id" element={<JobDetail />} />

                            {/* Super Admin Panel (Private) */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                            <Route path="/admin/dashboard" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/candidates" element={
                                <ProtectedRoute>
                                    <CandidatesList />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/pipeline" element={
                                <ProtectedRoute>
                                    <HiringPipeline />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/jobs" element={
                                <ProtectedRoute>
                                    <JobManager />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/jobs/:id" element={
                                <ProtectedRoute>
                                    <JobDetail />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/candidate/:id" element={
                                <ProtectedRoute>
                                    <CandidateDetail />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/cv-upload" element={
                                <ProtectedRoute>
                                    <CVUpload />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/settings" element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/assess" element={
                                <ProtectedRoute>
                                    <AssessmentLauncher />
                                </ProtectedRoute>
                            } />

                            {/* Internal Operation Tools (Legacy Path Support - Protected) */}
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/candidate/:id" element={<ProtectedRoute><CandidateDetail /></ProtectedRoute>} />
                            <Route path="/ingest" element={<ProtectedRoute><IngestionScreen /></ProtectedRoute>} />
                            <Route path="/assessment" element={<ProtectedRoute><TechnicalAssessment /></ProtectedRoute>} />
                            <Route path="/gauntlet/:id" element={<ProtectedRoute><GauntletPortal /></ProtectedRoute>} />
                            <Route path="/interview" element={<ProtectedRoute><InterviewWizard /></ProtectedRoute>} />
                            <Route path="/intake" element={<ProtectedRoute><IntakeGateway /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
