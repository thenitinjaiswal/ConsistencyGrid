/**
 * Email Utilities
 * Handles email verification tokens and sending verification emails
 */

import crypto from 'crypto';
import nodemailer from 'nodemailer';

// In-memory store for verification tokens (in production, use database)
const verificationTokens = new Map();
const passwordResetTokens = new Map();

// Token expiry time (15 minutes for verification, 1 hour for password reset)
const VERIFICATION_TOKEN_EXPIRY = 15 * 60 * 1000;
const PASSWORD_RESET_TOKEN_EXPIRY = 60 * 60 * 1000;

/**
 * Generate a secure random token
 */
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate email verification token
 */
export const generateVerificationToken = (email) => {
  // Clean up old tokens for this email
  for (const [token, data] of verificationTokens) {
    if (data.email === email && data.expiresAt < Date.now()) {
      verificationTokens.delete(token);
    }
  }

  const token = generateToken();
  const expiresAt = Date.now() + VERIFICATION_TOKEN_EXPIRY;

  verificationTokens.set(token, {
    email,
    expiresAt,
    verified: false,
  });

  return { token, expiresAt };
};

/**
 * Verify email token
 */
export const verifyEmailToken = (token) => {
  const data = verificationTokens.get(token);

  if (!data) {
    return { valid: false, error: 'Invalid token' };
  }

  if (data.expiresAt < Date.now()) {
    verificationTokens.delete(token);
    return { valid: false, error: 'Token expired' };
  }

  if (data.verified) {
    return { valid: false, error: 'Token already used' };
  }

  return { valid: true, email: data.email };
};

/**
 * Mark token as used
 */
export const markTokenAsUsed = (token) => {
  const data = verificationTokens.get(token);
  if (data) {
    data.verified = true;
  }
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = (email) => {
  // Clean up old tokens for this email
  for (const [token, data] of passwordResetTokens) {
    if (data.email === email && data.expiresAt < Date.now()) {
      passwordResetTokens.delete(token);
    }
  }

  const token = generateToken();
  const expiresAt = Date.now() + PASSWORD_RESET_TOKEN_EXPIRY;

  passwordResetTokens.set(token, {
    email,
    expiresAt,
    used: false,
  });

  return { token, expiresAt };
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = (token) => {
  const data = passwordResetTokens.get(token);

  if (!data) {
    return { valid: false, error: 'Invalid token' };
  }

  if (data.expiresAt < Date.now()) {
    passwordResetTokens.delete(token);
    return { valid: false, error: 'Token expired' };
  }

  if (data.used) {
    return { valid: false, error: 'Token already used' };
  }

  return { valid: true, email: data.email };
};

/**
 * Mark password reset token as used
 */
export const markPasswordResetTokenAsUsed = (token) => {
  const data = passwordResetTokens.get(token);
  if (data) {
    data.used = true;
  }
};

/**
 * Clean up expired tokens (call periodically)
 */
export const cleanupExpiredTokens = () => {
  const now = Date.now();

  for (const [token, data] of verificationTokens) {
    if (data.expiresAt < now) {
      verificationTokens.delete(token);
    }
  }

  for (const [token, data] of passwordResetTokens) {
    if (data.expiresAt < now) {
      passwordResetTokens.delete(token);
    }
  }
};

/**
 * Generate email verification link
 */
export const generateVerificationLink = (token) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/verify-email?token=${token}`;
};

/**
 * Generate password reset link
 */
export const generatePasswordResetLink = (token) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/reset-password?token=${token}`;
};

/**
 * Email templates
 */
export const emailTemplates = {
  verification: (name, verificationLink) => ({
    subject: 'Verify your ConsistencyGrid email address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .content { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              margin: 20px 0; 
              background: #f97316; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px;
              text-align: center;
            }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            .expiry { color: #d32f2f; font-size: 12px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ConsistencyGrid</div>
            </div>
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for signing up for ConsistencyGrid. To complete your registration, please verify your email address by clicking the button below:</p>
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationLink}</p>
              <p class="expiry">This link will expire in 15 minutes.</p>
            </div>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
              <p>&copy; 2026 ConsistencyGrid. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome, ${name}!

      Thank you for signing up for ConsistencyGrid. To complete your registration, please verify your email address by clicking the link below:

      ${verificationLink}

      This link will expire in 15 minutes.

      If you didn't create this account, please ignore this email.

      © 2026 ConsistencyGrid. All rights reserved.
    `,
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Reset your ConsistencyGrid password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #f97316; }
            .content { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              margin: 20px 0; 
              background: #f97316; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px;
              text-align: center;
            }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            .expiry { color: #d32f2f; font-size: 12px; margin-top: 15px; }
            .warning { background: #fff3cd; padding: 10px; border-radius: 4px; margin-top: 15px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ConsistencyGrid</div>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hi ${name},</p>
              <p>We received a request to reset your ConsistencyGrid password. Click the button below to create a new password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${resetLink}</p>
              <p class="expiry">This link will expire in 1 hour.</p>
              <div class="warning">
                <strong>Security Note:</strong> If you didn't request a password reset, please ignore this email. Your password is safe and unchanged.
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2026 ConsistencyGrid. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password

      Hi ${name},

      We received a request to reset your ConsistencyGrid password. Click the link below to create a new password:

      ${resetLink}

      This link will expire in 1 hour.

      Security Note: If you didn't request a password reset, please ignore this email. Your password is safe and unchanged.

      © 2026 ConsistencyGrid. All rights reserved.
    `,
  }),
};

/**
 * Send email (placeholder - implement with SendGrid, Nodemailer, etc.)
 * For now, just logs to console
 */
let transporter = null;

/**
 * Initialize Nodemailer transporter
 * Uses Ethereal for testing (logs URLs to preview emails)
 */
const initializeTransporter = async () => {
  if (transporter) return transporter;

  try {
    // For development, use Ethereal Email (free test service)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 Initializing Ethereal test email transporter...');
      
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('✅ Ethereal transporter ready');
      return transporter;
    }

    // For production, use SendGrid or Gmail SMTP
    // Check for SendGrid API key
    if (process.env.SENDGRID_API_KEY) {
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    }
    // Fallback to Gmail SMTP
    else if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
    } else {
      throw new Error('No email service configured for production');
    }

    return transporter;
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
    return null;
  }
};

export const sendEmail = async (to, subject, html, text) => {
  try {
    const emailTransporter = await initializeTransporter();

    if (!emailTransporter) {
      console.error('❌ Email transporter not initialized');
      return { success: false, error: 'Email service not configured' };
    }

    console.log(`📧 Sending email to ${to}`);
    console.log(`Subject: ${subject}`);

    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@consistencygrid.com',
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ Email sent successfully`);
    console.log(`Message ID: ${info.messageId}`);

    // For Ethereal test accounts, log preview URL
    if (process.env.NODE_ENV !== 'production' && info.response) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`📬 Preview URL: ${previewUrl}`);
      }
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, name) => {
  const { token, expiresAt } = generateVerificationToken(email);
  const verificationLink = generateVerificationLink(token);

  const template = emailTemplates.verification(name, verificationLink);

  const result = await sendEmail(email, template.subject, template.html, template.text);

  if (result.success) {
    return { success: true, token, expiresAt };
  } else {
    // Clean up token on send failure
    for (const [t, data] of verificationTokens) {
      if (data.email === email) {
        verificationTokens.delete(t);
      }
    }
    return { success: false, error: result.error };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, name) => {
  const { token, expiresAt } = generatePasswordResetToken(email);
  const resetLink = generatePasswordResetLink(token);

  const template = emailTemplates.passwordReset(name, resetLink);

  const result = await sendEmail(email, template.subject, template.html, template.text);

  if (result.success) {
    return { success: true, token, expiresAt };
  } else {
    // Clean up token on send failure
    for (const [t, data] of passwordResetTokens) {
      if (data.email === email) {
        passwordResetTokens.delete(t);
      }
    }
    return { success: false, error: result.error };
  }
};
