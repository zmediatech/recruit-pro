const nodemailer = require('nodemailer');
const SmtpConfig = require('../models/SmtpConfig');
const EmailTemplate = require('../models/EmailTemplate');
const EmailLog = require('../models/EmailLog');

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
 * Process template variables.
 */
function processTemplate(text, data) {
    if (!text) return "";
    return text.replace(/{(\w+)}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

/**
 * Send a generic email and log it.
 */
async function sendEmail({ to, subject, html, text, candidateId, templateId, templateType }) {
    const config = await SmtpConfig.findOne();
    if (!config) {
        console.warn("SMTP not configured. Email NOT sent.");
        return { success: false, error: "SMTP not configured" };
    }

    let status = 'Sent';
    let error = null;

    try {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to,
            subject,
            text: text || "This is an automated notification from RecruitPro.",
            html
        });

        // Log the email
        await EmailLog.create({
            candidateId,
            templateId,
            templateType,
            recipient: to,
            subject,
            status: 'Sent'
        });

        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error("Email send failed:", err);

        // Log the failure
        await EmailLog.create({
            candidateId,
            templateId,
            templateType,
            recipient: to,
            subject,
            status: 'Failed',
            error: err.message
        });

        return { success: false, error: err.message };
    }
}

/**
 * Send application confirmation using template.
 */
async function sendConfirmationEmail(candidate) {
    try {
        let template = await EmailTemplate.findOne({ type: 'application_confirmation' });

        // Anti-fragility: Seed if not found immediately
        if (!template) {
            template = await EmailTemplate.create({
                name: 'Application Confirmation',
                type: 'application_confirmation',
                subject: 'Application Received \u2013 Thank You for Applying',
                body: `Dear {candidate_name},

Thank you for submitting your application for the {job_title} position.

We have successfully received your application along with your assessment details. Our recruitment team will carefully review your profile and evaluation results.

If your qualifications match our requirements, we will contact you regarding the next steps in the hiring process.

Thank you for your interest in joining our team.

Best regards,
Recruitment Team`,
                variables: ['candidate_name', 'job_title']
            });
        }

        const data = {
            candidate_name: candidate.name,
            job_title: candidate.positionApplied,
            company_name: 'RecruitPro' // Hardcoded or from config
        };

        let subject = `Application Received - ${candidate.positionApplied}`;
        let html = "";

        if (template) {
            subject = processTemplate(template.subject, data);
            // Convert plain-text body to HTML preserving line breaks
            const bodyText = processTemplate(template.body, data);
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px; background: #ffffff;">
                    <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px;">
                        <h2 style="color: #1e293b; margin: 0; font-size: 22px;">Application Received</h2>
                    </div>
                    <div style="color: #374151; font-size: 15px; line-height: 1.8; white-space: pre-line;">${bodyText}</div>
                    <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #94a3b8;">
                        This is an automated message. Please do not reply directly to this email.
                    </div>
                </div>
            `;
        } else {
            // Hard fallback
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
                    <p>Dear ${candidate.name},</p>
                    <p>Thank you for submitting your application for the ${candidate.positionApplied} position.</p>
                    <p>We have successfully received your application. Our recruitment team will review your profile shortly.</p>
                    <p>Best regards,<br/>Recruitment Team</p>
                </div>
            `;
        }

        return sendEmail({
            to: candidate.email,
            subject,
            html,
            candidateId: candidate._id,
            templateId: template?._id,
            templateType: 'application_confirmation'
        });
    } catch (err) {
        console.error("Confirmation email error:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Send interview invitation using template.
 */
async function sendInterviewEmail(candidate, interviewData) {
    try {
        let template = await EmailTemplate.findOne({ type: 'interview_scheduling' });

        // Anti-fragility: Seed with user's exact template if not found
        if (!template) {
            template = await EmailTemplate.create({
                name: 'Interview Invitation',
                type: 'interview_scheduling',
                subject: 'Interview Invitation \u2013 {job_title}',
                body: `Dear {candidate_name},

Congratulations! You have been shortlisted for the interview for the position of {job_title} at {company_name}.

Interview Details:
Date: {interview_date}
Time: {interview_time}
Google Meet: {interview_link}

Please join the meeting 5 minutes before the scheduled time.

Best regards,
{admin_name}
{admin_position}
{company_name}`,
                variables: ['candidate_name', 'job_title', 'company_name', 'interview_date', 'interview_time', 'interview_link', 'admin_name', 'admin_position']
            });
        }

        const data = {
            candidate_name: candidate.name,
            job_title: candidate.positionApplied || 'the applied position',
            company_name: interviewData.company_name || 'RecruitPro',
            interview_date: interviewData.date,
            interview_time: interviewData.time,
            interview_link: interviewData.link || 'To be shared separately',
            interview_type: interviewData.type,
            admin_name: interviewData.admin_name || 'HR Team',
            admin_position: interviewData.admin_position || 'Recruitment Manager',
            notes: interviewData.notes || ''
        };

        const subject = processTemplate(template.subject, data);

        // Convert plain-text body to branded HTML
        const bodyText = processTemplate(template.body, data);
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">Interview Invitation</h1>
                    <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">${data.company_name}</p>
                </div>
                <div style="padding: 36px 30px;">
                    <div style="white-space: pre-line; color: #374151; font-size: 15px; line-height: 1.9;">${bodyText}</div>
                    ${data.notes ? `<div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 6px; font-size: 13px; color: #475569;"><strong>Additional Notes:</strong><br/>${data.notes}</div>` : ''}
                </div>
                <div style="padding: 20px 30px; background: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #94a3b8;">
                    This is an automated message from ${data.company_name} Recruitment System. Please do not reply to this email.
                </div>
            </div>
        `;

        return sendEmail({
            to: candidate.email,
            subject,
            html,
            candidateId: candidate._id,
            templateId: template?._id,
            templateType: 'interview_scheduling'
        });
    } catch (err) {
        console.error("Interview email error:", err);
        return { success: false, error: err.message };
    }
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
    sendInterviewEmail,
    sendTestEmail,
    processTemplate
};
