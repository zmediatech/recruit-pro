const mongoose = require('mongoose');
const crypto = require('crypto');

// ENCRYPTION KEY & IV (In a real app, these should be in .env)
const ENCRYPTION_KEY = process.env.SMTP_SECRET || 'recruitpro-secure-smtp-key-32chr'; // Must be 32 chars
const IV_LENGTH = 16;

const smtpConfigSchema = new mongoose.Schema({
    host: { type: String, required: true },
    port: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Store encrypted
    encryption: { type: String, enum: ['TLS', 'SSL', 'None'], default: 'TLS' },
    fromEmail: { type: String, required: true },
    fromName: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Encryption Helper
smtpConfigSchema.statics.encrypt = function (text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Decryption Helper
smtpConfigSchema.statics.decrypt = function (text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports = mongoose.model('SmtpConfig', smtpConfigSchema);
