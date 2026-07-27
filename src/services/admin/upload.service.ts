import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: process.env.DO_SPACES_REGION || 'blr1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function uploadImage(file: File) {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  const key = `indiasrilankaescape/${filename}`;
  const bucketName = process.env.DO_SPACES_BUCKET_NAME!;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type,
    })
  );

  const endpointHost = new URL(process.env.DO_SPACES_ENDPOINT!).host;
  const url = `https://${bucketName}.${endpointHost}/${key}`;

  const image = await prisma.image.create({
    data: {
      url,
      altText: file.name
    }
  });

  return image;
}
