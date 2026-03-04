import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import TechnicalAssessment from './pages/TechnicalAssessment';
import GauntletPortal from './pages/GauntletPortal';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app-container">
                    <Sidebar />

                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/candidate/:id" element={<CandidateDetail />} />
                            <Route path="/ingest" element={<IngestionScreen />} />
                            <Route path="/assessment" element={<TechnicalAssessment />} />
                            <Route path="/gauntlet/:id" element={<GauntletPortal />} />
                            <Route path="/interview" element={<InterviewWizard />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/intake" element={<IntakeGateway />} />
                            <Route path="/jobs" element={<JobManager />} />
                            {/* Automated Assessment Portal */}
                            <Route path="/assess" element={<AssessmentLauncher />} />
                            {/* CV Intelligence Uplink */}
                            <Route path="/cv-upload" element={<CVUpload />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
