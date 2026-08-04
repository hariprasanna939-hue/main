import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PlanHeroSection } from '@/components/client/PlanHeroSection';
import { JourneyPlanner } from '@/components/client/JourneyPlanner';
import { HandpickedHotels } from '@/components/package/HandpickedHotels';
import { PerfectFor } from '@/components/client/PerfectFor';
import { LocalCuisine } from '@/components/package/LocalCuisine';
import { Testimonials } from '@/components/client/Testimonials';
import { TravelWithConfidence } from '@/components/client/TravelWithConfidence';

interface ToursPageProps {
  searchParams: Promise<{ country?: string; search?: string }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const resolvedSearchParams = await searchParams;
  const countryParam = resolvedSearchParams.country;

  if (countryParam) {
    // Look up the country in the database
    const countries = await prisma.country.findMany();
    const matchedCountry = countries.find(c => 
      c.name.toLowerCase().replace(/\s+/g, '') === countryParam.toLowerCase().replace(/\s+/g, '')
    );

    if (matchedCountry) {
      // Find the first active MAIN package for this country
      const pkg = await prisma.package.findFirst({
        where: {
          countryId: matchedCountry.id,
          type: 'MAIN',
          isActive: true,
        },
        orderBy: { sortOrder: 'asc' },
        select: { slug: true }
      });

      if (pkg) {
        const countrySlug = matchedCountry.name.toLowerCase().replace(/\s+/g, '');
        redirect(`/package/${countrySlug}/${pkg.slug}`);
      }
    }
  }

  // Fallback to the default Journey Planner layout (mockup page)
  return (
    <div className="w-full min-h-screen bg-background">
      <PlanHeroSection />
      <JourneyPlanner />
      <HandpickedHotels />
      <PerfectFor />
      <LocalCuisine />
      <Testimonials />
      <TravelWithConfidence />
    </div>
  );
}
