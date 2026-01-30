import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generatePublicToken } from "@/lib/token";
import {
  validateSignupData,
  sanitizeString,
} from "@/lib/validation";
import {
  signupLimiter,
  getClientIP,
} from "@/lib/rateLimit";
import {
  createErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  createRateLimitResponse,
  handleAPIError,
} from "@/lib/apiResponse";

// Ensure Node runtime (Prisma safe)
export const runtime = "nodejs";

export async function POST(req) {
  try {
    /* ================================
       1️⃣ RATE LIMIT (PRODUCTION ONLY)
    ================================= */
    if (process.env.NODE_ENV === "production") {
      const clientIP = getClientIP(req);
      const rateLimitCheck = signupLimiter.check(clientIP);

      if (!rateLimitCheck.allowed) {
        return createRateLimitResponse(rateLimitCheck.resetTime);
      }
    }

    /* ================================
       2️⃣ PARSE BODY
    ================================= */
    const body = await req.json();
    const { name, email, password } = body;

    /* ================================
       3️⃣ VALIDATION
    ================================= */
    const validation = validateSignupData(email, password, name);
    if (!validation.isValid) {
      console.log("[SIGNUP_VALIDATION_ERROR]", validation.errors);
      return createValidationErrorResponse(validation.errors);
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = sanitizeString(name);

    /* ================================
       4️⃣ CHECK EXISTING USER
    ================================= */
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return createErrorResponse("Email already registered", 409);
    }

    /* ================================
       5️⃣ HASH PASSWORD
    ================================= */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* ================================
       6️⃣ CREATE USER
    ================================= */
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        publicToken: generatePublicToken(),
        emailVerified: new Date(), // Auto-verify for now
      },
    });

    /* ================================
       7️⃣ SUCCESS RESPONSE
    ================================= */
    return createSuccessResponse(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      201
    );
  } catch (error) {
    return handleAPIError(error, "Signup Error");
  }
}


