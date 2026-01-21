import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function asDateOrNull(input) {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    dob,
    lifeExpectancyYears,
    habits = [],
    theme,
  } = body || {};

  const dobDate = asDateOrNull(dob);
  const lifeExp = Number(lifeExpectancyYears || 80);

  if (!name || String(name).trim().length < 2) {
    return Response.json({ message: "Full name is required" }, { status: 400 });
  }
  if (!dobDate) {
    return Response.json({ message: "Birth date is required" }, { status: 400 });
  }
  if (!Number.isFinite(lifeExp) || lifeExp < 40 || lifeExp > 120) {
    return Response.json(
      { message: "Life expectancy must be between 40 and 120" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, onboarded: true },
  });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  // Normalize habits
  const habitTitles = Array.isArray(habits)
    ? habits
        .map((h) => String(h || "").trim())
        .filter((t) => t.length >= 2)
        .slice(0, 20)
    : [];

  const chosenTheme = theme || "dark-minimal";

  await prisma.$transaction(async (tx) => {
    // Update profile
    await tx.user.update({
      where: { id: user.id },
      data: { name: String(name).trim() },
    });

    // Save wallpaper settings (minimal defaults)
    await tx.wallpaperSettings.upsert({
      where: { userId: user.id },
      update: {
        dob: dobDate,
        lifeExpectancyYears: lifeExp,
        theme: chosenTheme,
        showLifeGrid: true,
        showYearGrid: true,
        showAgeStats: true,
        showQuote: true,
      },
      create: {
        userId: user.id,
        dob: dobDate,
        lifeExpectancyYears: lifeExp,
        theme: chosenTheme,
        width: 1080,
        height: 2400,
        showLifeGrid: true,
        showYearGrid: true,
        showAgeStats: true,
        showQuote: true,
        quote: "Make every week count.",
      },
    });

    // Create habits (skip if user already has some)
    if (habitTitles.length > 0) {
      const existingCount = await tx.habit.count({
        where: { userId: user.id, isActive: true },
      });

      if (existingCount === 0) {
        await tx.habit.createMany({
          data: habitTitles.map((title) => ({ userId: user.id, title })),
        });
      }
    }

    // Mark onboarded
    await tx.user.update({
      where: { id: user.id },
      data: { onboarded: true },
    });
  });

  return Response.json({ ok: true }, { status: 200 });
}

