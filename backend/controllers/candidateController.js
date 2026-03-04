const Candidate = require('../models/Candidate');
const { calculateMetrics } = require('../services/metrics');

// @route   POST /api/candidates/ingest
// @desc    Ingest raw candidate data, process via Integration metrics, and store vector
const ingestCandidate = async (req, res) => {
    try {
        const rawData = req.body;

        // Ensure all required fields exist
        const {
            name,
            fluidIntBaseline,
            ethicalBaseline,
            stressTelemetry,
            noWinScore,
            fluidIntStressed,
            ethicalStressed,
            evaluatorNotes,
            stage,
            scenarioSelection
        } = req.body;

        // Basic validation for required fields
        if (!name || !fluidIntBaseline || !ethicalBaseline || !stressTelemetry || !noWinScore || !fluidIntStressed || !ethicalStressed) {
            return res.status(400).json({ error: 'Missing required raw metrics for ingestion' });
        }

        // Implementation of the Stability Index (ρ)
        // Formula: ρ = 1 - (((0.4 * Dx) + (0.6 * Dy)) / ΔZ)

        const Dx = fluidIntBaseline > 0 ? (fluidIntBaseline - (fluidIntStressed || fluidIntBaseline)) / fluidIntBaseline : 0;
        const Dy = ethicalBaseline > 0 ? (ethicalBaseline - (noWinScore || ethicalBaseline)) / ethicalBaseline : 0;
        const deltaZ = (stressTelemetry || 100) / 100; // Normalized stress load

        const rho = Math.max(0, 1 - (((0.4 * Dx) + (0.6 * Dy)) / (deltaZ || 1)));

        // Final Ethical Calculation biased towards No-Win scenarios
        // Y_final = (Y_base_SJT * 0.3) + (Y_No_Win * 0.7)
        const Y_final = (ethicalBaseline * 0.3) + (noWinScore * 0.7);

        const newCandidate = new Candidate({
            name,
            candidateId: `CID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            coordinates: {
                X: fluidIntStressed || fluidIntBaseline,
                Y: Y_final,
                Z: stressTelemetry
            },
            baselineMetrics: {
                X: fluidIntBaseline,
                Y: ethicalBaseline
            },
            stressedMetrics: {
                X: fluidIntStressed,
                Y: noWinScore
            },
            rho,
            evaluatorNotes: evaluatorNotes || '',
            scenarioSelection: scenarioSelection || 'None',
            stage: stage || 'Evaluated',
            flags: []
        });

        // Red Flag Detection: Ethical Collapse
        if (ethicalBaseline > 80 && noWinScore < 30) {
            newCandidate.flags.push("ETHICAL_COLLAPSE_DETECTED: Significant delta between baseline and high-stakes choice.");
        }

        // Store
        await newCandidate.save();

        res.status(201).json(newCandidate);

    } catch (err) {
        console.error("Ingestion Error:", err);
        res.status(500).json({ error: 'Server Error during ingestion phase' });
    }
};

// @route   POST /api/candidates/intake
// @desc    Candidate self-intake gateway
const intakeCandidate = async (req, res) => {
    try {
        const { name, email, phone, cnic, expectedSalary, positionApplied, availability, cvUrl, videoUrl } = req.body;

        const candidateId = `CP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const candidate = new Candidate({
            candidateId,
            name,
            email,
            phone,
            cnic,
            expectedSalary,
            positionApplied,
            availability,
            cvUrl: cvUrl || '',
            videoUrl: videoUrl || '',
            stage: 'Intake',
            telemetryLogs: [{
                action: 'INITIAL_INTAKE_SUBMISSION',
                payload: { timestamp: new Date(), source: 'IntakeGateway' }
            }]
        });

        await candidate.save();

        // Trigger telemetry log artifact
        console.log(`TELEMETRY LOG: Candidate ${candidate.candidateId} intake finalized.`);

        res.status(201).json({
            success: true,
            candidateId: candidate.candidateId,
            message: 'Candidate intake successful. Interview workflow triggered.'
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

module.exports = { ingestCandidate, getAllCandidates, getCandidateById, intakeCandidate, performCVAnalysis };
