import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import { IndiaHero } from '@/components/client/IndiaHero';
import { IndiaRegionsSelector } from '@/components/client/IndiaRegionsSelector';
import { IndiaTrustFeatures } from '@/components/client/IndiaTrustFeatures';
import { IndiaTravelWithConfidence } from '@/components/client/IndiaTravelWithConfidence';
import { AboveFooterSection } from '@/components/client/AboveFooterSection';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

const getCountryData = cache(async (slug: string) => {
  let countryNameQuery = slug;
  if (slug.toLowerCase() === 'srilanka' || slug.toLowerCase() === 'sri-lanka') {
    countryNameQuery = 'Sri Lanka';
  } else if (slug.toLowerCase() === 'india') {
    countryNameQuery = 'India';
  }

  return prisma.country.findFirst({
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
      heroDesktopImage: true,
      heroMobileImage: true,
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
          },
          experiences: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              imageOne: {
                select: { url: true }
              }
            }
          }
        }
      }
    }
  });
});

export async function generateMetadata({ params }: { params: Promise<{ countrySlug: string }> }): Promise<Metadata> {
  const { countrySlug } = await params;

  try {
    const country = await getCountryData(countrySlug);
    if (!country) return { title: 'Country Not Found' };
    return {
      title: country?.seoMeta?.title || `Luxury Private Tours to ${country?.name || countrySlug}`,
      description: country?.seoMeta?.description || `Embark on an unforgettable journey through ${country?.name || countrySlug}.`,
      keywords: country?.seoMeta?.keywords || `${country?.name || countrySlug} travel, luxury tours, private tours`,
    };
  } catch (err) {
    return { title: 'Country Not Found' };
  }
}

export default async function CountryPage({ params }: { params: Promise<{ countrySlug: string }> }) {
  const { countrySlug } = await params;

  const country = await getCountryData(countrySlug);

  if (!country) {
    notFound();
  }

  console.log(`[Country Page] Database query response for ${countrySlug}:`, JSON.stringify({ country }, null, 2));

  // The components below are currently hardcoded for India, 
  // but they can receive `country` as a prop in the future for true dynamic rendering.
  return (
    <div
      className="w-full bg-background min-h-screen"
      style={{
        '--country-primary': country.primaryColor || '#EAA923',
        '--country-secondary': country.secondaryColor || '#ffedd5',
      } as React.CSSProperties}
    >
      <IndiaHero 
        heroDesktopUrl={country.heroDesktopImage?.url || undefined}
        heroMobileUrl={country.heroMobileImage?.url || undefined}
      />
      <IndiaRegionsSelector packages={country.packages || []} countrySlug={countrySlug} />
      <IndiaTrustFeatures />
      <IndiaTravelWithConfidence />
      <AboveFooterSection
        title="Let's plan your escape."
        imageUrl={country.footerImage?.url || undefined}
        countryName={country.name}
      />
    </div>
  );
}
