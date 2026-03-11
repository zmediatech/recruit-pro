const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    systemName: {
        type: String,
        default: 'RecruitPro System'
    },
    companyName: {
        type: String,
        default: 'RecruitPro Inc.'
    },
    companyEmail: {
        type: String,
        default: 'hr@recruitpro.com'
    },
    companyPhone: {
        type: String,
        default: '+1-800-RECRUIT'
    },
    companyAddress: {
        type: String,
        default: '123 Recruitment Ave, Tech District'
    },
    timeZone: {
        type: String,
        default: 'UTC'
    },
    defaultLanguage: {
        type: String,
        default: 'English'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update timestamp
systemSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
