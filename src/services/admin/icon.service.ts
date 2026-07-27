import { prisma } from '@/lib/prisma';

export async function getIcons() {
  return prisma.icon.findMany({
    orderBy: { createdAt: 'desc' },
    include: { image: true }
  });
}

export async function createIcon(data: any) {
  return prisma.icon.create({
    data: {
      name: data.name,
      imageId: data.imageId
    }
  });
}

export async function deleteIcon(id: string) {
  await prisma.icon.delete({
    where: { id }
  });
  return { success: true };
}
