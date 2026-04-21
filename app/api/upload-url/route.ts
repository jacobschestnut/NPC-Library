import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

export async function GET() {
  const key = `audio/${Date.now()}.webm`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: "audio/webm",
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return Response.json({ url, key });
}