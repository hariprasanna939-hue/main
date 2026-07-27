import { prisma } from '@/lib/prisma';

export async function getCountries() {
  return prisma.country.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      image: true,
      footerImage: true,
      heroDesktopImage: true,
      heroMobileImage: true,
      _count: {
        select: {
          packages: {
            where: { type: 'MAIN' }
          }
        }
      }
    }
  });
}

export async function getCountry(id: string) {
  return prisma.country.findUnique({
    where: { id },
    include: { image: true, footerImage: true, heroDesktopImage: true, heroMobileImage: true }
  });
}

export async function getImages() {
  return prisma.image.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createCountry(data: any) {
  return prisma.country.create({
    data: {
      name: data.name,
      title: data.title || null,
      description: data.description || null,
      isActive: Boolean(data.isActive),
      sortOrder: Number(data.sortOrder) || 0,
      imageId: data.imageId || null,
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      footerImageId: data.footerImageId || null,
      heroDesktopImageId: data.heroDesktopImageId || null,
      heroMobileImageId: data.heroMobileImageId || null,
    }
  });
}

export async function updateCountry(id: string, data: any) {
  return prisma.country.update({
    where: { id },
    data: {
      name: data.name,
      title: data.title || null,
      description: data.description || null,
      isActive: Boolean(data.isActive),
      sortOrder: Number(data.sortOrder) || 0,
      imageId: data.imageId || null,
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      footerImageId: data.footerImageId || null,
      heroDesktopImageId: data.heroDesktopImageId || null,
      heroMobileImageId: data.heroMobileImageId || null,
    }
  });
}

export async function deleteCountry(id: string) {
  await prisma.country.delete({
    where: { id }
  });
  return { success: true };
}

export async function toggleCountryActive(id: string, isActive: boolean) {
  return prisma.country.update({
    where: { id },
    data: { isActive }
  });
}
