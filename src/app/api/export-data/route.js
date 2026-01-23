import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/authOptions';

/**
 * GET /api/export-data
 * Clean, simple data export endpoint
 */
export async function GET(req) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all related data
    const [goals, habits, habitLogs, reminders, milestones, settings] = await Promise.all([
      prisma.goal.findMany({ where: { userId } }),
      prisma.habit.findMany({ where: { userId } }),
      prisma.habitLog.findMany({ where: { userId } }),
      prisma.reminder.findMany({ where: { userId } }),
      prisma.milestone.findMany({ where: { userId } }),
      prisma.wallpaperSettings.findUnique({ where: { userId } }),
    ]);

    return Response.json({
      success: true,
      user,
      goals: goals || [],
      habits: habits || [],
      habitLogs: habitLogs || [],
      reminders: reminders || [],
      milestones: milestones || [],
      settings: settings || {},
    });
  } catch (error) {
    console.error('Export error:', error);
    return Response.json(
      { success: false, error: error.message || 'Export failed' },
      { status: 500 }
    );
  }
}
