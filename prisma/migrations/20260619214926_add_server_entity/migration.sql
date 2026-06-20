-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "fullUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "LastCalled" BIGINT,
    "LastCalledSucessfully" BIGINT
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_fullUrl_key" ON "Server"("fullUrl");
