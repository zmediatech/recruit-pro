const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'recruit-pro-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            admin: { username: admin.username, role: admin.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create Initial Admin (Seed - for development)
router.post('/seed', async (req, res) => {
    try {
        const existing = await Admin.findOne({ username: 'admin' });
        if (existing) return res.json({ message: 'Admin already exists' });

        const admin = new Admin({ username: 'admin', password: 'password123' });
        await admin.save();
        res.json({ success: true, message: 'Admin created: admin / password123' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const { exportCandidates } = require('../controllers/candidateController');
const SmtpConfig = require('../models/SmtpConfig');
const EmailTemplate = require('../models/EmailTemplate');
const EmailLog = require('../models/EmailLog');
const Candidate = require('../models/Candidate');
const SystemSettings = require('../models/SystemSettings');
const authMiddleware = require('../middleware/authMiddleware');
const { sendTestEmail, sendInterviewEmail } = require('../services/emailService');

// Export Data
router.get('/export', exportCandidates);

// Get Public System Info (Theme, Name, etc)
router.get('/system-info', async (req, res) => {
    try {
        const settings = await SystemSettings.findOne();
        res.json({ 
            success: true, 
            theme: settings?.theme || 'dark',
            systemName: settings?.systemName || 'RecruitPro'
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get System Settings
router.get('/system-settings', authMiddleware, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update System Settings
router.post('/system-settings', authMiddleware, async (req, res) => {
    try {
        const updateData = req.body;
        let settings = await SystemSettings.findOne();

        if (settings) {
            settings = await SystemSettings.findByIdAndUpdate(settings._id, updateData, { new: true });
        } else {
            settings = await SystemSettings.create(updateData);
        }

        res.json({ success: true, message: 'Settings saved successfully', settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- SMTP CONFIGURATION ROUTES ---

// Get SMTP Settings
router.get('/smtp', authMiddleware, async (req, res) => {
    try {
        const config = await SmtpConfig.findOne();
        if (!config) return res.json({ success: true, config: null });

        // Mask password
        const maskedConfig = config.toObject();
        maskedConfig.password = '********';

        res.json({ success: true, config: maskedConfig });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Save/Update SMTP Settings
router.post('/smtp', authMiddleware, async (req, res) => {
    try {
        const { host, port, username, password, encryption, fromEmail, fromName } = req.body;
        console.log("POST SMTP Request:", { host, port, username, encryption, fromEmail, fromName });

        let config = await SmtpConfig.findOne();
        let encryptedPassword = password;

        // If password is '********', it means it hasn't changed
        if (password === '********' && config) {
            encryptedPassword = config.password;
        } else {
            encryptedPassword = SmtpConfig.encrypt(password);
        }

        if (config) {
            config.host = host;
            config.port = port;
            config.username = username;
            config.password = encryptedPassword;
            config.encryption = encryption;
            config.fromEmail = fromEmail;
            config.fromName = fromName;
            config.updatedAt = Date.now();
            await config.save();
        } else {
            config = new SmtpConfig({
                host, port, username, password: encryptedPassword, encryption, fromEmail, fromName
            });
            await config.save();
        }

        res.json({ success: true, message: 'SMTP settings updated successfully' });
    } catch (err) {
        console.error("POST SMTP Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- EMAIL TEMPLATE ROUTES ---

// Get all templates
router.get('/templates', authMiddleware, async (req, res) => {
    try {
        let templates = await EmailTemplate.find();

        // Seed if empty
        if (templates.length === 0) {
            templates = await EmailTemplate.insertMany([
                {
                    name: 'Application Confirmation',
                    type: 'application_confirmation',
                    subject: 'Application Received \u2013 Thank You for Applying',
                    body: 'Dear {candidate_name},\n\nThank you for submitting your application for the {job_title} position.\n\nWe have successfully received your application along with your assessment details. Our recruitment team will carefully review your profile and evaluation results.\n\nIf your qualifications match our requirements, we will contact you regarding the next steps in the hiring process.\n\nThank you for your interest in joining our team.\n\nBest regards,\nRecruitment Team',
                    variables: ['candidate_name', 'job_title']
                },
                {
                    name: 'Interview Invitation',
                    type: 'interview_scheduling',
                    subject: 'Interview Invitation – {job_title}',
                    body: 'Hello {candidate_name},\n\nCongratulations!\n\nYou have been shortlisted for the next stage. Your interview is scheduled for:\n\nDate: {interview_date}\nTime: {interview_time}\nLink: {interview_link}\n\nBest regards,\nRecruitment Team',
                    variables: ['candidate_name', 'job_title', 'interview_date', 'interview_time', 'interview_link']
                }
            ]);
        }

        res.json({ success: true, templates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update a template
router.put('/templates/:id', authMiddleware, async (req, res) => {
    try {
        const { subject, body } = req.body;
        const template = await EmailTemplate.findByIdAndUpdate(
            req.params.id,
            { subject, body, updatedAt: Date.now() },
            { new: true }
        );
        res.json({ success: true, template });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- INTERVIEW SCHEDULING ---

router.post('/candidates/:id/schedule', authMiddleware, async (req, res) => {
    try {
        const { interviewDate, interviewTime, interviewLink, interviewType, notes } = req.body;

        if (!interviewDate || !interviewTime) {
            return res.status(400).json({ success: false, message: 'Interview date and time are required.' });
        }

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

        // Update candidate with interview details
        const interviewDetails = {
            date: interviewDate,
            time: interviewTime,
            link: interviewLink || '',
            type: interviewType || 'Online',
            notes: notes || ''
        };

        candidate.interviewDetails = interviewDetails;
        candidate.stage = 'Interview Scheduled';   // Correct field used by the frontend
        candidate.status = 'Interview Scheduled';   // Keep both in sync
        await candidate.save();

        // Send Email (non-blocking for response speed)
        const emailResult = await sendInterviewEmail(candidate, interviewDetails);

        res.json({
            success: true,
            message: 'Interview scheduled and invitation email sent!',
            interviewDetails,
            emailSent: emailResult?.success || false
        });
    } catch (err) {
        console.error("Scheduling error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Test SMTP Connection
router.post('/smtp/test', authMiddleware, async (req, res) => {
    try {
        const { testEmail } = req.body;
        if (!testEmail) return res.status(400).json({ success: false, message: 'Test email is required' });

        const result = await sendTestEmail(testEmail);
        if (result.success) {
            res.json({ success: true, message: 'Test email sent successfully!' });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
