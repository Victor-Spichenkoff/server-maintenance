-- CreateTable
CREATE TABLE "Api" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentMantenedUrl" TEXT NOT NULL,
    "currentMantenedName" TEXT NOT NULL,
    "off" BOOLEAN NOT NULL,
    "hightMenssages" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentMonth" INTEGER NOT NULL,
    "keepThisApiOn" BOOLEAN NOT NULL,
    "usageMainAccount" INTEGER NOT NULL,
    "usageThisAccount" INTEGER NOT NULL,
    "lastStart" REAL,
    "lastDiscount" INTEGER,
    "alreadyStartedThis" BOOLEAN NOT NULL
);
