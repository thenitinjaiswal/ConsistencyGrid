import prisma from '@/lib/prisma';
import { verifyEmailToken, markTokenAsUsed } from '@/lib/email';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';
import { withPOST } from '@/lib/apiSecurity';

async function handler(req) {
  const { token } = req.body;

  if (!token) {
    return Response.json(
      createErrorResponse('Verification token is required', 'MISSING_TOKEN'),
      { status: 400 }
    );
  }

  // Verify token
  const verification = verifyEmailToken(token);
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

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Mark token as used
    markTokenAsUsed(token);

    return Response.json(
      createSuccessResponse(
        { email: user.email },
        'Email verified successfully. You can now log in.'
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json(
      createErrorResponse('Failed to verify email', 'VERIFICATION_ERROR'),
      { status: 500 }
    );
  }
}

export const POST = withPOST(handler);
