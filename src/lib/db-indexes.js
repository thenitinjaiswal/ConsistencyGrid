/**
 * Database Index Optimization Guide
 * 
 * This file documents the recommended indexes for production database
 * to ensure optimal query performance for 100k+ users
 * 
 * COPY these migrations to your Prisma migrations folder or run directly on production DB
 */

/**
 * RECOMMENDED INDEXES (SQL for production database):
 * 
 * -- User lookups by email (used in auth)
 * CREATE INDEX IF NOT EXISTS idx_user_email ON "User"("email");
 * CREATE INDEX IF NOT EXISTS idx_user_publictoken ON "User"("publicToken");
 * 
 * -- Habit queries (most common)
 * CREATE INDEX IF NOT EXISTS idx_habit_userid_active ON "Habit"("userId", "isActive");
 * CREATE INDEX IF NOT EXISTS idx_habitlog_habitid_date ON "HabitLog"("habitId", "date");
 * 
 * -- Goal queries
 * CREATE INDEX IF NOT EXISTS idx_goal_userid_completed ON "Goal"("userId", "isCompleted");
 * CREATE INDEX IF NOT EXISTS idx_goal_userid_pinned ON "Goal"("userId", "isPinned");
 * 
 * -- Reminder queries
 * CREATE INDEX IF NOT EXISTS idx_reminder_userid_active ON "Reminder"("userId", "isActive");
 * 
 * -- Payment tracking
 * CREATE INDEX IF NOT EXISTS idx_payment_userid_status ON "PaymentTransaction"("userId", "status");
 * CREATE INDEX IF NOT EXISTS idx_payment_providerid ON "PaymentTransaction"("providerOrderId");
 * 
 * -- Settings lookup
 * CREATE INDEX IF NOT EXISTS idx_settings_userid ON "WallpaperSettings"("userId");
 * 
 * -- Composite indexes for common queries
 * CREATE INDEX IF NOT EXISTS idx_user_plan_status ON "User"("plan", "subscriptionStatus");
 */

export const INDEX_RECOMMENDATIONS = {
    user: [
        { columns: ['email'], unique: true },
        { columns: ['publicToken'] },
    ],
    habit: [
        { columns: ['userId', 'isActive'] },
    ],
    habitLog: [
        { columns: ['habitId', 'date'] },
    ],
    goal: [
        { columns: ['userId', 'isCompleted'] },
        { columns: ['userId', 'isPinned'] },
    ],
    reminder: [
        { columns: ['userId', 'isActive'] },
    ],
    paymentTransaction: [
        { columns: ['userId', 'status'] },
        { columns: ['providerOrderId'], unique: true },
    ],
    wallpaperSettings: [
        { columns: ['userId'], unique: true },
    ],
};

export const OPTIMIZATION_TIPS = [
    "Run 'npx prisma db push' to apply migrations after updating schema.prisma",
    "Use 'SELECT COUNT(*) FROM pg_stat_user_indexes' to verify indexes exist",
    "Monitor slow queries: Set log_min_duration_statement = 1000 in PostgreSQL",
    "Analyze query plans: EXPLAIN ANALYZE <query>",
    "For 100k users, consider read replicas for analytics queries",
    "Cache frequently accessed data: UserSettings, PublicTokens",
];
