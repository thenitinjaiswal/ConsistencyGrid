/**
 * Middleware helper for subscription validation
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

/**
 * Check user subscription and return feature access
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User with subscription details
 */
export async function getUserSubscription(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      subscriptionStatus: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      trialEndDate: true,
      _count: {
        select: {
          habits: true,
          goals: true,
        },
      },
    },
  });

  return user;
}

/**
 * Check if user can create more habits
 * @param {string} userId - User ID
 * @returns {Promise<Object>} { canCreate: boolean, currentCount: number, limit: number|null, message: string }
 */
export async function checkHabitLimit(userId) {
  const user = await getUserSubscription(userId);

  if (!user) {
    return {
      canCreate: false,
      message: "User not found",
    };
  }

  const isFreeUser = user.plan === "free" || !user.plan;
  const habitLimit = 3;

  if (isFreeUser && user._count.habits >= habitLimit) {
    return {
      canCreate: false,
      currentCount: user._count.habits,
      limit: habitLimit,
      message: `You've reached the habit limit (${habitLimit}) on the Free plan. Upgrade to Pro for unlimited habits.`,
    };
  }

  return {
    canCreate: true,
    currentCount: user._count.habits,
    limit: isFreeUser ? habitLimit : null,
    message: isFreeUser
      ? `You have ${habitLimit - user._count.habits} habit slots remaining.`
      : "Unlimited habits available.",
  };
}

/**
 * Check if user can create more goals
 * @param {string} userId - User ID
 * @returns {Promise<Object>} { canCreate: boolean, currentCount: number, limit: number|null, message: string }
 */
export async function checkGoalLimit(userId) {
  const user = await getUserSubscription(userId);

  if (!user) {
    return {
      canCreate: false,
      message: "User not found",
    };
  }

  const isFreeUser = user.plan === "free" || !user.plan;
  const goalLimit = 3;

  if (isFreeUser && user._count.goals >= goalLimit) {
    return {
      canCreate: false,
      currentCount: user._count.goals,
      limit: goalLimit,
      message: `You've reached the goal limit (${goalLimit}) on the Free plan. Upgrade to Pro for unlimited goals.`,
    };
  }

  return {
    canCreate: true,
    currentCount: user._count.goals,
    limit: isFreeUser ? goalLimit : null,
    message: isFreeUser
      ? `You have ${goalLimit - user._count.goals} goal slots remaining.`
      : "Unlimited goals available.",
  };
}

/**
 * Check if user can access feature (generic)
 * @param {string} userId - User ID
 * @param {string} feature - Feature name (analytics, export, etc.)
 * @returns {Promise<Object>} { allowed: boolean, reason?: string }
 */
export async function checkFeatureAccess(userId, feature) {
  const user = await getUserSubscription(userId);

  if (!user) {
    return {
      allowed: false,
      reason: "User not found",
    };
  }

  const isFreeUser = user.plan === "free" || !user.plan;

  // Features restricted to Pro only
  const proOnlyFeatures = [
    "analytics",
    "ai_suggestions",
    "export",
    "cloud_sync",
    "reminders",
  ];

  if (isFreeUser && proOnlyFeatures.includes(feature)) {
    return {
      allowed: false,
      reason: `${feature} is available with Pro plan. Upgrade to unlock this feature.`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Validate subscription is still active
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isSubscriptionActive(userId) {
  const user = await getUserSubscription(userId);

  if (!user) return false;

  // Free plan is always active
  if (user.plan === "free" || !user.plan) return true;

  // Check if subscription status is active
  if (user.subscriptionStatus === "active") {
    // Check if not expired
    if (user.subscriptionEndDate) {
      return new Date() < new Date(user.subscriptionEndDate);
    }
    return true;
  }

  // Check trial status
  if (user.trialEndDate) {
    return new Date() < new Date(user.trialEndDate);
  }

  return false;
}

/**
 * API response helpers for subscription errors
 */
export const SubscriptionErrors = {
  HABIT_LIMIT_REACHED: {
    status: 403,
    code: "HABIT_LIMIT_REACHED",
    message: "You've reached the maximum habits for your plan. Upgrade to Pro for unlimited.",
  },
  GOAL_LIMIT_REACHED: {
    status: 403,
    code: "GOAL_LIMIT_REACHED",
    message: "You've reached the maximum goals for your plan. Upgrade to Pro for unlimited.",
  },
  FEATURE_LOCKED: {
    status: 403,
    code: "FEATURE_LOCKED",
    message: "This feature requires a Pro subscription. Upgrade to unlock.",
  },
  SUBSCRIPTION_EXPIRED: {
    status: 403,
    code: "SUBSCRIPTION_EXPIRED",
    message: "Your subscription has expired. Please renew to continue using this feature.",
  },
};

export default {
  getUserSubscription,
  checkHabitLimit,
  checkGoalLimit,
  checkFeatureAccess,
  isSubscriptionActive,
  SubscriptionErrors,
};
