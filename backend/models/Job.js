const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
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
