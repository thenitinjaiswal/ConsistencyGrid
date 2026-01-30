import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    createErrorResponse,
    createSuccessResponse,
    handleAPIError
} from "@/lib/apiResponse";

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return createErrorResponse("Email and verification code are required", 400);
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

        if (user.verificationToken !== otp) {
            return createErrorResponse("Invalid verification code", 400);
        }

        if (new Date() > user.verificationTokenExpiry) {
            return createErrorResponse("Verification code has expired", 400);
        }

        // Mark user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
                verificationTokenExpiry: null,
            },
        });

        return createSuccessResponse({ message: "Email verified successfully" });
    } catch (error) {
        return handleAPIError(error, "Verification Error");
    }
}
