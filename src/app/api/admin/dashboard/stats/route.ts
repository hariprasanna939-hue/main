import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // 1. Countries count (total and active)
    const [totalCountries, activeCountries] = await Promise.all([
      prisma.country.count(),
      prisma.country.count({ where: { isActive: true } })
    ]);

    // 2. Packages count (total and active, main vs addon)
    const [totalPackages, activePackages, totalAddons, activeAddons] = await Promise.all([
      prisma.package.count({ where: { type: 'MAIN' } }),
      prisma.package.count({ where: { type: 'MAIN', isActive: true } }),
      prisma.package.count({ where: { type: 'ADDON' } }),
      prisma.package.count({ where: { type: 'ADDON', isActive: true } })
    ]);

    // 3. Testimonials count (total and active)
    const [totalTestimonials, activeTestimonials] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isActive: true } })
    ]);

    // 4. Icons count
    const totalIcons = await prisma.icon.count();

    // 5. Packages by Country count
    const countriesWithCounts = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            packages: {
              where: { type: 'MAIN' }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // 6. Pricing overview: average default price of main packages
    const defaultPrices = await prisma.pricePackage.findMany({
      where: {
        isDefault: true,
        package: { type: 'MAIN' }
      },
      select: {
        price: true
      }
    });
    
    const averagePrice = defaultPrices.length > 0
      ? defaultPrices.reduce((sum, p) => sum + Number(p.price), 0) / defaultPrices.length
      : 0;

    return NextResponse.json({
      countries: {
        total: totalCountries,
        active: activeCountries
      },
      packages: {
        total: totalPackages,
        active: activePackages
      },
      addons: {
        total: totalAddons,
        active: activeAddons
      },
      testimonials: {
        total: totalTestimonials,
        active: activeTestimonials
      },
      icons: {
        total: totalIcons
      },
      averagePrice: Math.round(averagePrice),
      countriesWithCounts: countriesWithCounts.map(c => ({
        id: c.id,
        name: c.name,
        count: c._count.packages
      }))
    });
  } catch (error: any) {
    console.error('[DASHBOARD_STATS_API]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
