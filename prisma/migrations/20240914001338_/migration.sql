/*
  Warnings:

  - You are about to alter the column `lastDiscount` on the `Time` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `lastStart` on the `Time` table. The data in that column could be lost. The data in that column will be cast from `Float` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentMonth" INTEGER NOT NULL,
    "keepThisApiOn" BOOLEAN NOT NULL,
    "usageMainAccount" INTEGER NOT NULL,
    "usageThisAccount" INTEGER NOT NULL,
    "lastStart" BIGINT,
    "lastDiscount" BIGINT,
    "alreadyStartedThis" BOOLEAN NOT NULL
);
INSERT INTO "new_Time" ("alreadyStartedThis", "currentMonth", "id", "keepThisApiOn", "lastDiscount", "lastStart", "usageMainAccount", "usageThisAccount") SELECT "alreadyStartedThis", "currentMonth", "id", "keepThisApiOn", "lastDiscount", "lastStart", "usageMainAccount", "usageThisAccount" FROM "Time";
DROP TABLE "Time";
ALTER TABLE "new_Time" RENAME TO "Time";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
