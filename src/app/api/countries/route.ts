import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        image: true,
        packages: {
          where: { isActive: true, type: 'MAIN' },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(countries);
  } catch (error: any) {
    console.error('Error fetching public countries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
