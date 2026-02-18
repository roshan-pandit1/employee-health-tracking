-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "avatar" TEXT,
    "age" INTEGER,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchConnected" BOOLEAN NOT NULL DEFAULT false,
    "lastSync" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VitalReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "heartRate" INTEGER,
    "bloodOxygen" INTEGER,
    "steps" INTEGER,
    "sleepHours" REAL,
    "sleepQuality" INTEGER,
    "stressLevel" INTEGER,
    "temperature" REAL,
    "caloriesBurned" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VitalReading_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "suggestion" TEXT,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" DATETIME,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Alert_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BurnoutScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "risk" TEXT NOT NULL,
    "fatigueScore" REAL,
    "stressScore" REAL,
    "sleepScore" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BurnoutScore_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SmartwatchSync" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "syncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "recordsCount" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "VitalReading_employeeId_idx" ON "VitalReading"("employeeId");

-- CreateIndex
CREATE INDEX "VitalReading_timestamp_idx" ON "VitalReading"("timestamp");

-- CreateIndex
CREATE INDEX "VitalReading_employeeId_timestamp_idx" ON "VitalReading"("employeeId", "timestamp");

-- CreateIndex
CREATE INDEX "Alert_employeeId_idx" ON "Alert"("employeeId");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_acknowledged_idx" ON "Alert"("acknowledged");

-- CreateIndex
CREATE INDEX "Alert_timestamp_idx" ON "Alert"("timestamp");

-- CreateIndex
CREATE INDEX "BurnoutScore_employeeId_idx" ON "BurnoutScore"("employeeId");

-- CreateIndex
CREATE INDEX "BurnoutScore_timestamp_idx" ON "BurnoutScore"("timestamp");

-- CreateIndex
CREATE INDEX "BurnoutScore_risk_idx" ON "BurnoutScore"("risk");

-- CreateIndex
CREATE INDEX "SmartwatchSync_employeeId_idx" ON "SmartwatchSync"("employeeId");

-- CreateIndex
CREATE INDEX "SmartwatchSync_syncedAt_idx" ON "SmartwatchSync"("syncedAt");
