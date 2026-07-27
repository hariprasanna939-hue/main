'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Palette, 
  Check, 
  X, 
  Star, 
  Award, 
  Info, 
  DollarSign, 
  Image as ImageIcon,
  Compass,
  ArrowLeft,
  Utensils
} from 'lucide-react';

export default function PackageViewer({
  pkg,
  type
}: {
  pkg: any;
  type: 'MAIN' | 'ADDON';
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');

  if (!pkg) return null;

  const isAddon = type === 'ADDON';
  const label = isAddon ? 'Add-on' : 'Package';
  const backPath = isAddon ? '/admin/addons' : '/admin/packages';

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'highlights', label: `Highlights (${pkg.highlights?.length || 0})` },
    { id: 'itinerary', label: `Itinerary (${pkg.itineraries?.length || 0})` },
    { id: 'experiences', label: `Experiences (${pkg.experiences?.length || 0})` },
    { id: 'hotels', label: `Hotels (${pkg.hotels?.length || 0})` },
    { id: 'localCuisines', label: `Local Cuisines (${pkg.localCuisines?.length || 0})` },
    { id: 'goodToKnow', label: `Good to Know (${pkg.goodToKnows?.length || 0})` },
    { id: 'pricing', label: `Price Packages (${pkg.pricePackages?.length || 0})` },
    { id: 'perfectFor', label: `Perfect For (${pkg.perfectFors?.length || 0})` },
    { id: 'footer', label: 'Footer CTA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              isAddon ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'
            }`}>
              {label}
            </span>
            {pkg.isPublished ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200/50 uppercase tracking-wide">
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200/50 uppercase tracking-wide">
                Draft
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{pkg.title}</h1>
          {pkg.subtitle && <p className="text-slate-500 mt-1 font-medium">{pkg.subtitle}</p>}
        </div>
        <div className="flex space-x-2 shrink-0">
          <Button variant="outline" className="gap-2" onClick={() => router.push(`${backPath}/${pkg.id}`)}>
            Edit {label}
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push(backPath)}>
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#ebb337] text-[#ebb337]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-850">Basic Overview</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</h3>
                      <p className="text-base font-semibold text-slate-800 mt-1">{pkg.title}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug</h3>
                      <p className="text-base font-mono text-slate-800 mt-1 bg-slate-50 px-2 py-0.5 rounded w-fit text-sm">{pkg.slug}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Country / Region</h3>
                      <p className="text-base font-semibold text-slate-850 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {pkg.country?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</h3>
                      <p className="text-base font-semibold text-slate-850 mt-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        {pkg.durationDays} Days / {pkg.durationNights} Nights
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</h3>
                    <p className="text-slate-700 text-sm whitespace-pre-wrap mt-2 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {pkg.description || 'No description provided.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Design System/Colors Card */}
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-850">Visual Design System</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Color</h3>
                      <div className="flex items-center gap-2 mt-1.5 bg-slate-50/80 p-2 rounded-lg border border-slate-100 w-fit">
                        <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: pkg.primaryColor || '#ebb337' }}></div>
                        <span className="font-mono text-sm font-semibold">{pkg.primaryColor || '#ebb337'}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secondary Color</h3>
                      <div className="flex items-center gap-2 mt-1.5 bg-slate-50/80 p-2 rounded-lg border border-slate-100 w-fit">
                        <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: pkg.secondaryColor || '#fdf7e7' }}></div>
                        <span className="font-mono text-sm font-semibold">{pkg.secondaryColor || '#fdf7e7'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Columns (Publish info) */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-850 pb-3 border-b border-slate-100">Status Settings</h2>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-slate-650">Featured Package</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pkg.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {pkg.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-slate-650">Published</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pkg.isPublished ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {pkg.isPublished ? 'Yes' : 'No'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab: Highlights */}
        {activeTab === 'highlights' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Banner Highlights</h2>
              </div>

              {!pkg.highlights || pkg.highlights.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No highlights configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.highlights.map((hl: any, index: number) => (
                    <div key={hl.id || index} className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm flex items-center gap-4">
                      {hl.icon?.image?.url ? (
                        <div className="w-12 h-12 rounded-xl bg-[#ebb337]/10 flex items-center justify-center p-2 shrink-0">
                          <img src={hl.icon.image.url} alt={hl.title} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                          No Icon
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{hl.title}</span>
                        <span className="font-bold text-slate-800 text-base block">{hl.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Itinerary */}
        {activeTab === 'itinerary' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Day-by-Day Itinerary Plan</h2>
              </div>

              {!pkg.itineraries || pkg.itineraries.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No itinerary days configured for this package.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 ml-4">
                  {pkg.itineraries.map((it: any) => (
                    <div key={it.id} className="relative">
                      {/* Timeline Indicator */}
                      <span className="absolute -left-[35px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#ebb337] text-white font-bold text-xs ring-4 ring-white">
                        {it.dayNumber}
                      </span>
                      
                      <div className="bg-white p-5 rounded-xl border border-slate-150/70 shadow-sm ml-2">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-2">
                            <h4 className="text-base font-bold text-slate-800">
                              Day {it.dayNumber}: {it.title}
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                              {it.description}
                            </p>
                          </div>
                          {it.image?.url && (
                            <div className="md:w-48 shrink-0">
                              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                <img src={it.image.url} alt={it.title} className="w-full h-full object-cover" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Experiences */}
        {activeTab === 'experiences' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Curated Experiences</h2>
              </div>

              {!pkg.experiences || pkg.experiences.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No experiences configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.experiences.map((exp: any, index: number) => (
                    <div key={exp.id || index} className="border border-slate-150/80 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                      <div className="bg-slate-100 p-1 shrink-0 h-48">
                        {exp.imageOne?.url ? (
                          <img src={exp.imageOne.url} alt={`${exp.title} - Image`} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-xs border border-dashed rounded-lg">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 space-y-2">
                        <h4 className="text-base font-bold text-slate-800">{exp.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Hotels */}
        {activeTab === 'hotels' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Accommodations & Hotels</h2>
              </div>

              {!pkg.hotels || pkg.hotels.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No hotels configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.hotels.map((hotel: any, index: number) => (
                    <div key={hotel.id || index} className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                      <div className="aspect-video w-full bg-slate-100 border-b relative">
                        {hotel.image?.url ? (
                          <img src={hotel.image.url} alt={hotel.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{hotel.title}</h4>
                          <div className="flex items-center text-yellow-500 gap-0.5">
                            {Array.from({ length: hotel.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{hotel.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 5: Local Cuisines */}
        {activeTab === 'localCuisines' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Local Cuisines</h2>
              </div>

              {!pkg.localCuisines || pkg.localCuisines.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No local cuisines configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.localCuisines.map((lc: any, index: number) => (
                    <div key={lc.id || index} className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {lc.image?.url && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={lc.image.url} alt={lc.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {lc.icon?.image?.url && (
                            <img src={lc.icon.image.url} alt="Icon" className="w-6 h-6 object-contain" />
                          )}
                          <h4 className="font-bold text-slate-800">{lc.title}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 6: Good to Know */}
        {activeTab === 'goodToKnow' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Good to Know / Travel Info</h2>
              </div>

              {!pkg.goodToKnows || pkg.goodToKnows.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No good to know items configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.goodToKnows.map((gtk: any, index: number) => (
                    <div key={gtk.id || index} className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm space-y-4">
                      {gtk.icon?.image?.url && (
                        <div className="w-12 h-12 rounded-xl bg-[#ebb337]/10 flex items-center justify-center p-2">
                          <img src={gtk.icon.image.url} alt={gtk.title} className="w-full h-full object-contain filter" style={{ filter: 'sepia(1) saturate(5) hue-rotate(5deg)' }} />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800">{gtk.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{gtk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 7: Price Packages */}
        {activeTab === 'pricing' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Price Options & Tiers</h2>
              </div>

              {!pkg.pricePackages || pkg.pricePackages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No price packages configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.pricePackages.map((pp: any, index: number) => (
                    <div 
                      key={pp.id || index} 
                      className={`border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between space-y-4 relative ${
                        pp.isDefault ? 'border-[#ebb337] ring-1 ring-[#ebb337]' : 'border-slate-150'
                      }`}
                    >
                      {pp.isDefault && (
                        <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ebb337] text-white uppercase tracking-wider">
                          Default
                        </span>
                      )}

                      <div className="space-y-2">
                        <h4 className="font-bold text-lg text-slate-850 pr-12 line-clamp-1">{pp.title}</h4>
                        {pp.subtitle && <p className="text-slate-400 text-xs font-semibold">{pp.subtitle}</p>}
                        <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-wrap">{pp.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                        <span className="text-2xl font-bold text-[#ebb337] mt-1 block">
                          ₹{pp.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 8: Perfect For */}
        {activeTab === 'perfectFor' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Perfect For</h2>
              </div>

              {!pkg.perfectFors || pkg.perfectFors.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No perfect for items configured for this package.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.perfectFors.map((pf: any, index: number) => (
                    <div key={pf.id || index} className="border border-slate-150 rounded-xl p-4 bg-white shadow-sm flex items-center gap-3">
                      {pf.icon?.image?.url && (
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center p-2 border border-slate-100 shrink-0">
                          <img src={pf.icon.image.url} alt="Icon" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <span className="font-bold text-slate-800 text-sm">{pf.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 9: Footer CTA */}
        {activeTab === 'footer' && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-850">Footer Call To Action</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Footer Title</h3>
                    <p className="text-lg font-bold text-slate-850 mt-1">{pkg.footerTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Footer Subtitle</h3>
                    <p className="text-slate-650 text-sm mt-1 leading-relaxed">{pkg.footerSubtitle || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Footer Background Image</h3>
                  {pkg.footerImage?.url ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={pkg.footerImage.url} alt="Footer CTA Image" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-350" />
                      No footer background image selected
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
