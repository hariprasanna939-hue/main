import { NextResponse } from 'next/server';
import { getIcons, createIcon, deleteIcon } from '@/services/admin/icon.service';
import { revalidatePath } from 'next/cache';

export class IconController {
  static async getIcons() {
    const icons = await getIcons();
    return NextResponse.json(icons);
  }

  static async createIcon(req: Request) {
    const data = await req.json();
    const newIcon = await createIcon(data);
    revalidatePath('/admin/icons');
    return NextResponse.json(newIcon);
  }

  static async deleteIcon(id: string) {
    await deleteIcon(id);
    revalidatePath('/admin/icons');
    return NextResponse.json({ success: true });
  }
}
