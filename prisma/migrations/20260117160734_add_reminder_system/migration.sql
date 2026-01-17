-- AlterTable
ALTER TABLE "Habit" ADD COLUMN "scheduledTime" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isFullDay" BOOLEAN NOT NULL DEFAULT true,
    "markerType" TEXT NOT NULL DEFAULT 'dot',
    "markerColor" TEXT NOT NULL DEFAULT '#ff7a00',
    "markerIcon" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnStart" BOOLEAN NOT NULL DEFAULT true,
    "notifyDaily" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WallpaperSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "lifeExpectancyYears" INTEGER NOT NULL DEFAULT 80,
    "theme" TEXT NOT NULL DEFAULT 'dark-minimal',
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 2400,
    "showLifeGrid" BOOLEAN NOT NULL DEFAULT true,
    "showYearGrid" BOOLEAN NOT NULL DEFAULT true,
    "showAgeStats" BOOLEAN NOT NULL DEFAULT true,
    "showQuote" BOOLEAN NOT NULL DEFAULT false,
    "quote" TEXT,
    "goalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "goalTitle" TEXT,
    "goalStartDate" DATETIME,
    "goalDurationDays" INTEGER,
    "goalUnit" TEXT,
    "yearGridMode" TEXT NOT NULL DEFAULT 'weeks',
    "wallpaperType" TEXT NOT NULL DEFAULT 'lockscreen',
    "showMissedDays" BOOLEAN NOT NULL DEFAULT false,
    "showHabitLayer" BOOLEAN NOT NULL DEFAULT false,
    "showLegend" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WallpaperSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WallpaperSettings" ("dob", "goalDurationDays", "goalEnabled", "goalStartDate", "goalTitle", "goalUnit", "height", "id", "lifeExpectancyYears", "quote", "showAgeStats", "showLifeGrid", "showQuote", "showYearGrid", "theme", "updatedAt", "userId", "width") SELECT "dob", "goalDurationDays", "goalEnabled", "goalStartDate", "goalTitle", "goalUnit", "height", "id", "lifeExpectancyYears", "quote", "showAgeStats", "showLifeGrid", "showQuote", "showYearGrid", "theme", "updatedAt", "userId", "width" FROM "WallpaperSettings";
DROP TABLE "WallpaperSettings";
ALTER TABLE "new_WallpaperSettings" RENAME TO "WallpaperSettings";
CREATE UNIQUE INDEX "WallpaperSettings_userId_key" ON "WallpaperSettings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Reminder_userId_startDate_idx" ON "Reminder"("userId", "startDate");

-- CreateIndex
CREATE INDEX "Reminder_userId_endDate_idx" ON "Reminder"("userId", "endDate");
