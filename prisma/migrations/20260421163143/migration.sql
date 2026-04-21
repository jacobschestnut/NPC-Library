-- CreateTable
CREATE TABLE "NPC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "npcId" INTEGER NOT NULL,
    CONSTRAINT "Audio_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NPC" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Audio_npcId_key" ON "Audio"("npcId");
