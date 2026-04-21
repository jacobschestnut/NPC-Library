import { prisma } from "@/lib/prisma"

const npcData = [
  { name: "Jameson Trillion", desc: "Angry Human Paladin" },
  { name: "Gorgix Plent", desc: "Kind Goblin merchant" },
  { name: "Trish Garnet", desc: "Lost Elvish druid" },
]

async function main() {
  for (const n of npcData) {
    await prisma.nPC.create({ data: n })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })