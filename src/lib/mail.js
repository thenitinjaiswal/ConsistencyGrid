import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a verification OTP to the user's email
 */
export async function sendVerificationEmail(email, otp) {
  try {
    // NOTE: Use 'onboarding@resend.dev' for testing until your domain is verified in Resend.
    // When using this address, you can only send to the email you used to sign up for Resend.
    const fromAddress = process.env.NODE_ENV === 'production'
      ? 'Consistency Grid <onboarding@consistencygrid.com>'
      : 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: 'Verify your Consistency Grid account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
          <h1 style="color: #f97316; font-size: 24px; font-weight: bold; margin-bottom: 24px;">Verify your account</h1>
          <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Welcome to Consistency Grid! To complete your registration and prevent fake accounts, please use the following verification code:
          </p>
          <div style="background-color: #fffaf1; border: 1px solid #ffedd5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ea580c;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
            This code will expire in 15 minutes.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            &copy; ${new Date().getFullYear()} Consistency Grid. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
