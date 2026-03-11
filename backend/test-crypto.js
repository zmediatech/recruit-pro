const crypto = require('crypto');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.SMTP_SECRET || 'recruitpro-secure-smtp-key-32chr';
const IV_LENGTH = 16;

console.log('ENV SMTP_SECRET:', process.env.SMTP_SECRET);
console.log('KEY LENGTH:', ENCRYPTION_KEY.length);

try {
    const text = 'password123';
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const result = iv.toString('hex') + ':' + encrypted.toString('hex');
    console.log('ENCRYPTION SUCCESS:', result);

    // Test Decryption
    let textParts = result.split(':');
    let iv2 = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv2);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log('DECRYPTION SUCCESS:', decrypted.toString());
} catch (err) {
    console.error('CRYPTO ERROR:', err);
}
