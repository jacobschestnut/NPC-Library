import { prisma } from "@/lib/prisma";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const npc = await prisma.nPC.findUnique({
    where: { id: Number(id) },
    include: { audio: true },
  });

  if (!npc?.audio?.key) {
    return Response.json({ url: null });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: npc.audio.key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });

  return Response.json({ url });
}