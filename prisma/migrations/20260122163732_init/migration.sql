-- CreateTable
CREATE TABLE "ConsentPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "data_processing" BOOLEAN NOT NULL DEFAULT true,
    "analytics" BOOLEAN NOT NULL DEFAULT true,
    "marketing_emails" BOOLEAN NOT NULL DEFAULT false,
    "performance_monitoring" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConsentPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsentPreference_userId_key" ON "ConsentPreference"("userId");
