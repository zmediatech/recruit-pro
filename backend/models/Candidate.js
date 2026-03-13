const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    cnic: {
        type: String,
        trim: true
    },
    expectedSalary: {
        type: Number
    },
    positionApplied: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    portfolio: {
        type: String,
        trim: true
    },
    availability: {
        type: String,
        trim: true
    },
    cvUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    rawScores: {
        fluidIntBaseline: { type: Number, default: 0 },
        ethicalBaseline: { type: Number, default: 0 },
        stressTelemetry: { type: Number, default: 0 },
        noWinScore: { type: Number, default: 0 },
        fluidIntStressed: { type: Number, default: 0 },
        ethicalStressed: { type: Number, default: 0 }
    },
    coordinates: {
        X: { type: Number, default: 0 }, // Intelligence
        Y: { type: Number, default: 0 }, // Ethics
        Z: { type: Number, default: 0 }  // Resilience
    },
    baselineMetrics: {
        X: { type: Number, default: 0 },
        Y: { type: Number, default: 0 }
    },
    stressedMetrics: {
        X: { type: Number, default: 0 },
        Y: { type: Number, default: 0 }
    },
    rho: {
        type: Number,
        default: 1.0
    }, // Pressure Cooker Coefficient
    flags: [{
        type: String
    }],
    evaluatorNotes: {
        type: String,
        default: ''
    },
    scenarioSelection: {
        type: String,
        default: 'None'
    },
    status: {
        type: String,
        default: 'Pending'
    },
    stage: {
        type: String,
        enum: ['Applied', 'Assessment Completed', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Offer Sent', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    interviewDetails: {
        date: String,
        time: String,
        link: String,
        type: { type: String, enum: ['Online', 'Physical'] },
        notes: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    aiAnalysis: {
        skillMatch: { type: Number, default: 0 },
        experienceDepth: String,
        missingCompetencies: [String],
        suitabilityScore: { type: Number, default: 0 },
        riskSignals: [String],
        summary: String,
        analyzedAt: Date
    },
    technicalAssessment: {
        role: String,
        questions: [{
            questionText: String,
            type: { type: String, enum: ['MCQ', 'ShortAnswer', 'Scenario'] },
            options: [String], // For MCQs
            correctAnswer: String,
            candidateAnswer: String,
            score: { type: Number, default: 0 },
            feedback: String
        }],
        overallScore: { type: Number, default: 0 },
        evaluationSummary: String,
        strengths: [String],
        weaknesses: [String],
        recommendedLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'N/A'], default: 'N/A' },
        completedAt: Date
    },
    telemetryLogs: [{
        timestamp: { type: Date, default: Date.now },
        action: String,
        payload: mongoose.Schema.Types.Mixed
    }]
});

module.exports = mongoose.model('Candidate', candidateSchema);
