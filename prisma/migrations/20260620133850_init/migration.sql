-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "subDiscipline" TEXT,
    "amount" REAL NOT NULL,
    "principalInvestigator" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "plannedEndDate" DATETIME NOT NULL,
    "actualEndDate" DATETIME,
    "taxpayerEquivalent" REAL NOT NULL,
    "citationCost" REAL,
    "dailyBurnRate" REAL NOT NULL,
    "sourceUrl" TEXT,
    "dataCollectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "journal" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "cnkiUrl" TEXT,
    "originalAbstract" TEXT,
    "dewateredSummary" TEXT NOT NULL,
    "aiGeneratedNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Paper_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "totalFunding" REAL NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AnonymousTip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "dailyBaselineAmount" REAL NOT NULL DEFAULT 0,
    "dailyBaselineDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectNumber_key" ON "Project"("projectNumber");

-- CreateIndex
CREATE INDEX "Paper_projectId_idx" ON "Paper"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_word_key" ON "Keyword"("word");

-- CreateIndex
CREATE INDEX "Vote_projectId_idx" ON "Vote"("projectId");
