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

// Export Data
router.get('/export', exportCandidates);

module.exports = router;
