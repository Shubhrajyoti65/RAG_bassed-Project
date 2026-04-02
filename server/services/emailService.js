const nodemailer = require("nodemailer");
const sendgrid = require("@sendgrid/mail");
const config = require("../config");

let smtpTransporter = null;

function getFromEmail() {
  if (config.MAIL_FROM) {
    return config.MAIL_FROM;
  }

  if (config.EMAIL_PROVIDER === "sendgrid" && config.SENDGRID_FROM_EMAIL) {
    return config.SENDGRID_FROM_EMAIL;
  }

  if (config.EMAIL_PROVIDER === "smtp" && config.SMTP_USER) {
    return config.SMTP_USER;
  }

  return "";
}

function buildResetOtpEmail({ recipientName, otp, ttlMinutes }) {
  const safeName = String(recipientName || "there").trim() || "there";
  const appName = config.APP_NAME;

  const subject = `${appName} password reset OTP`;
  const text =
    `Hello ${safeName},\n\n` +
    `Your password reset OTP is: ${otp}\n` +
    `This OTP is valid for ${ttlMinutes} minutes.\n\n` +
    `If you did not request this, you can ignore this email.\n\n` +
    `${appName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
      <p>Hello ${safeName},</p>
      <p>Your password reset OTP is:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #1d4ed8; margin: 12px 0;">${otp}</p>
      <p>This OTP is valid for <strong>${ttlMinutes} minutes</strong>.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <p style="margin-top: 20px;">${appName}</p>
    </div>
  `;

  return { subject, text, html };
}

function getSmtpTransporter() {
  if (smtpTransporter) {
    return smtpTransporter;
  }

  if (
    !config.SMTP_HOST ||
    !config.SMTP_PORT ||
    !config.SMTP_USER ||
    !config.SMTP_PASS
  ) {
    const error = new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS."
    );
    error.statusCode = 500;
    throw error;
  }

  smtpTransporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  return smtpTransporter;
}

async function sendViaSmtp({ toEmail, subject, text, html }) {
  const from = getFromEmail();
  if (!from) {
    const error = new Error(
      "MAIL_FROM (or SMTP_USER) is required for SMTP email delivery."
    );
    error.statusCode = 500;
    throw error;
  }

  const transporter = getSmtpTransporter();
  await transporter.sendMail({
    from,
    to: toEmail,
    subject,
    text,
    html,
  });
}

async function sendViaSendGrid({ toEmail, subject, text, html }) {
  if (!config.SENDGRID_API_KEY) {
    const error = new Error(
      "SendGrid is not configured. Set SENDGRID_API_KEY."
    );
    error.statusCode = 500;
    throw error;
  }

  const from = getFromEmail();
  if (!from) {
    const error = new Error(
      "MAIL_FROM or SENDGRID_FROM_EMAIL is required for SendGrid delivery."
    );
    error.statusCode = 500;
    throw error;
  }

  sendgrid.setApiKey(config.SENDGRID_API_KEY);
  await sendgrid.send({
    to: toEmail,
    from,
    subject,
    text,
    html,
  });
}

async function sendResetOtpEmail({ toEmail, recipientName, otp, ttlMinutes }) {
  const email = buildResetOtpEmail({ recipientName, otp, ttlMinutes });

  if (config.EMAIL_PROVIDER === "sendgrid") {
    await sendViaSendGrid({ toEmail, ...email });
    return;
  }

  await sendViaSmtp({ toEmail, ...email });
}

module.exports = {
  sendResetOtpEmail,
};
