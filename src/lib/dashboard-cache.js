import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

/**
 * ============================================================================
 * DASHBOARD DATA CACHE LAYER
 * ============================================================================
 * 
 * Server-side caching for dashboard read operations using Next.js built-in
 * unstable_cache. All functions use userId in cache key to prevent data leaks.
 * 
 * Cache Duration: 60 seconds (default)
 * Cache Strategy: Per-user isolation
 * Revalidation: Automatic after 60s or manual invalidation
 * 
 * ============================================================================
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get today's date at midnight (local timezone)
 */
function getTodayDateOnly() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Get yesterday's date at midnight (local timezone)
 */
function getYesterdayDateOnly() {
    const today = getTodayDateOnly();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

/**
 * Convert date object to local date string (YYYY-MM-DD)
 */
function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// ============================================================================
// CACHED DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch user profile with settings
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object with settings
 */
const getCachedUserProfile = unstable_cache(
    async (userId) => {
        return prisma.user.findUnique({
            where: { id: userId },
            include: { settings: true },
        });
    },
    ["user-profile"],
    { revalidate: 60, tags: ["user-profile"] }
);

/**
 * Fetch all active habits for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of habits with logs
 */
const getCachedHabits = unstable_cache(
    async (userId) => {
        return prisma.habit.findMany({
            where: { userId, isActive: true },
            include: { logs: true },
            orderBy: { createdAt: "asc" },
        });
    },
    ["habits"],
    { revalidate: 60, tags: ["habits"] }
);

/**
 * Fetch all goals for a user with sub-goals
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of goals with sub-goals
 */
const getCachedGoals = unstable_cache(
    async (userId) => {
        return prisma.goal.findMany({
            where: { userId },
            include: {
                subGoals: {
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    ["goals"],
    { revalidate: 60, tags: ["goals"] }
);

/**
 * Fetch all habit logs for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of habit logs
 */
const getCachedHabitLogs = unstable_cache(
    async (userId) => {
        return prisma.habitLog.findMany({
            where: { userId },
            orderBy: { date: "asc" },
        });
    },
    ["habit-logs"],
    { revalidate: 60, tags: ["habit-logs"] }
);

/**
 * Fetch all milestones for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of milestones
 */
const getCachedMilestones = unstable_cache(
    async (userId) => {
        return prisma.milestone.findMany({
            where: { userId },
            orderBy: { date: "asc" },
        });
    },
    ["milestones"],
    { revalidate: 60, tags: ["milestones"] }
);

/**
 * Fetch wallpaper settings for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Wallpaper settings
 */
const getCachedWallpaperSettings = unstable_cache(
    async (userId) => {
        return prisma.wallpaperSettings.findFirst({
            where: { userId },
        });
    },
    ["wallpaper-settings"],
    { revalidate: 60, tags: ["wallpaper-settings"] }
);

// ============================================================================
// AGGREGATION & COMPUTATION FUNCTIONS (Non-cached helpers)
// ============================================================================

/**
 * Calculate streak metrics from habits and logs
 * @param {Array} habits - Active habits
 * @param {Array} logs - All habit logs
 * @returns {Object} Streak data { currentStreak, bestStreak }
 */
function calculateStreakMetrics(habits, logs) {
    const dateMap = new Map();
    const today = getTodayDateOnly();
    const yesterday = getYesterdayDateOnly();

    // Build dateMap from logs
    logs.forEach((log) => {
        const dateKey = getLocalDateString(log.date);
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey).push(log);
    });

    // Calculate current streak (backwards from yesterday)
    let currentStreak = 0;
    let checkDate = new Date(yesterday);

    while (true) {
        const checkDateStr = getLocalDateString(checkDate);
        const logsForDate = dateMap.get(checkDateStr) || [];
        const completedForDate = logsForDate.filter((log) => log.done).length;

        if (completedForDate === habits.length && habits.length > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }

        if (currentStreak > 365) break; // Safety
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(dateMap.keys()).sort();

    sortedDates.forEach((dateKey) => {
        const logsForDate = dateMap.get(dateKey);
        const completedCount = logsForDate.filter((log) => log.done).length;

        if (completedCount === habits.length && habits.length > 0) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    return {
        currentStreak,
        bestStreak,
    };
}

/**
 * Calculate today's progress
 * @param {Array} logs - All habit logs
 * @param {Array} habits - Active habits
 * @returns {Object} Today's progress { todayCompleted, totalHabits, progressPercentage }
 */
function calculateTodayProgress(logs, habits) {
    const today = getTodayDateOnly();
    const todayLogs = logs.filter(
        (log) => log.date.getTime() === today.getTime()
    );
    const todayCompleted = todayLogs.filter((log) => log.done).length;
    const totalHabits = habits.length;
    const progressPercentage =
        totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

    return {
        todayCompleted,
        totalHabits,
        progressPercentage,
    };
}

/**
 * Calculate goal progress
 * @param {Array} goals - Goals with subGoals
 * @returns {Array} Goals with progress calculated
 */
function calculateGoalProgress(goals) {
    return goals.map((goal) => {
        const completed = goal.subGoals.filter((sg) => sg.isCompleted).length;
        const total = goal.subGoals.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            ...goal,
            progress,
            completedSubGoals: completed,
            totalSubGoals: total,
        };
    });
}

// ============================================================================
// MAIN DASHBOARD DATA FUNCTION
// ============================================================================

/**
 * Get complete dashboard data for a user (cached)
 * Combines habits, goals, logs, and computed metrics
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Complete dashboard data
 * 
 * PERFORMANCE NOTE:
 * - First call: Fetches from database (multiple queries)
 * - Subsequent calls within 60s: Returns cached result
 * - After 60s: Automatic revalidation on next request
 */
async function getDashboardData(userId) {
    try {
        // Fetch all data in parallel (these calls use cache internally)
        const [userProfile, habits, goals, logs, milestones, wallpaperSettings] =
            await Promise.all([
                getCachedUserProfile(userId),
                getCachedHabits(userId),
                getCachedGoals(userId),
                getCachedHabitLogs(userId),
                getCachedMilestones(userId),
                getCachedWallpaperSettings(userId),
            ]);

        // Calculate metrics (these are not cached, only database reads are)
        const streakMetrics = calculateStreakMetrics(habits, logs);
        const todayProgress = calculateTodayProgress(logs, habits);
        const goalsWithProgress = calculateGoalProgress(goals);

        return {
            user: userProfile,
            habits,
            goals: goalsWithProgress,
            logs,
            milestones,
            wallpaperSettings,
            streaks: streakMetrics,
            todayProgress,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`[Dashboard Cache] Error fetching data for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Get only habits list (cached)
 * Used by dedicated /api/habits endpoint
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Habits with logs
 */
async function getHabitsList(userId) {
    return getCachedHabits(userId);
}

/**
 * Get only goals list (cached)
 * Used by dedicated /api/goals endpoint
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Goals with sub-goals and calculated progress
 */
async function getGoalsList(userId) {
    const goals = await getCachedGoals(userId);
    return calculateGoalProgress(goals);
}

/**
 * Get only streak data (cached)
 * Used by dedicated /api/streaks endpoint
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Streak metrics
 */
async function getStreakData(userId) {
    const [habits, logs] = await Promise.all([
        getCachedHabits(userId),
        getCachedHabitLogs(userId),
    ]);

    return calculateStreakMetrics(habits, logs);
}

/**
 * Get only dashboard stats (cached)
 * Used by /api/dashboard/stats endpoint
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Today's progress and streak data
 */
async function getDashboardStats(userId) {
    const [habits, logs] = await Promise.all([
        getCachedHabits(userId),
        getCachedHabitLogs(userId),
    ]);

    const todayProgress = calculateTodayProgress(logs, habits);
    const streakMetrics = calculateStreakMetrics(habits, logs);

    return {
        todayProgress,
        streaks: streakMetrics,
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    getDashboardData,
    getHabitsList,
    getGoalsList,
    getStreakData,
    getDashboardStats,
    getCachedUserProfile,
    getCachedHabits,
    getCachedGoals,
    getCachedHabitLogs,
    getCachedMilestones,
    getCachedWallpaperSettings,
    calculateStreakMetrics,
    calculateTodayProgress,
    calculateGoalProgress,
};
