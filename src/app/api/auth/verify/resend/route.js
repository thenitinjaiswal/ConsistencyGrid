import prisma from "@/lib/prisma";
import {
    createErrorResponse,
    createSuccessResponse,
    handleAPIError
} from "@/lib/apiResponse";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return createErrorResponse("Email is required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            return createErrorResponse("User not found", 404);
        }

        if (user.emailVerified) {
            return createErrorResponse("Email already verified", 400);
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: otp,
                verificationTokenExpiry: otpExpiry,
            },
        });

        const mailResult = await sendVerificationEmail(user.email, otp);

        if (!mailResult.success) {
            return createErrorResponse("Failed to send verification email", 500);
        }

        return createSuccessResponse({ message: "Verification code resent successfully" });
    } catch (error) {
        return handleAPIError(error, "Resend Error");
    }
}
