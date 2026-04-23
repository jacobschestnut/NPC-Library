import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const npcData = [
  { name: "Jameson Trillion", desc: "Angry Human Paladin", userId: "1" },
  { name: "Gorgix Plent", desc: "Kind Goblin merchant", userId: "1" },
  { name: "Trish Garnet", desc: "Lost Elvish druid", userId: "1" },
];

async function main() {
  for (const n of npcData) {
    await prisma.nonPlayableCharacter.create({ data: n });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());