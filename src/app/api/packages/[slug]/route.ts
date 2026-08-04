import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json({ error: 'Package slug is required' }, { status: 400 });
    }

    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        country: true,
        gallery: { include: { image: true }, orderBy: { sortOrder: 'asc' } },
        itineraries: { include: { image: true, icons: { include: { image: true } } }, orderBy: { sortOrder: 'asc' } },
        experiences: { include: { imageOne: true }, orderBy: { sortOrder: 'asc' } },
        hotels: { include: { image: true }, orderBy: { sortOrder: 'asc' } },
        goodToKnows: { include: { icon: { include: { image: true } } }, orderBy: { sortOrder: 'asc' } },
        pricePackages: { orderBy: { sortOrder: 'asc' } },
        departureDates: { where: { isActive: true }, orderBy: { departureDate: 'asc' } },
        bestSeasons: { orderBy: { sortOrder: 'asc' } },
        highlights: { include: { icon: { include: { image: true } } }, orderBy: { sortOrder: 'asc' } },
        footerImage: true,
        cuisineBgImage: true,
        whyLoveBgImage: true,
        perfectFors: { include: { icon: { include: { image: true } } }, orderBy: { sortOrder: 'asc' } },
        localCuisines: { include: { image: true, icon: { include: { image: true } } }, orderBy: { sortOrder: 'asc' } },
        addons: {
          where: {
            addonPackage: {
              isActive: true
            }
          },
          include: {
            addonPackage: {
              select: {
                id: true,
                countryId: true,
                title: true,
                subtitle: true,
                slug: true,
                description: true,
                durationDays: true,
                durationNights: true,
                type: true,
                isActive: true,
                gallery: { include: { image: true }, where: { isCover: true } }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ pkg });
  } catch (error: any) {
    console.error('Error fetching package details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch package details' },
      { status: 500 }
    );
  }
}
