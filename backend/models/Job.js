const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    locationType: {
        type: String,
        enum: ['In person', 'Remote', 'Hybrid'],
        default: 'In person'
    },
    location: {
        type: String,
        trim: true
    },
    timeline: {
        type: String,
        trim: true
    },
    peopleToHire: {
        type: Number,
        default: 1
    },
    jobType: {
        type: [String], // Can be multiple like Full-time + Temporary
        default: ['Full-time']
    },
    pay: {
        showBy: { type: String, default: 'Range' },
        min: { type: Number },
        max: { type: Number },
        rate: { type: String, default: 'per hour' }
    },
    department: {
        type: String,
        trim: true,
        default: 'General'
    },
    status: {
        type: String,
        enum: ['Active', 'Draft', 'Closed'],
        default: 'Active'
    },
    technicalParameters: {
        minIQ: { type: Number, default: 70 },
        minEthics: { type: Number, default: 70 },
        minResilience: { type: Number, default: 70 }
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
