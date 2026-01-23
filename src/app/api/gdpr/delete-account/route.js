import { getServerSession } from 'next-auth/next';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * POST /api/gdpr/delete-account
 * Request permanent account deletion after password verification
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return Response.json(
        { success: false, error: 'Password required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Fetch user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    if (user.password) {
      const passwordValid = await compare(password, user.password);

      if (!passwordValid) {
        return Response.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Start transaction to delete all user data
    const deleteResult = await prisma.$transaction(async tx => {
      // Delete all user-related data
      await Promise.all([
        tx.habitLog.deleteMany({ where: { userId } }),
        tx.habit.deleteMany({ where: { userId } }),
        tx.goal.deleteMany({ where: { userId } }),
        tx.subgoal.deleteMany({ where: { userId } }),
        tx.reminder.deleteMany({ where: { userId } }),
        tx.milestone.deleteMany({ where: { userId } }),
        tx.wallpaperSettings.deleteMany({ where: { userId } }),
      ]);

      // Delete user account
      const deletedUser = await tx.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    });

    // Log GDPR operation
    console.log(`[GDPR AUDIT] Account Deleted: ${userId}`, {
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      message: 'Account successfully deleted',
    });
  } catch (error) {
    console.error('Error deleting account:', error);

    // Handle Prisma errors
    if (error.code === 'P2025') {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
