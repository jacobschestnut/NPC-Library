import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const npcs = await prisma.nonPlayableCharacter.findMany()

  return NextResponse.json(npcs)
}

export async function POST(req: Request) {
  const body = await req.json();

  const npc = await prisma.nonPlayableCharacter.create({
    data: {
      name: body.name,
      desc: body.desc,
      userId: body.userId
    },
  });

  return Response.json(npc);
}