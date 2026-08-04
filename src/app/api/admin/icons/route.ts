import { IconController } from '@/controllers/admin/icon.controller';

export async function GET() {
  return IconController.getIcons();
}

export async function POST(req: Request) {
  return IconController.createIcon(req);
}
