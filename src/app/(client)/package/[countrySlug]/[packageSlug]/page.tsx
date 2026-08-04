import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DynamicPlanHeroSection } from '@/components/package/DynamicPlanHeroSection';
import { PackageHighlightsBar } from '@/components/package/PackageHighlightsBar';
import { DynamicJourneyPlanner } from '@/components/package/DynamicJourneyPlanner';
import { HandpickedHotels } from '@/components/package/HandpickedHotels';
import { PerfectFor } from '@/components/client/PerfectFor';
import { LocalCuisine } from '@/components/package/LocalCuisine';
import GoodToKnow from '@/components/client/GoodToKnow';
import { Testimonials } from '@/components/client/Testimonials';
import { TravelWithConfidence } from '@/components/client/TravelWithConfidence';
import { AboveFooterSection } from '@/components/client/AboveFooterSection';
import React from 'react';

export default async function PackagePage({
  params,
}: {
  params: Promise<{ countrySlug: string; packageSlug: string }>;
}) {
  const resolvedParams = await params;
  const { countrySlug, packageSlug } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/packages/${packageSlug}`, {
    cache: 'no-store' // Ensure we get fresh data
  });

  if (!res.ok) {
    import('next/navigation').then(m => m.notFound());
    return null;
  }

  const data = await res.json();
  const pkg = data.pkg;

  if (!pkg) {
    import('next/navigation').then(m => m.notFound());
    return null;
  }

  const siblingPackages = await prisma.package.findMany({
    where: {
      countryId: pkg.countryId,
      type: 'MAIN',
      isActive: true,
    },
    include: {
      gallery: {
        include: { image: true },
        where: { isCover: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });


                                            console.log(`[Package Page] API response for ${packageSlug}:`, JSON.stringify({ pkg }, null, 2));

                                            // Map cover image for current package
                                            const coverImageObj = pkg.gallery.find((g: any) => g.isCover) || pkg.gallery[0];
                                            const coverImageUrl = coverImageObj?.image?.url || '/images/plans/thag.png';

                                            // Map sibling packages for hero cards
                                            const heroCards = siblingPackages.map((sp: any) => {
                                              const spCover = sp.gallery.find((g: any) => g.isCover) || sp.gallery[0];
                                              return {
                                                id: sp.id,
                                                title: sp.title,
                                                slug: sp.slug,
                                                coverImage: spCover?.image?.url
                                              };
                                            });

                                            // Define custom styles for theme colors
                                            const pageStyle = {
                                              '--pkg-primary': pkg.primaryColor || '#EAA923',
                                              '--pkg-secondary': pkg.secondaryColor || '#ffedd5',
                                            } as React.CSSProperties;

                                            const serializedPkg = serializeDecimals(pkg);

                                            return (
                                              <main className="relative w-full" style={pageStyle}>
                                                <DynamicPlanHeroSection
                                                  currentPackageSlug={pkg.slug}
                                                  countryName={pkg.country.name}
                                                  countrySlug={countrySlug}
                                                  packages={heroCards}
                                                  coverImageUrl={coverImageUrl}
                                                  title={pkg.title}
                                                  subtitle={pkg.subtitle || ''}
                                                />
                                                
                                                <PackageHighlightsBar
                                                  slug={pkg.slug}
                                                  countryName={pkg.country.name}
                                                  durationDays={pkg.durationDays}
                                                  durationNights={pkg.durationNights}
                                                  primaryColor={pkg.primaryColor || '#EAA923'}
                                                  bestTimeToTravel={pkg.bestTimeToTravel}
                                                  weather={pkg.weather}
                                                  travelTime={pkg.travelTime}
                                                  tourDurationText={pkg.tourDuration}
                                                  tourStyle={pkg.tourStyle}
                                                  highlights={pkg.highlights}
                                                />
                                                
                                                <DynamicJourneyPlanner pkg={serializedPkg} countrySlug={countrySlug} />
                                                
                                                <HandpickedHotels 
                                                  hotels={serializedPkg.hotels} 
                                                  primaryColor={pkg.primaryColor || '#EAA923'} 
                                                />
                                                <PerfectFor 
                                                  primaryColor={pkg.primaryColor || '#EAA923'}
                                                  bgImageUrl={pkg.whyLoveBgImage?.url} 
                                                />
                                                {/* Good to Know Section */}
                                                {pkg.goodToKnows.length > 0 && (
                                                  <GoodToKnow 
                                                    items={pkg.goodToKnows as any} 
                                                    primaryColor={pkg.primaryColor || '#EAA923'} 
                                                  />
                                                )}

                                                {/* Footer CTA */}
                                                <LocalCuisine 
                                                   cuisines={serializedPkg.localCuisines} 
                                                   primaryColor={pkg.primaryColor || '#EAA923'} 
                                                   bgImageUrl={pkg.cuisineBgImage?.url}
                                                 />

                                                 <Testimonials />

                                                 <TravelWithConfidence primaryColor={pkg.primaryColor || '#EAA923'} />

                                                 <AboveFooterSection
                                                  title={pkg.footerTitle}
                                                  imageUrl={pkg.footerImage?.url}
                                                  countryName={pkg.country.name}
                                                  packageTitle={pkg.title}
                                                />
                                              </main>
                                            );
                                          }

                                          function serializeDecimals(obj: any): any {
                                            if (obj === null || obj === undefined) return obj;
                                            
                                            if (typeof obj === 'object' && obj.constructor && (obj.constructor.name === 'Decimal' || obj.d !== undefined)) {
                                              return Number(obj.toString());
                                            }

                                            if (obj instanceof Date) {
                                              return obj;
                                            }

                                            if (Array.isArray(obj)) {
                                              return obj.map(serializeDecimals);
                                            }

                                            if (typeof obj === 'object') {
                                              const serialized: any = {};
                                              for (const key of Object.keys(obj)) {
                                                serialized[key] = serializeDecimals(obj[key]);
                                              }
                                              return serialized;
                                            }

                                            return obj;
                                          }
