const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, unique: true }, // slug like 'application_confirmation'
    subject: { type: String, required: true },
    body: { type: String, required: true }, // HTML/Text content
    variables: [{ type: String }], // List of supported variables for UI reference
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
