import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/apiResponse';

/**
 * Get Public Token API
 * Returns the user's publicToken for client-side storage
 * Used for session recovery in WebView when cookies are cleared
 * 
 * Security: Only returns token for authenticated users
 */
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return createErrorResponse('Unauthorized', 401);
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { publicToken: true },
        });

        if (!user) {
            return createErrorResponse('User not found', 404);
        }

        return createSuccessResponse({ publicToken: user.publicToken });
    } catch (error) {
        console.error('Error fetching public token:', error);
        return createErrorResponse('Failed to retrieve token', 500);
    }
}
