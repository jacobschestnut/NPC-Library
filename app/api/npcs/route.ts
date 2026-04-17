import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/npcs
export async function GET() {
  const npcs = await prisma.nPC.findMany()

  return NextResponse.json(npcs)
}

export async function POST(req: Request) {
  const body = await req.json();

  const npc = await prisma.nPC.create({
    data: {
      name: body.name,
      desc: body.desc,
    },
  });

  return Response.json(npc);
}