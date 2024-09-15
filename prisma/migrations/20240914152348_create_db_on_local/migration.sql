-- CreateTable
CREATE TABLE "Api" (
    "id" SERIAL NOT NULL,
    "currentMantenedUrl" TEXT NOT NULL,
    "currentMantenedName" TEXT NOT NULL,
    "off" BOOLEAN NOT NULL,
    "hightMenssages" BOOLEAN NOT NULL,

    CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "currentMonth" INTEGER NOT NULL,
    "keepThisApiOn" BOOLEAN NOT NULL,
    "usageMainAccount" INTEGER NOT NULL,
    "usageThisAccount" INTEGER NOT NULL,
    "lastStart" BIGINT,
    "lastDiscount" BIGINT,
    "alreadyStartedThis" BOOLEAN NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);
