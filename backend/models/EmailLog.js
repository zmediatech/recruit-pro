const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
    templateType: { type: String },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['Sent', 'Failed'], default: 'Sent' },
    error: { type: String },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
