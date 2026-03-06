// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Platform Active. The Stoic Polymath Filter is running.' });
});

// MongoDB Connection (Use mock connection if no URI provided)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stoic_polymath_db';

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB: ${MONGO_URI}`);

        app.listen(PORT, () => {
            console.log(`Backend Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        console.log('Starting server anyway for mock tests (Database ops will fail if tested).');
        app.listen(PORT, () => {
            console.log(`Backend Server running on port ${PORT} without DB.`);
        });
    }
})();
