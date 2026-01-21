/*
  Warnings:

  - You are about to drop the column `color` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `currentValue` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `isMilestone` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `milestoneAge` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `milestoneStatus` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `targetDate` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `targetValue` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `SubGoal` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SubGoal` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `SubGoal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SubGoal` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'future',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "targetDeadline" DATETIME,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("category", "createdAt", "description", "id", "isCompleted", "progress", "title", "updatedAt", "userId") SELECT "category", "createdAt", "description", "id", "isCompleted", "progress", "title", "updatedAt", "userId" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE TABLE "new_SubGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubGoal_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubGoal" ("createdAt", "goalId", "id", "isCompleted", "title", "updatedAt") SELECT "createdAt", "goalId", "id", "isCompleted", "title", "updatedAt" FROM "SubGoal";
DROP TABLE "SubGoal";
ALTER TABLE "new_SubGoal" RENAME TO "SubGoal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
