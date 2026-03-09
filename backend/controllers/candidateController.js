const Candidate = require('../models/Candidate');
const { calculateMetrics } = require('../services/metrics');
const { sendConfirmationEmail } = require('../services/emailService');

// @route   POST /api/candidates/ingest
// @route   POST /api/candidates/:id/ingest
// @desc    Ingest assessment data and update candidate profile
const ingestCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            positionApplied,
            fluidIntBaseline,
            ethicalBaseline,
            stressTelemetry,
            noWinScore,
            fluidIntStressed,
            ethicalStressed,
            evaluatorNotes,
            stage
        } = req.body;

        // Basic validation
        if (!name || fluidIntBaseline === undefined || ethicalBaseline === undefined) {
            return res.status(400).json({ error: 'Missing required metrics for assessment ingestion' });
        }

        const Dx = fluidIntBaseline > 0 ? (fluidIntBaseline - (fluidIntStressed || fluidIntBaseline)) / fluidIntBaseline : 0;
        const Dy = ethicalBaseline > 0 ? (ethicalBaseline - (noWinScore || ethicalBaseline)) / ethicalBaseline : 0;
        const deltaZ = (stressTelemetry || 100) / 100;
        const rho = Math.max(0, 1 - (((0.4 * Dx) + (0.6 * Dy)) / (deltaZ || 1)));
        const Y_final = (ethicalBaseline * 0.3) + (noWinScore * 0.7);

        const updateData = {
            name,
            positionApplied,
            coordinates: {
                X: fluidIntStressed || fluidIntBaseline,
                Y: Y_final,
                Z: stressTelemetry
            },
            baselineMetrics: { X: fluidIntBaseline, Y: ethicalBaseline },
            stressedMetrics: { X: fluidIntStressed, Y: noWinScore },
            rho,
            evaluatorNotes: evaluatorNotes || 'Assessment completed.',
            stage: stage || 'Evaluated',
            flags: []
        };

        if (ethicalBaseline > 80 && noWinScore < 30) {
            updateData.flags.push("Notice: Significant delta between baseline and high-stakes choice.");
        }

        let candidate;
        if (id) {
            candidate = await Candidate.findByIdAndUpdate(id, updateData, { new: true });
        } else {
            updateData.candidateId = `CID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            candidate = new Candidate(updateData);
            await candidate.save();
        }

        if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
        res.status(200).json(candidate);

    } catch (err) {
        console.error("Ingestion Error:", err);
        res.status(500).json({ error: 'Server Error during assessment processing' });
    }
};

// @route   POST /api/candidates/intake
// @desc    Candidate self-intake gateway
const intakeCandidate = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            cnic,
            expectedSalary,
            positionApplied,
            location,
            linkedin,
            portfolio,
            availability,
            cvUrl,
            videoUrl
        } = req.body;

        const candidateId = `CP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const candidate = new Candidate({
            candidateId,
            name,
            email,
            phone,
            cnic,
            expectedSalary,
            positionApplied,
            location,
            linkedin,
            portfolio,
            availability,
            cvUrl: cvUrl || '',
            videoUrl: videoUrl || '',
            stage: 'Intake',
            telemetryLogs: [{
                action: 'INITIAL_PORTAL_SUBMISSION',
                payload: { timestamp: new Date(), source: 'CandidatePortal' }
            }]
        });

        await candidate.save();

        // Send Confirmation Email (Async - don't block response)
        sendConfirmationEmail(candidate).catch(err => console.error("Auto-email failed:", err));

        res.status(201).json({
            success: true,
            id: candidate._id,
            candidateId: candidate.candidateId,
            message: 'Candidate intake successful.'
        });
    } catch (err) {
        console.error("Intake Error:", err);
        res.status(500).json({ error: 'Failed to process candidate intake.' });
    }
};

// @route   GET /api/candidates
// @desc    Retrieve all candidates for telemetry dashboard
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ 'coordinates.X': -1, 'coordinates.Y': -1 });
        res.status(200).json(candidates);
    } catch (err) {
        console.error("Fetch DB Error:", err);
        res.status(500).json({ error: 'Failed to retrieve telemetry data.' });
    }
};

// @route   GET /api/candidates/:id
// @desc    Retrieve a single candidate's detailed profile
const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ error: 'Subject not found.' });
        res.status(200).json(candidate);
    } catch (err) {
        console.error("Fetch DB Error:", err);
        res.status(500).json({ error: 'Failed to retrieve specific candidate data.' });
    }
};

const { analyzeCV, generateAdaptiveTest } = require('../services/geminiService');
const { extractPdfText } = require('../services/pdfService');

// @route   POST /api/candidates/:id/analyze
// @desc    Trigger AI analysis for an uploaded CV
const performCVAnalysis = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ error: 'Subject not found.' });

        // In a real app, we'd read from candidate.cvUrl (S3/Disk)
        // For this orchestration, we'll simulate the text extraction
        // if no real file exists, otherwise we'd use extractPdfText
        const mockCVText = `Experienced Engineer with skills in React, Node.js, and Distributed Systems. 8 years of lead experience.`;

        const analysis = await analyzeCV(mockCVText, candidate.positionApplied);

        candidate.aiAnalysis = {
            ...analysis,
            analyzedAt: new Date()
        };

        // Generate dynamic questions
        const adaptiveQuestions = await generateAdaptiveTest(mockCVText, candidate.positionApplied);

        candidate.telemetryLogs.push({
            action: 'GEMINI_AI_ANALYSIS_COMPLETED',
            payload: { analysis, questionsCount: adaptiveQuestions.length }
        });

        await candidate.save();

        res.json({ success: true, aiAnalysis: candidate.aiAnalysis, questions: adaptiveQuestions });
    } catch (err) {
        console.error("AI Analysis Route Error:", err);
        res.status(500).json({ error: 'Failed to orchestrate AI analysis.' });
    }
};

const XLSX = require('xlsx');

// @route   GET /api/admin/export
// @desc    Export candidate data to Excel
const exportCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().lean();

        const data = candidates.map(c => ({
            'Candidate ID': c.candidateId,
            'Name': c.name,
            'Email': c.email,
            'Phone': c.phone,
            'Role': c.positionApplied,
            'Location': c.location || 'N/A',
            'Intelligence (X)': c.coordinates?.X || 0,
            'Ethics (Y)': c.coordinates?.Y || 0,
            'Resilience (Z)': c.coordinates?.Z || 0,
            'Pressure Coeff (ρ)': c.rho || 1,
            'Stage': c.stage,
            'Created At': new Date(c.createdAt).toLocaleString()
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Candidates');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=RecruitPro_Candidates_Export.xlsx');
        res.send(buffer);
    } catch (err) {
        console.error("Export Error:", err);
        res.status(500).json({ error: 'Failed to generate Excel export.' });
    }
};

module.exports = {
    ingestCandidate,
    getAllCandidates,
    getCandidateById,
    intakeCandidate,
    performCVAnalysis,
    exportCandidates
};
