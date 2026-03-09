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
const authMiddleware = require('../middleware/authMiddleware');
const { sendTestEmail } = require('../services/emailService');

// Export Data
router.get('/export', exportCandidates);

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
        res.status(500).json({ success: false, error: err.message });
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
