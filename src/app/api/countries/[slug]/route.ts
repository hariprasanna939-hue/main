import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;

    let countryNameQuery = slug;
    if (slug.toLowerCase() === 'srilanka' || slug.toLowerCase() === 'sri-lanka') {
      countryNameQuery = 'Sri Lanka';
    } else if (slug.toLowerCase() === 'india') {
      countryNameQuery = 'India';
    }

    const country = await prisma.country.findFirst({
      where: {
        name: {
          equals: countryNameQuery,
          mode: 'insensitive'
        },
        isActive: true
      },
      include: {
        seoMeta: true,
        footerImage: true,
        packages: {
          where: { isActive: true, type: 'MAIN' },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            countryId: true,
            title: true,
            subtitle: true,
            slug: true,
            description: true,
            sortOrder: true,
            gallery: {
              include: { image: true },
              where: { isCover: true }
            }
          }
        }
      }
    });

    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json({ country });
  } catch (error: any) {
    console.error(`Error fetching country [${error.message}]:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch country details' },
      { status: 500 }
    );
  }
}
