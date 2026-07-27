import { UploadController } from '@/controllers/admin/upload.controller';

export async function POST(req: Request) {
  return UploadController.uploadImage(req);
}
