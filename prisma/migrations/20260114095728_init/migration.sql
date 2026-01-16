-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "publicToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WallpaperSettings" (
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WallpaperSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicToken_key" ON "User"("publicToken");

-- CreateIndex
CREATE UNIQUE INDEX "WallpaperSettings_userId_key" ON "WallpaperSettings"("userId");
