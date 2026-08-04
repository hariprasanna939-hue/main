import { IconController } from '@/controllers/admin/icon.controller';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return IconController.deleteIcon(id);
}
