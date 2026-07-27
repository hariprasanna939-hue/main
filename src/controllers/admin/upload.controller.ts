import { NextResponse } from 'next/server';
import { uploadImage } from '@/services/admin/upload.service';

export class UploadController {
  static async uploadImage(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    try {
      const image = await uploadImage(file);
      return NextResponse.json(image);
    } catch (error) {
      console.error(error);
      return new NextResponse('Upload failed', { status: 500 });
    }
  }
}
