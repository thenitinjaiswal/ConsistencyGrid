import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generatePublicToken } from "@/lib/token";
import { validateEmail, validatePassword, validateString, sanitizeString, validateSignupData } from "@/lib/validation";
import { signupLimiter, getClientIP } from "@/lib/rateLimit";
import { createErrorResponse, createSuccessResponse, handleAPIError, createValidationErrorResponse, createRateLimitResponse, API_ERRORS } from "@/lib/apiResponse";

export async function POST(req) {
    try {
        // Rate limiting using client IP
        const clientIP = getClientIP(req);
        const rateLimitCheck = signupLimiter.check(clientIP);
        
        if (!rateLimitCheck.allowed) {
            return createRateLimitResponse(rateLimitCheck.resetTime);
        }

        const body = await req.json();
        const { name, email, password } = body;

        // Validate all inputs
        const validation = validateSignupData(email, password, name);
        if (!validation.isValid) {
            return createValidationErrorResponse(validation.errors);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return createErrorResponse('Email already registered', 409);
        }

        // Hash password with cost factor 12
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name: sanitizeString(name),
                email: email.toLowerCase(),
                password: hashedPassword,
                publicToken: generatePublicToken(),
            },
        });

        return createSuccessResponse(
            { userId: newUser.id, email: newUser.email },
            201
        );
    } catch (error) {
        return handleAPIError(error, 'Signup Error');
    }
}
