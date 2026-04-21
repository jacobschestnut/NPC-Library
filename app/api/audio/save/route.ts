import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { key, npcId } = await req.json();

  const audio = await prisma.audio.create({
    data: {
      id: crypto.randomUUID(),
      key,
      npcId: Number(npcId),
    },
  });

  return Response.json({ success: true, audio });
}