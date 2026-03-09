const nodemailer = require('nodemailer');
const SmtpConfig = require('../models/SmtpConfig');

/**
 * Get the current SMTP transporter configuration.
 */
async function getTransporter() {
    const config = await SmtpConfig.findOne();
    if (!config) return null;

    const password = SmtpConfig.decrypt(config.password);

    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465, // SSL
        auth: {
            user: config.username,
            pass: password
        },
        tls: {
            rejectUnauthorized: config.encryption !== 'None'
        }
    });
}

/**
 * Send a generic email.
 */
async function sendEmail({ to, subject, html, text }) {
    const config = await SmtpConfig.findOne();
    if (!config) {
        console.warn("SMTP not configured. Email NOT sent.");
        return { success: false, error: "SMTP not configured" };
    }

    try {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to,
            subject,
            text: text || "This is an automated notification from RecruitPro.",
            html
        });
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error("Email send failed:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Send application confirmation to candidate.
 */
async function sendConfirmationEmail(candidate) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">Application Received</h2>
            <p>Hello <strong>${candidate.name}</strong>,</p>
            <p>Thank you for applying for the position of <strong>${candidate.positionApplied}</strong> at our organization.</p>
            <p>Our AI orchestration engine is currently processing your assessment results. We will contact you if your profile matches our requirements.</p>
            <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 0.9rem; color: #64748b;">
                Candidate ID: ${candidate.candidateId || candidate._id}
            </div>
            <p style="margin-top: 30px; font-size: 0.8rem; color: #94a3b8;">This is an automated message. Please do not reply.</p>
        </div>
    `;
    return sendEmail({
        to: candidate.email,
        subject: `Application Confirmation - ${candidate.positionApplied}`,
        html
    });
}

/**
 * Send test email.
 */
async function sendTestEmail(targetEmail) {
    const html = `
        <div style="font-family: sans-serif; padding: 20px; text-align: center; background: #f0fdf4; border: 1px solid #10b981; border-radius: 12px;">
            <h1 style="color: #10b981;">SMTP Sync Successful</h1>
            <p style="font-size: 1.1rem;">RecruitPro has successfully established a secure connection to your mail server.</p>
            <p style="color: #6b7280; margin-top: 2rem;">Timestamp: ${new Date().toLocaleString()}</p>
        </div>
    `;
    return sendEmail({
        to: targetEmail,
        subject: "RecruitPro SMTP Connection Test",
        html
    });
}

module.exports = {
    sendEmail,
    sendConfirmationEmail,
    sendTestEmail
};
