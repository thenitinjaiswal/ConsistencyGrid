import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';
import { verifyPasswordResetToken, markPasswordResetTokenAsUsed } from '@/lib/email';
import { validatePassword } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '@/lib/apiResponse';
import { withPOST } from '@/lib/apiSecurity';

async function handler(req) {
  const { token, password } = req.body;

  if (!token) {
    return Response.json(
      createErrorResponse('Reset token is required', 'MISSING_TOKEN'),
      { status: 400 }
    );
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return Response.json(
      createValidationErrorResponse({ password: passwordValidation.error }),
      { status: 400 }
    );
  }

  // Verify token
  const verification = verifyPasswordResetToken(token);
  if (!verification.valid) {
    return Response.json(
      createErrorResponse(verification.error, 'INVALID_TOKEN'),
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verification.email },
    });

    if (!user) {
      return Response.json(
        createErrorResponse('User not found', 'USER_NOT_FOUND'),
        { status: 404 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Mark token as used
    markPasswordResetTokenAsUsed(token);

    return Response.json(
      createSuccessResponse(
        { email: user.email },
        'Password reset successfully. You can now log in with your new password.'
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return Response.json(
      createErrorResponse('Failed to reset password', 'RESET_ERROR'),
      { status: 500 }
    );
  }
}

export const POST = withPOST(handler);
