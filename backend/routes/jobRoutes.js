const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @route   GET /api/jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job details' });
    }
});

// @route   POST /api/jobs
router.post('/', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// @route   DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

module.exports = router;
