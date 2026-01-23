import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { validateEmail } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '@/lib/apiResponse';
import { withPOST } from '@/lib/apiSecurity';

async function handler(req, context) {
  const { body } = context;
  const { email } = body || {};

  console.log('🔍 Forgot password request for email:', email);

  // Validate email
  const emailValidation = validateEmail(email);
  console.log('📧 Email validation result:', emailValidation);
  
  if (!emailValidation.valid) {
    return Response.json(
      createValidationErrorResponse({ email: emailValidation.error }),
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return Response.json(
        createSuccessResponse(
          {},
          'If an account with this email exists, a password reset link has been sent.'
        ),
        { status: 200 }
      );
    }

    // Send password reset email
    const result = await sendPasswordResetEmail(email.toLowerCase(), user.name || 'User');

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      return Response.json(
        createErrorResponse('Failed to send reset email', 'EMAIL_SEND_ERROR'),
        { status: 500 }
      );
    }

    return Response.json(
      createSuccessResponse(
        {},
        'Password reset link has been sent to your email.'
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return Response.json(
      createErrorResponse('An error occurred', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}

export const POST = withPOST(handler);
