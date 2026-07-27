import React from 'react';
import { ResponsiveHero } from '@/components/client/ResponsiveHero';
import { prisma } from '@/lib/prisma';

export default async function Home() {
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

  console.log('[Home Page] Database query:', JSON.stringify(countries, null, 2));

  return (
    <div className="h-screen w-full relative">
      <ResponsiveHero initialCountries={JSON.parse(JSON.stringify(countries))} />
    </div>
  );
}
