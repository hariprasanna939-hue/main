import { prisma } from '@/lib/prisma';

function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}

export async function getTestimonials() {
  const result = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
    include: { image: true }
  });
  return serializePrisma(result);
}

export async function getTestimonialsPaginated(params: {
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  limit?: number;
  page?: number;
}) {
  const search = params.search || '';
  const status = params.status || 'ALL';
  const limit = params.limit || 10;
  const page = params.page || 1;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status === 'ACTIVE') {
    where.isActive = true;
  } else if (status === 'INACTIVE') {
    where.isActive = false;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [total, items] = await Promise.all([
    prisma.testimonial.count({ where }),
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { image: true }
    })
  ]);

  return serializePrisma({
    total,
    items
  });
}

export async function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({
    where: { id },
    include: { image: true }
  });
}

export async function createTestimonial(data: any) {
  return prisma.testimonial.create({
    data: {
      name: data.name,
      content: data.content,
      imageId: data.imageId || null,
      isActive: Boolean(data.isActive)
    }
  });
}

export async function updateTestimonial(id: string, data: any) {
  return prisma.testimonial.update({
    where: { id },
    data: {
      name: data.name,
      content: data.content,
      imageId: data.imageId || null,
      isActive: Boolean(data.isActive)
    }
  });
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({
    where: { id }
  });
  return { success: true };
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  return prisma.testimonial.update({
    where: { id },
    data: { isActive }
  });
}
