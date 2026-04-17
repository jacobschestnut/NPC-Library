import { PrismaClient, Prisma } from '@prisma/client'
import "dotenv/config";

const prisma = new PrismaClient();

const npcData: Prisma.NPCCreateInput[] = [
  { 
    name: "Jameson Trillion",
    desc: "Angry Human Paladin"
  },
  { 
    name: "Gorgix Plent" ,
    desc: "Kind Goblin merchant"
  },
  {
    name: "Trish Garnet",
    desc: "Lost Elvish druid"
  },
];

export async function main() {
  for (const n of npcData) {
    await prisma.nPC.create({ data: n });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });