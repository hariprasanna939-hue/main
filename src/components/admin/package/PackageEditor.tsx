'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Layout, Calendar, Heart, Landmark, HelpCircle, DollarSign, Image as ImageIcon, Utensils, Star, Award } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

const uploadImage = async (formData: FormData) => {
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

type PackageItem = any;
type CountryItem = { id: string; name: string };
const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const TABS = [
  { id: 'general', label: 'General Info', icon: Layout },
  { id: 'highlights', label: 'Banner Highlights', icon: Award },
  { id: 'itinerary', label: 'Itinerary Days', icon: Calendar },
  { id: 'experiences', label: 'Experiences', icon: Heart },
  { id: 'hotels', label: 'Hotels', icon: Landmark },
  { id: 'localCuisines', label: 'Local Cuisines', icon: Utensils },
  { id: 'goodToKnow', label: 'Good to Know', icon: HelpCircle },
  { id: 'pricing', label: 'Pricing Options', icon: DollarSign },
  { id: 'perfectFor', label: 'Perfect For', icon: Star },
  { id: 'whyLove', label: 'Why Love Holiday', icon: ImageIcon },
  { id: 'footer', label: 'Footer CTA', icon: ImageIcon }
];

export default function PackageEditor({
  pkg,
  countries,
  type,
  mainPackages
}: {
  pkg: PackageItem | null;
  countries: CountryItem[];
  type: 'MAIN' | 'ADDON';
  mainPackages?: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(pkg?.title || '');
  const [subtitle, setSubtitle] = useState(pkg?.subtitle || '');
  const [slug, setSlug] = useState(pkg?.slug || '');
  const [description, setDescription] = useState(pkg?.description || '');
  const [durationDays, setDurationDays] = useState(pkg?.durationDays || 1);
  const [durationNights, setDurationNights] = useState(pkg?.durationNights || 0);

  const [bestTimeToTravel, setBestTimeToTravel] = useState(pkg?.bestTimeToTravel || '');
  const [weather, setWeather] = useState(pkg?.weather || '');
  const [travelTime, setTravelTime] = useState(pkg?.travelTime || '');
  const [tourDuration, setTourDuration] = useState(pkg?.tourDuration || '');
  const [tourStyle, setTourStyle] = useState(pkg?.tourStyle || '');
  const [highlights, setHighlights] = useState<any[]>(pkg?.highlights || []);
  const [openHlIconDropdownId, setOpenHlIconDropdownId] = useState<number | null>(null);

  const [countryId, setCountryId] = useState(pkg?.countryId || countries[0]?.id || '');
  const [mainPackageId, setMainPackageId] = useState(pkg?.addonFor?.[0]?.packageId || mainPackages?.[0]?.id || '');
  const [primaryColor, setPrimaryColor] = useState(pkg?.primaryColor || '#bfdbfe');
  const [isActive, setIsActive] = useState(pkg?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState<number>(pkg?.sortOrder || 0);
  const [itineraries, setItineraries] = useState<any[]>(pkg?.itineraries?.map((it: any) => ({
    ...it,
    iconIds: it.icons?.map((i: any) => i.id) || []
  })) || []);
  const [uploadingItineraryMap, setUploadingItineraryMap] = useState<Record<number, boolean>>({});

  const [experiences, setExperiences] = useState<any[]>(pkg?.experiences || []);
  const [hotels, setHotels] = useState<any[]>(pkg?.hotels || []);
  const [goodToKnows, setGoodToKnows] = useState<any[]>(pkg?.goodToKnows || []);
  const [perfectFors, setPerfectFors] = useState<any[]>(pkg?.perfectFors || []);
  const [localCuisines, setLocalCuisines] = useState<any[]>(pkg?.localCuisines || []);
  const [pricePackages, setPricePackages] = useState<any[]>(pkg?.pricePackages || []);
  const [bestSeasons, setBestSeasons] = useState<any[]>(pkg?.bestSeasons || []);

  const [iconsList, setIconsList] = useState<any[]>([]);
  const [openIconDropdownId, setOpenIconDropdownId] = useState<number | null>(null);
  const [openLcIconDropdownId, setOpenLcIconDropdownId] = useState<number | null>(null);
  const [openGtkIconDropdownId, setOpenGtkIconDropdownId] = useState<number | null>(null);
  const [openPfIconDropdownId, setOpenPfIconDropdownId] = useState<number | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/icons').then(r => r.json()).then(data => setIconsList(data)).catch(console.error);
  }, []);

  const [uploadingExpMap, setUploadingExpMap] = useState<Record<string, boolean>>({});
  const [uploadingHotelMap, setUploadingHotelMap] = useState<Record<number, boolean>>({});
  const [uploadingGtkMap, setUploadingGtkMap] = useState<Record<number, boolean>>({});
  const [uploadingLocalCuisineMap, setUploadingLocalCuisineMap] = useState<Record<number, boolean>>({});

  const [footerTitle, setFooterTitle] = useState(pkg?.footerTitle || '');
  const [footerImageId, setFooterImageId] = useState(pkg?.footerImageId || '');
  const [footerImage, setFooterImage] = useState<any>(pkg?.footerImage || null);
  const [uploadingFooter, setUploadingFooter] = useState(false);

  const [cuisineBgImageId, setCuisineBgImageId] = useState(pkg?.cuisineBgImageId || '');
  const [cuisineBgImage, setCuisineBgImage] = useState<any>(pkg?.cuisineBgImage || null);
  const [uploadingCuisineBg, setUploadingCuisineBg] = useState(false);

  const [whyLoveBgImageId, setWhyLoveBgImageId] = useState(pkg?.whyLoveBgImageId || '');
  const [whyLoveBgImage, setWhyLoveBgImage] = useState<any>(pkg?.whyLoveBgImage || null);
  const [uploadingWhyLoveBg, setUploadingWhyLoveBg] = useState(false);

  const defaultCover = pkg?.gallery?.find((g: any) => g.isCover);
  const [coverImageId, setCoverImageId] = useState(defaultCover?.imageId || '');
  const [coverImage, setCoverImage] = useState<any>(defaultCover?.image || null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const isAddon = type === 'ADDON';
  const label = isAddon ? 'Add-on' : 'Package';
  const backPath = isAddon ? '/admin/addons' : '/admin/packages';

  const selectedCountryName = countries.find(c => c.id === countryId)?.name || '';
  const selectedIsoCode = Country.getAllCountries().find(c => c.name.toLowerCase() === selectedCountryName.toLowerCase())?.isoCode || '';

  // Automatically update countryId when a main package is selected for an addon
  React.useEffect(() => {
    if (isAddon && mainPackages && mainPackageId) {
      const selected = mainPackages.find(p => p.id === mainPackageId);
      if (selected && selected.countryId) {
        setCountryId(selected.countryId);
      }
    }
  }, [isAddon, mainPackages, mainPackageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      subtitle,
      slug,
      description,
      durationDays,
      durationNights,
      bestTimeToTravel: null,
      weather: null,
      travelTime: null,
      tourDuration: null,
      tourStyle: null,
      highlights: highlights.map(hl => ({
        title: hl.title,
        value: hl.value,
        iconId: hl.iconId || null
      })),
      countryId,
      mainPackageId: isAddon ? mainPackageId : null,
      primaryColor,
      isActive,
      sortOrder,
      type,
      coverImageId,
      footerTitle,
      footerImageId,
      cuisineBgImageId,
      whyLoveBgImageId,
      itineraries: itineraries.map((it, i) => ({
        dayNumber: i + 1,
        title: it.title,
        description: it.description,
        imageId: it.imageId || null,
        country: it.country || null,
        state: it.state || null,
        city: it.city || null,
        lat: it.lat !== undefined ? it.lat : null,
        lng: it.lng !== undefined ? it.lng : null,
        iconIds: it.iconIds || []
      })),
      experiences: experiences.map(exp => ({
        title: exp.title,
        description: exp.description,
        imageOneId: exp.imageOneId
      })),
      hotels: hotels.map(hotel => ({
        title: hotel.title,
        description: hotel.description,
        rating: hotel.rating,
        imageId: hotel.imageId
      })),
      goodToKnows: goodToKnows.map(gtk => ({
        title: gtk.title,
        description: gtk.description,
        iconId: gtk.iconId
      })),
      perfectFors: perfectFors.map(pf => ({
        title: pf.title,
        iconId: pf.iconId
      })),
      localCuisines: localCuisines.map(lc => ({
        title: lc.title,
        iconId: lc.iconId,
        imageId: lc.imageId
      })),
      pricePackages: pricePackages.map(pp => ({
        title: pp.title,
        subtitle: pp.subtitle,
        description: pp.description,
        price: pp.price,
        isDefault: pp.isDefault
      })),
      bestSeasons: bestSeasons.map(bs => ({
        month: bs.month,
        type: bs.type
      }))
    };

    try {
      const url = pkg ? `/api/admin/packages/${pkg.id}` : '/api/admin/packages';
      const method = pkg ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save package');
      router.push(backPath);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(`Failed to save ${label.toLowerCase()}. Error: ${err instanceof Error ? err.message : String(err)}`);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Sticky Header with Action Buttons */}
      <div className="sticky top-0 bg-[#FAF8F6]/95 backdrop-blur-md z-30 py-4 border-b border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{pkg ? `Edit ${label}` : `Add New ${label}`}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{title ? `Editing: ${title}` : `Configure details for your new ${label.toLowerCase()}`}</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push(backPath)} className="bg-white rounded-xl">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#ebb337] text-slate-950 hover:bg-[#d9a52e] font-semibold rounded-xl min-w-[120px] shadow-sm shadow-[#ebb337]/20">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200/60 overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-100/50 rounded-xl">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#ebb337]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  required
                  type="text"
                  label="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. The Golden Triangle Tour"
                />
                <Input
                  required
                  type="text"
                  label="Slug (URL)"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="e.g. golden-triangle"
                />
              </div>

              <Input
                type="text"
                label="Subtitle"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. A majestic journey through Delhi, Agra, and Jaipur"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isAddon ? (
                  <Select
                    required
                    label="Main Package"
                    value={mainPackageId}
                    onChange={e => setMainPackageId(e.target.value)}
                  >
                    <option value="" disabled>Select a package</option>
                    {mainPackages?.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    required
                    label="Country / Region"
                    value={countryId}
                    onChange={e => setCountryId(e.target.value)}
                  >
                    <option value="" disabled>Select a country</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    required
                    type="number"
                    min="1"
                    label="Duration (Days)"
                    value={durationDays}
                    onChange={e => setDurationDays(Number(e.target.value))}
                  />
                  <Input
                    required
                    type="number"
                    min="0"
                    label="Duration (Nights)"
                    value={durationNights}
                    onChange={e => setDurationNights(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Cover Image</label>
                  {coverImageId && (
                    <div className="w-full h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-3">
                      <img src={coverImage?.url || ''} alt="Cover" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none transition-all"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingCover(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const newImage = await uploadImage(formData);
                        setCoverImageId(newImage.id);
                        setCoverImage(newImage);
                      } catch (err) {
                        alert('Failed to upload cover image.');
                      } finally {
                        setUploadingCover(false);
                      }
                    }}
                  />
                  {uploadingCover && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Color</label>
                      <input
                        type="color"
                        className="w-full h-10 px-1 py-1 bg-white border border-slate-200 rounded-xl cursor-pointer focus:outline-none transition-all"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Sort Order"
                      value={sortOrder}
                      onChange={e => setSortOrder(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex gap-6 pt-4">
                    <Checkbox
                      label="Active (Visible to users)"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                    />
                  </div>
                </div>
              </div>

              <Textarea
                required
                rows={6}
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the package itinerary, vibes, and target audience..."
              />

              <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Season Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['BEST', 'MODERATE', 'OFF_SEASON'].map((seasonType) => (
                    <div key={seasonType} className="space-y-2">
                      <label className="block text-xs font-semibold tracking-wider text-slate-700">
                        {seasonType.replace('_', ' ')}
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 no-scrollbar border border-slate-200/60 rounded-xl p-3 bg-slate-50">
                        {MONTHS.map(month => {
                          const isSelected = bestSeasons.some(bs => bs.month === month && bs.type === seasonType);
                          const isSelectedElsewhere = bestSeasons.some(bs => bs.month === month && bs.type !== seasonType);

                          return (
                            <label key={month} className={`flex items-center gap-2 text-sm ${isSelectedElsewhere ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input
                                type="checkbox"
                                disabled={isSelectedElsewhere}
                                checked={isSelected}
                                className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBestSeasons([...bestSeasons.filter(bs => bs.month !== month), { month, type: seasonType }]);
                                  } else {
                                    setBestSeasons(bestSeasons.filter(bs => !(bs.month === month && bs.type === seasonType)));
                                  }
                                }}
                              />
                              <span className="capitalize">{month.toLowerCase()}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {/* BANNER HIGHLIGHTS TAB */}
        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Banner Highlights</h3>
                <p className="text-xs text-slate-400">Add dynamic cards displayed in the package header banner (e.g. Best Time, Weather, Tour Style)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setHighlights([...highlights, { title: '', value: '', iconId: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Highlight
              </Button>
            </div>

            <div className="space-y-4">
              {highlights.map((hl, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label="Heading / Label"
                          value={hl.title}
                          onChange={e => {
                            const newHl = [...highlights];
                            newHl[index].title = e.target.value;
                            setHighlights(newHl);
                          }}
                          placeholder="e.g. Weather, Best Time, Tour Style"
                        />
                        <Input
                          required
                          type="text"
                          label="Value"
                          value={hl.value}
                          onChange={e => {
                            const newHl = [...highlights];
                            newHl[index].value = e.target.value;
                            setHighlights(newHl);
                          }}
                          placeholder="e.g. 15°C - 30°C, Oct to Mar"
                        />
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Highlight Icon</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenHlIconDropdownId(openHlIconDropdownId === index ? null : index)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {hl.iconId ? (
                                <>
                                  {iconsList.find(i => i.id === hl.iconId)?.image?.url && (
                                    <img
                                      src={iconsList.find(i => i.id === hl.iconId).image.url}
                                      alt="icon"
                                      className="w-5 h-5 object-contain"
                                    />
                                  )}
                                  <span className="font-medium text-slate-800">
                                    {iconsList.find(i => i.id === hl.iconId)?.name || 'Selected Icon'}
                                  </span>
                                </>
                              ) : (
                                <span className="text-slate-400">Select an Icon...</span>
                              )}
                            </div>
                            <span className="text-slate-400">▼</span>
                          </button>

                          {openHlIconDropdownId === index && (
                            <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg p-2 grid grid-cols-4 gap-2">
                              {iconsList.map(icon => (
                                <button
                                  key={icon.id}
                                  type="button"
                                  onClick={() => {
                                    const newHl = [...highlights];
                                    newHl[index].iconId = icon.id;
                                    setHighlights(newHl);
                                    setOpenHlIconDropdownId(null);
                                  }}
                                  className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-slate-50 border cursor-pointer ${
                                    hl.iconId === icon.id ? 'border-[#ebb337] bg-amber-50/30' : 'border-transparent'
                                  }`}
                                >
                                  {icon.image?.url ? (
                                    <img src={icon.image.url} alt={icon.name} className="w-6 h-6 object-contain" />
                                  ) : (
                                    <span className="text-[10px] text-slate-400 break-all">{icon.name}</span>
                                  )}
                                  <span className="text-[9px] text-slate-500 truncate w-full text-center mt-1">{icon.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {highlights.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No highlights configured. Click "Add Highlight" to begin.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Itinerary Days</h3>
                <p className="text-xs text-slate-400">Add and customize daily itineraries and geo points</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setItineraries([...itineraries, { title: '', description: '', imageId: null, image: null, country: '', state: '', city: '', lat: null, lng: null, iconIds: [] }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Day
              </Button>
            </div>

            <div className="space-y-4">
              {itineraries.map((it, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setItineraries(itineraries.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label={`Day ${index + 1} Title`}
                          value={it.title}
                          onChange={e => {
                            const newIt = [...itineraries];
                            newIt[index].title = e.target.value;
                            setItineraries(newIt);
                          }}
                          placeholder="e.g. Arrival in Delhi"
                        />

                        <div className="border border-slate-200/50 bg-slate-50 p-4 rounded-xl space-y-4">
                          <h4 className="text-xs font-semibold text-slate-700">Select the location to add marker</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Country</label>
                              <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-primary transition-all"
                                value={it.country || ''}
                                onChange={e => {
                                  const cName = e.target.value;
                                  const c = Country.getAllCountries().find(c => c.name === cName);
                                  const newIt = [...itineraries];
                                  newIt[index].country = cName;
                                  newIt[index].state = '';
                                  newIt[index].city = '';
                                  if (c?.latitude && c?.longitude) {
                                    newIt[index].lat = parseFloat(c.latitude);
                                    newIt[index].lng = parseFloat(c.longitude);
                                  }
                                  setItineraries(newIt);
                                }}
                              >
                                <option value="">Select Country...</option>
                                {Country.getAllCountries().filter(c => c.name === 'India' || c.name === 'Sri Lanka').map(c => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">State</label>
                              <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-primary transition-all disabled:opacity-50"
                                value={it.state || ''}
                                disabled={!it.country}
                                onChange={e => {
                                  const sName = e.target.value;
                                  const cCode = Country.getAllCountries().find(c => c.name === it.country)?.isoCode;
                                  const s = State.getStatesOfCountry(cCode || '').find(s => s.name === sName);
                                  const newIt = [...itineraries];
                                  newIt[index].state = sName;
                                  newIt[index].city = '';
                                  if (s?.latitude && s?.longitude) {
                                    newIt[index].lat = parseFloat(s.latitude);
                                    newIt[index].lng = parseFloat(s.longitude);
                                  }
                                  setItineraries(newIt);
                                }}
                              >
                                <option value="">Select State...</option>
                                {it.country && (() => {
                                  const cCode = Country.getAllCountries().find(c => c.name === it.country)?.isoCode;
                                  return cCode ? State.getStatesOfCountry(cCode).map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>) : null;
                                })()}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">City</label>
                              <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-primary transition-all disabled:opacity-50"
                                value={it.city || ''}
                                disabled={!it.state}
                                onChange={e => {
                                  const cityName = e.target.value;
                                  const cCode = Country.getAllCountries().find(c => c.name === it.country)?.isoCode;
                                  const sCode = State.getStatesOfCountry(cCode || '').find(s => s.name === it.state)?.isoCode;
                                  const city = City.getCitiesOfState(cCode || '', sCode || '').find(city => city.name === cityName);
                                  const newIt = [...itineraries];
                                  newIt[index].city = cityName;
                                  if (city?.latitude && city?.longitude) {
                                    newIt[index].lat = parseFloat(city.latitude);
                                    newIt[index].lng = parseFloat(city.longitude);
                                  }
                                  setItineraries(newIt);
                                }}
                              >
                                <option value="">Select City...</option>
                                {it.country && it.state && (() => {
                                  const cCode = Country.getAllCountries().find(c => c.name === it.country)?.isoCode;
                                  const sCode = State.getStatesOfCountry(cCode || '').find(s => s.name === it.state)?.isoCode;
                                  if (cCode && sCode) {
                                    return City.getCitiesOfState(cCode, sCode).map(city => <option key={city.name} value={city.name}>{city.name}</option>);
                                  }
                                  return null;
                                })()}
                              </select>
                            </div>
                          </div>
                        </div>



                        <div className="space-y-1.5 relative">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Add Icon</label>
                          <div className="relative">
                            <button
                              type="button"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 transition-all text-sm outline-none cursor-pointer flex justify-between items-center"
                              onClick={() => setOpenIconDropdownId(openIconDropdownId === index ? null : index)}
                            >
                              <div className="flex items-center gap-2">
                                {it.iconIds && it.iconIds.length > 0 ? (() => {
                                  const iconObj = iconsList.find(i => i.id === it.iconIds[0]);
                                  if (iconObj) {
                                    return (
                                      <>
                                        {iconObj.image?.url && <img src={iconObj.image.url} alt={iconObj.name} className="w-5 h-5 object-contain" />}
                                        <span className="font-medium text-slate-700">{iconObj.name}</span>
                                      </>
                                    );
                                  }
                                  return <span className="text-slate-500">Select an icon...</span>;
                                })() : (
                                  <span className="text-slate-500">Select an icon...</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {it.iconIds && it.iconIds.length > 0 && (
                                  <div 
                                    className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newIt = [...itineraries];
                                      newIt[index].iconIds = [];
                                      setItineraries(newIt);
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                                  </div>
                                )}
                                <svg className="h-4 w-4 text-slate-500 transition-transform" style={{ transform: openIconDropdownId === index ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {openIconDropdownId === index && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {iconsList.map(icon => (
                                  <div
                                    key={icon.id}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${it.iconIds?.[0] === icon.id ? 'bg-primary/5' : ''}`}
                                    onClick={() => {
                                      const newIt = [...itineraries];
                                      newIt[index].iconIds = [icon.id];
                                      setItineraries(newIt);
                                      setOpenIconDropdownId(null);
                                    }}
                                  >
                                    {icon.image?.url ? (
                                      <img src={icon.image.url} alt={icon.name} className="w-6 h-6 object-contain" />
                                    ) : (
                                      <div className="w-6 h-6 bg-slate-100 rounded-full" />
                                    )}
                                    <span className="text-sm font-medium text-slate-700">{icon.name}</span>
                                  </div>
                                ))}
                                {iconsList.length === 0 && (
                                  <div className="px-4 py-3 text-sm text-slate-500 text-center">No icons found</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <Textarea
                          required
                          rows={4}
                          label="Description"
                          value={it.description}
                          onChange={e => {
                            const newIt = [...itineraries];
                            newIt[index].description = e.target.value;
                            setItineraries(newIt);
                          }}
                          placeholder="Describe the day's activities, stops, and details..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Day Image</label>
                        {it.imageId && (
                          <div className="w-full h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-3">
                            <img src={it.image?.url || ''} alt={`Day ${index + 1}`} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingItineraryMap[index]}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer focus:outline-none transition-all"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingItineraryMap(prev => ({ ...prev, [index]: true }));
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const newImage = await uploadImage(formData);
                              const newIt = [...itineraries];
                              newIt[index].imageId = newImage.id;
                              newIt[index].image = newImage;
                              setItineraries(newIt);
                            } catch (err) {
                              alert('Failed to upload image.');
                            } finally {
                              setUploadingItineraryMap(prev => ({ ...prev, [index]: false }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {itineraries.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No itinerary days added yet. Click &quot;Add Day&quot; to begin.
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXPERIENCES TAB */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Experiences</h3>
                <p className="text-xs text-slate-400">Add highlight experiences with double column image grids</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExperiences([...experiences, { title: '', description: '', imageOneId: null, imageOne: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label="Title"
                          value={exp.title}
                          onChange={e => {
                            const newExp = [...experiences];
                            newExp[index].title = e.target.value;
                            setExperiences(newExp);
                          }}
                          placeholder="e.g. Sunrise Taj Mahal Tour"
                        />
                        <Textarea
                          required
                          rows={6}
                          label="Description"
                          value={exp.description}
                          onChange={e => {
                            const newExp = [...experiences];
                            newExp[index].description = e.target.value;
                            setExperiences(newExp);
                          }}
                          placeholder="Describe this unique experience in detail..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Image</label>
                        {exp.imageOneId ? (
                          <div className="w-full h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-2 group">
                            <img src={exp.imageOne?.url || ''} alt="Experience" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <label className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer shadow-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                {uploadingExpMap[`${index}-1`] ? 'Uploading...' : 'Change Image'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingExpMap[`${index}-1`]}
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploadingExpMap(prev => ({ ...prev, [`${index}-1`]: true }));
                                    try {
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      const newImage = await uploadImage(formData);
                                      const newExp = [...experiences];
                                      newExp[index].imageOneId = newImage.id;
                                      newExp[index].imageOne = newImage;
                                      setExperiences(newExp);
                                    } catch (err) {
                                      alert('Failed to upload image.');
                                    } finally {
                                      setUploadingExpMap(prev => ({ ...prev, [`${index}-1`]: false }));
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 relative rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100/50 transition-colors">
                            <label className="flex flex-col items-center gap-2 cursor-pointer p-4 w-full h-full justify-center">
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                              <span className="text-sm font-medium text-slate-600">
                                {uploadingExpMap[`${index}-1`] ? 'Uploading...' : 'Upload Image'}
                              </span>
                              <input
                                required
                                type="file"
                                accept="image/*"
                                disabled={uploadingExpMap[`${index}-1`]}
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadingExpMap(prev => ({ ...prev, [`${index}-1`]: true }));
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    const newImage = await uploadImage(formData);
                                    const newExp = [...experiences];
                                    newExp[index].imageOneId = newImage.id;
                                    newExp[index].imageOne = newImage;
                                    setExperiences(newExp);
                                  } catch (err) {
                                    alert('Failed to upload image.');
                                  } finally {
                                    setUploadingExpMap(prev => ({ ...prev, [`${index}-1`]: false }));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {experiences.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No experiences added yet. Click &quot;Add Experience&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hotels</h3>
                <p className="text-xs text-slate-400">Configure recommended hotel stays and star ratings</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setHotels([...hotels, { title: '', description: '', rating: 5, imageId: null, image: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Hotel
              </Button>
            </div>

            <div className="space-y-4">
              {hotels.map((hotel, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setHotels(hotels.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-3">
                            <Input
                              required
                              type="text"
                              label="Hotel Name"
                              value={hotel.title}
                              onChange={e => {
                                const newHotels = [...hotels];
                                newHotels[index].title = e.target.value;
                                setHotels(newHotels);
                              }}
                              placeholder="e.g. Oberoi Amarvilas"
                            />
                          </div>
                          <div className="col-span-1">
                            <Input
                              required
                              type="number"
                              min="1" max="5" step="0.5"
                              label="Stars"
                              value={hotel.rating}
                              onChange={e => {
                                const newHotels = [...hotels];
                                newHotels[index].rating = Number(e.target.value);
                                setHotels(newHotels);
                              }}
                            />
                          </div>
                        </div>

                        <Textarea
                          required
                          rows={4}
                          label="Place"
                          value={hotel.description}
                          onChange={e => {
                            const newHotels = [...hotels];
                            newHotels[index].description = e.target.value;
                            setHotels(newHotels);
                          }}
                          placeholder="Describe hotel features, reviews, and styling details..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Hotel Image</label>
                        {hotel.imageId && (
                          <div className="w-full h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-2">
                            <img src={hotel.image?.url || ''} alt="Hotel" className="object-cover w-full h-full" />
                          </div>
                        )}
                        <input
                          required={!hotel.imageId}
                          type="file"
                          accept="image/*"
                          disabled={uploadingHotelMap[index]}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingHotelMap(prev => ({ ...prev, [index]: true }));
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const newImage = await uploadImage(formData);
                              const newHotels = [...hotels];
                              newHotels[index].imageId = newImage.id;
                              newHotels[index].image = newImage;
                              setHotels(newHotels);
                            } catch (err) {
                              alert('Failed to upload image.');
                            } finally {
                              setUploadingHotelMap(prev => ({ ...prev, [index]: false }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {hotels.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No hotels added yet. Click &quot;Add Hotel&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* GOOD TO KNOW TAB */}
        {activeTab === 'goodToKnow' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Good To Know</h3>
                <p className="text-xs text-slate-400">Add tips, visa requirements, packing lists, or regional guidance</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGoodToKnows([...goodToKnows, { title: '', description: '', iconId: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {goodToKnows.map((gtk, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setGoodToKnows(goodToKnows.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label="Title"
                          value={gtk.title}
                          onChange={e => {
                            const newGtk = [...goodToKnows];
                            newGtk[index].title = e.target.value;
                            setGoodToKnows(newGtk);
                          }}
                          placeholder="e.g. Visa Requirements"
                        />
                        <Textarea
                          required
                          rows={4}
                          label="Description"
                          value={gtk.description}
                          onChange={e => {
                            const newGtk = [...goodToKnows];
                            newGtk[index].description = e.target.value;
                            setGoodToKnows(newGtk);
                          }}
                          placeholder="Provide tips, travel warnings, or preparation notes..."
                        />
                      </div>

                      <div className="hidden space-y-1.5 relative">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Item Icon</label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 transition-all text-sm outline-none cursor-pointer flex justify-between items-center"
                            onClick={() => setOpenGtkIconDropdownId(openGtkIconDropdownId === index ? null : index)}
                          >
                            {gtk.iconId ? (
                              <div className="flex items-center gap-2">
                                {iconsList.find(i => i.id === gtk.iconId)?.image?.url && (
                                  <img src={iconsList.find(i => i.id === gtk.iconId)?.image?.url} alt="Icon" className="w-5 h-5 object-contain" />
                                )}
                                <span className="font-medium">{iconsList.find(i => i.id === gtk.iconId)?.name || 'Unknown Icon'}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">Select an icon...</span>
                            )}
                            <svg className="h-4 w-4 text-slate-500 transition-transform" style={{ transform: openGtkIconDropdownId === index ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {openGtkIconDropdownId === index && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                              {iconsList.map(icon => (
                                <div
                                  key={icon.id}
                                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                                  onClick={() => {
                                    const newGtk = [...goodToKnows];
                                    newGtk[index].iconId = icon.id;
                                    setGoodToKnows(newGtk);
                                    setOpenGtkIconDropdownId(null);
                                  }}
                                >
                                  {icon.image?.url ? (
                                    <img src={icon.image.url} alt={icon.name} className="w-6 h-6 object-contain" />
                                  ) : (
                                    <div className="w-6 h-6 bg-slate-100 rounded-full" />
                                  )}
                                  <span className="text-sm font-medium text-slate-700">{icon.name}</span>
                                </div>
                              ))}
                              {iconsList.length === 0 && (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center">No icons found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {goodToKnows.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No items added yet. Click &quot;Add Item&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERFECT FOR TAB */}
        {activeTab === 'perfectFor' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Perfect For</h3>
                <p className="text-xs text-slate-400">Add categories of travelers this tour is perfect for</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPerfectFors([...perfectFors, { title: '', iconId: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-primary" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {perfectFors.map((pf, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setPerfectFors(perfectFors.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label="Title"
                          value={pf.title}
                          onChange={e => {
                            const newPf = [...perfectFors];
                            newPf[index].title = e.target.value;
                            setPerfectFors(newPf);
                          }}
                          placeholder="e.g. Families, Couples"
                        />
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Item Icon</label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 transition-all text-sm outline-none cursor-pointer flex justify-between items-center"
                            onClick={() => setOpenPfIconDropdownId(openPfIconDropdownId === index ? null : index)}
                          >
                            {pf.iconId ? (
                              <div className="flex items-center gap-2">
                                {iconsList.find(i => i.id === pf.iconId)?.image?.url && (
                                  <img src={iconsList.find(i => i.id === pf.iconId)?.image?.url} alt="Icon" className="w-5 h-5 object-contain" />
                                )}
                                <span className="font-medium">{iconsList.find(i => i.id === pf.iconId)?.name || 'Unknown Icon'}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">Select an icon...</span>
                            )}
                            <svg className="h-4 w-4 text-slate-500 transition-transform" style={{ transform: openPfIconDropdownId === index ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {openPfIconDropdownId === index && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                              {iconsList.map(icon => (
                                <div
                                  key={icon.id}
                                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                                  onClick={() => {
                                    const newPf = [...perfectFors];
                                    newPf[index].iconId = icon.id;
                                    setPerfectFors(newPf);
                                    setOpenPfIconDropdownId(null);
                                  }}
                                >
                                  {icon.image?.url ? (
                                    <img src={icon.image.url} alt={icon.name} className="w-6 h-6 object-contain" />
                                  ) : (
                                    <div className="w-6 h-6 bg-slate-100 rounded-full" />
                                  )}
                                  <span className="text-sm font-medium text-slate-700">{icon.name}</span>
                                </div>
                              ))}
                              {iconsList.length === 0 && (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center">No icons found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {perfectFors.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No items added yet. Click &quot;Add Item&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOCAL CUISINES TAB */}
        {activeTab === 'localCuisines' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Local Cuisines</h3>
                <p className="text-xs text-slate-400">Add local cuisines and food experiences</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLocalCuisines([...localCuisines, { title: '', iconId: null }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Cuisine
              </Button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Section Background Image</label>
              {cuisineBgImageId && (
                <div className="w-full max-w-md h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-3">
                  <img src={cuisineBgImage?.url || ''} alt="Cuisine Bg" className="object-cover w-full h-full" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingCuisineBg}
                className="w-full max-w-md px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingCuisineBg(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const newImage = await uploadImage(formData);
                    setCuisineBgImageId(newImage.id);
                    setCuisineBgImage(newImage);
                  } catch (err) {
                    alert('Failed to upload image.');
                  } finally {
                    setUploadingCuisineBg(false);
                  }
                }}
              />
              {uploadingCuisineBg && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            </div>

            <div className="space-y-4">
              {localCuisines.map((lc, index) => (
                <Card key={index} className="relative overflow-visible border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setLocalCuisines(localCuisines.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          required
                          type="text"
                          label="Cuisine Name"
                          value={lc.title || ''}
                          onChange={e => {
                            const newLc = [...localCuisines];
                            newLc[index].title = e.target.value;
                            setLocalCuisines(newLc);
                          }}
                          placeholder="e.g. Masala Dosa"
                        />
                      </div>

                      <div className="space-y-4">

                        <div className="space-y-1.5 relative">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Cuisine Icon</label>
                          <div className="relative">
                            <button
                              type="button"
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 transition-all text-sm outline-none cursor-pointer flex justify-between items-center"
                              onClick={() => setOpenLcIconDropdownId(openLcIconDropdownId === index ? null : index)}
                            >
                              {lc.iconId ? (
                                <div className="flex items-center gap-2">
                                  {iconsList.find(i => i.id === lc.iconId)?.image?.url && (
                                    <img src={iconsList.find(i => i.id === lc.iconId)?.image?.url} alt="Icon" className="w-5 h-5 object-contain" />
                                  )}
                                  <span className="font-medium">{iconsList.find(i => i.id === lc.iconId)?.name || 'Unknown Icon'}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500">Select an icon...</span>
                              )}
                              <svg className="h-4 w-4 text-slate-500 transition-transform" style={{ transform: openLcIconDropdownId === index ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {openLcIconDropdownId === index && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {iconsList.map(icon => (
                                  <div
                                    key={icon.id}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                                    onClick={() => {
                                      const newLc = [...localCuisines];
                                      newLc[index].iconId = icon.id;
                                      setLocalCuisines(newLc);
                                      setOpenLcIconDropdownId(null);
                                    }}
                                  >
                                    {icon.image?.url ? (
                                      <img src={icon.image.url} alt={icon.name} className="w-6 h-6 object-contain" />
                                    ) : (
                                      <div className="w-6 h-6 bg-slate-100 rounded-full" />
                                    )}
                                    <span className="text-sm font-medium text-slate-700">{icon.name}</span>
                                  </div>
                                ))}
                                {iconsList.length === 0 && (
                                  <div className="px-4 py-3 text-sm text-slate-500 text-center">No icons found</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Cuisine Image</label>
                          {lc.imageId && (
                            <div className="w-full h-32 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-2">
                              <img src={lc.image?.url || ''} alt="Cuisine" className="object-cover w-full h-full" />
                            </div>
                          )}
                          <input
                            required={!lc.imageId}
                            type="file"
                            accept="image/*"
                            disabled={uploadingLocalCuisineMap[index]}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingLocalCuisineMap(prev => ({ ...prev, [index]: true }));
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                const newImage = await uploadImage(formData);
                                const newLc = [...localCuisines];
                                newLc[index].imageId = newImage.id;
                                newLc[index].image = newImage;
                                setLocalCuisines(newLc);
                              } catch (err) {
                                alert('Failed to upload image.');
                              } finally {
                                setUploadingLocalCuisineMap(prev => ({ ...prev, [index]: false }));
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {localCuisines.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No cuisines added yet. Click &quot;Add Cuisine&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pricing Packages</h3>
                <p className="text-xs text-slate-400">Setup standard vs premium pricing options</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPricePackages([...pricePackages, { title: '', subtitle: '', description: '', price: 0, isDefault: false }])}
                className="bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2 text-[#ebb337]" /> Add Option
              </Button>
            </div>

            <div className="space-y-4">
              {pricePackages.map((pp, index) => (
                <Card key={index} className={`relative overflow-visible border-slate-250 ${pp.isDefault ? 'border-[#ebb337] bg-[#ebb337]/5' : 'hover:shadow-md transition-shadow'}`}>
                  <CardContent className="pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setPricePackages(pricePackages.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            required
                            type="text"
                            label="Title"
                            placeholder="e.g. Standard"
                            value={pp.title || ''}
                            onChange={e => {
                              const newPp = [...pricePackages];
                              newPp[index].title = e.target.value;
                              setPricePackages(newPp);
                            }}
                          />
                          <Input
                            type="text"
                            label="Subtitle"
                            placeholder="e.g. Best Value"
                            value={pp.subtitle || ''}
                            onChange={e => {
                              const newPp = [...pricePackages];
                              newPp[index].subtitle = e.target.value;
                              setPricePackages(newPp);
                            }}
                          />
                        </div>
                        <Textarea
                          required
                          rows={4}
                          label="Description"
                          placeholder="Describe what is included in this tier..."
                          value={pp.description || ''}
                          onChange={e => {
                            const newPp = [...pricePackages];
                            newPp[index].description = e.target.value;
                            setPricePackages(newPp);
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Price (INR)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">₹</span>
                            <input
                              required
                              type="number"
                              min="0" step="0.01"
                              className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 transition-all text-sm outline-none focus:border-primary"
                              value={pp.price}
                              onChange={e => {
                                const newPp = [...pricePackages];
                                newPp[index].price = Number(e.target.value);
                                setPricePackages(newPp);
                              }}
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="defaultPricePackage"
                              className="w-4 h-4 text-primary focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer"
                              checked={pp.isDefault}
                              onChange={() => {
                                const newPp = pricePackages.map((p, i) => ({
                                  ...p,
                                  isDefault: i === index
                                }));
                                setPricePackages(newPp);
                              }}
                            />
                            <span>Set as Default Package</span>
                          </label>
                          <p className="text-xs text-slate-400 ml-6 mt-1.5">This price will be shown on the package preview card.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pricePackages.length === 0 && (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No pricing packages added yet. Click &quot;Add Option&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* WHY LOVE HOLIDAY TAB */}
        {activeTab === 'whyLove' && (
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Why Love Holiday</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize the background image for the Why You'll Love This Holiday section</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Section Background Image</label>
                {whyLoveBgImageId && (
                  <div className="w-full max-w-md h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-3">
                    <img src={whyLoveBgImage?.url || ''} alt="Why Love Bg" className="object-cover w-full h-full" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingWhyLoveBg}
                  className="w-full max-w-md px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingWhyLoveBg(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const newImage = await uploadImage(formData);
                      setWhyLoveBgImageId(newImage.id);
                      setWhyLoveBgImage(newImage);
                    } catch (err) {
                      alert('Failed to upload image.');
                    } finally {
                      setUploadingWhyLoveBg(false);
                    }
                  }}
                />
                {uploadingWhyLoveBg && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Footer Call to Action</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize the CTA shown at the bottom of the package landing page</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Footer Title"
                  placeholder="e.g. Ready for an adventure?"
                  value={footerTitle}
                  onChange={e => setFooterTitle(e.target.value)}
                />

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Footer Background Image</label>
                  {footerImageId && (
                    <div className="w-full h-48 relative rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 mb-3">
                      <img src={footerImage?.url || ''} alt="Footer" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingFooter}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-250 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingFooter(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const newImage = await uploadImage(formData);
                        setFooterImageId(newImage.id);
                        setFooterImage(newImage);
                      } catch (err) {
                        alert('Failed to upload image.');
                      } finally {
                        setUploadingFooter(false);
                      }
                    }}
                  />
                  {uploadingFooter && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </form>
  );
}
