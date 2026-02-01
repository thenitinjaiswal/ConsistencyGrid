import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from '@/lib/prisma';
import { getProviderInstance } from '@/lib/payment/payment-config';
import { isRateLimited } from '@/lib/api-rate-limit';

/**
 * Verify Payment
 * POST /api/payment/verify
 * 
 * Verifies payment signature and updates user subscription.
 * This is CRITICAL for security - always verify server-side.
 * Rate limited to prevent abuse (5 attempts per minute)
 */
export async function POST(req) {
    try {
        // 1. Authenticate user
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Rate limiting - 5 verifications per minute per user
        if (isRateLimited(`verify:${session.user.email}`, 5, 60000)) {
            return NextResponse.json(
                { error: 'Too many verification attempts. Please try again later.' },
                { status: 429, headers: { 'Retry-After': '60' } }
            );
        }

        // 3. Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // 4. Parse payment data
        const paymentData = await req.json();

        // 5. Get payment provider
        const provider = getProviderInstance();

        // 6. Verify payment signature (CRITICAL SECURITY STEP)
        const isValid = await provider.verifyPayment(paymentData);

        if (!isValid) {
            console.error('Payment verification failed for user:', user.id);
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // 7. Extract order/payment IDs based on provider
        let orderId, paymentId;
        if (provider.getProviderName() === 'razorpay') {
            orderId = paymentData.razorpay_order_id;
            paymentId = paymentData.razorpay_payment_id;
        } else if (provider.getProviderName() === 'stripe') {
            orderId = paymentData.payment_intent_id;
            paymentId = paymentData.payment_intent_id;
        }

        // 8. Find transaction in database
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { providerOrderId: orderId },
        });

        if (!transaction) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        // 9. Check if already processed (idempotency)
        if (transaction.status === 'success') {
            return NextResponse.json({
                success: true,
                message: 'Payment already processed',
                alreadyProcessed: true,
            });
        }

        // 10. Update transaction status
        await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
                providerPaymentId: paymentId,
                status: 'success',
                metadata: {
                    ...transaction.metadata,
                    verifiedAt: new Date().toISOString(),
                },
            },
        });

        // 11. Calculate subscription dates
        const now = new Date();
        let subscriptionEndDate;

        if (transaction.plan === 'lifetime') {
            // Lifetime plan - set to 100 years from now
            subscriptionEndDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
        } else if (transaction.plan === 'pro_yearly') {
            // Yearly plan - 1 year from now
            subscriptionEndDate = new Date(now);
            subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        } else if (transaction.plan === 'pro_monthly') {
            // Monthly plan - 1 month from now
            subscriptionEndDate = new Date(now);
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        }

        // 12. Update user subscription
        await prisma.user.update({
            where: { id: user.id },
            data: {
                plan: transaction.plan,
                subscriptionStatus: 'active',
                subscriptionStartDate: now,
                subscriptionEndDate,
                paymentProvider: provider.getProviderName(),
            },
        });

        // 13. TODO: Send confirmation email
        // You can integrate with your email service here

        console.log(`Payment verified successfully for user ${user.id}, plan: ${transaction.plan}`);

        // 14. Return success response
        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            subscription: {
                plan: transaction.plan,
                status: 'active',
                startDate: now,
                endDate: subscriptionEndDate,
            },
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            {
                error: 'Payment verification failed',
                message: error.message
            },
            { status: 500 }
        );
    }
}
