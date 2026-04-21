-- CreateTable
CREATE TABLE "NPC" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "NPC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "npcId" INTEGER NOT NULL,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audio_npcId_key" ON "Audio"("npcId");

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NPC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
