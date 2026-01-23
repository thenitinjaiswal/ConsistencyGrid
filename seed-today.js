import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTodayLogsFunction() {
  try {
    const userEmail = "nitinjaiswal242004@gmail.com"; // From API logs
    
    // Get the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      console.log(`User ${userEmail} not found`);
      return;
    }
    
    console.log(`Found user: ${user.email}, ID: ${user.id}`);
    
    // Get today's date in UTC midnight
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    
    console.log("Creating logs for date:", today);
    
    // Get all active habits for this user
    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    });
    
    console.log(`Found ${habits.length} active habits`);
    
    // Create a log for each habit for today
    for (const habit of habits) {
      // Check if log already exists for today
      const existingLog = await prisma.habitLog.findFirst({
        where: {
          habitId: habit.id,
          userId: user.id,
          date: today,
        },
      });
      
      if (!existingLog) {
        const done = Math.random() > 0.3; // 70% chance of being done
        const log = await prisma.habitLog.create({
          data: {
            habitId: habit.id,
            userId: user.id,
            date: today,
            done: done,
          },
        });
        console.log(`Created log for habit "${habit.title}": ${log.done ? "✓ DONE" : "✗ NOT DONE"}`);
      } else {
        console.log(`Log already exists for habit "${habit.title}"`);
      }
    }
    
    console.log("✓ Seeding complete!");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTodayLogsFunction();
