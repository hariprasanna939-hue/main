'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, MapPin, Calendar, Clock, DollarSign, 
  Plus, Trash2, Edit2, ChevronRight, Check, Play, Info, ArrowRight, ArrowLeftRight,
  Heart, Users, Landmark, Gem, Camera, Phone, Star
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import SvgIcon from '@/components/ui/SvgIcon';

const InteractiveMap = dynamic(() => import('../client/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-[10px]" />
});

interface ItineraryItem {
  id: string;
  dayNumber: number;
  title: string;
  subtitle?: string | null;
  description: string;
  image?: { url: string } | null;
  lat?: number;
  lng?: number;
  icons?: { image?: { url: string } | null }[];
}

interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  imageOne?: { url: string } | null;
  addonId?: string;
}

interface PricePackage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  isDefault: boolean;
}

interface AddonItem {
  id: string;
  addonPackageId: string;
  addonPackage: {
    id: string;
    title: string;
    subtitle?: string | null;
    slug: string;
    durationDays: number;
    description: string;
    gallery: { image: { url: string } }[];
    pricePackages: { price: number; isDefault: boolean }[];
    itineraries: ItineraryItem[];
    experiences: ExperienceItem[];
  }
}

interface DynamicJourneyPlannerProps {
  pkg: {
    id: string;
    title: string;
    description: string;
    durationDays: number;
    durationNights: number;
    currency: string;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    country: { name: string };
    itineraries: ItineraryItem[];
    experiences: ExperienceItem[];
    pricePackages: PricePackage[];
    addons: AddonItem[];
    bestSeasons?: { month: string; type: string }[];
    perfectFors?: any[];
  };
  countrySlug?: string;
}

const steps = [
  { num: 1, label: 'Regions' },
  { num: 2, label: 'Addons' },
  { num: 3, label: 'Dates' },
  { num: 4, label: 'Travellers' },
  { num: 5, label: 'Budget' },
  { num: 6, label: 'Details' },
  { num: 7, label: 'Review' },
];



const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const DynamicJourneyPlanner: React.FC<DynamicJourneyPlannerProps> = ({ pkg, countrySlug }) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(2);
  const [fetchedAddonDetails, setFetchedAddonDetails] = useState<Record<string, any>>({});
  const [activeAddonsData, setActiveAddonsData] = useState<Record<string, any>>({});
  const [customDays, setCustomDays] = useState<any[]>([]);

  const pkgPrimary = pkg.primaryColor || '#EAA923';
  const pkgSecondary = pkg.secondaryColor || '#ffedd5';

  // Derived state calculations
  const activeAddonPkgs = Object.values(activeAddonsData);
  const addedExtensions = activeAddonPkgs.map(p => p.title);
  
  const initialItinerary = pkg.itineraries.map(it => ({
    id: it.id,
    tag: it.subtitle || `DAY ${it.dayNumber}`,
    tagColor: pkgPrimary,
    title: it.title,
    city: (it as any).city || it.title,
    description: it.description,
    image: it.image?.url || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=100&q=80',
    lat: it.lat,
    lng: it.lng,
    icons: (it as any).icons,
    isExtension: false
  }));

  const derivedItineraries = activeAddonPkgs.length > 0
    ? [
        ...activeAddonPkgs.flatMap(addonPkg => {
          if (addonPkg.itineraries && addonPkg.itineraries.length > 0) {
            return addonPkg.itineraries.map((it: any) => ({
              id: `addon-${addonPkg.id}-${it.id}`,
              tag: it.subtitle || `DAY ${it.dayNumber}`,
              tagColor: pkgPrimary,
              title: it.title,
              city: it.city || it.title,
              description: it.description,
              image: it.image?.url || addonPkg.gallery?.[0]?.image?.url || 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80',
              lat: it.lat,
              lng: it.lng,
              icons: it.icons,
              isExtension: true
            }));
          } else {
            return [{
              id: `addon-${addonPkg.id}`,
              tag: `DAY 1`,
              tagColor: pkgPrimary,
              title: addonPkg.title,
              city: addonPkg.title,
              description: addonPkg.description,
              image: addonPkg.gallery?.[0]?.image?.url || 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80',
              lat: null,
              lng: null,
              isExtension: true
            }];
          }
        }),
        ...customDays
      ]
    : [
        ...initialItinerary,
        ...customDays
      ];

  const derivedExperiences = [
    ...pkg.experiences,
    ...activeAddonPkgs.flatMap(addonPkg => addonPkg.experiences?.map((exp: any) => ({ ...exp, addonId: addonPkg.id })) || [])
  ];

  const totalDurationDays = pkg.durationDays + activeAddonPkgs.reduce((sum, p) => sum + (p.durationDays || 0), 0) + customDays.length;

  const defaultPricePkg = pkg.pricePackages.find(p => p.isDefault) || pkg.pricePackages[0];
  const [selectedPriceId, setSelectedPriceId] = useState<string>(defaultPricePkg?.id || '');

  const totalAddonPrice = activeAddonPkgs.reduce((sum, addonPkg) => {
    const p = addonPkg.pricePackages?.find((pkg: any) => pkg.isDefault);
    return sum + Number(p?.price || 0);
  }, 0);

  const selectedTier = pkg.pricePackages.find(p => p.id === selectedPriceId);
  const baseTierPrice = Number(selectedTier?.price || defaultPricePkg?.price || 0);
  const derivedBudgetValue = baseTierPrice + totalAddonPrice;

  const [departureDate, setDepartureDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('2026-10-21');
  const [manualTripLength, setManualTripLength] = useState<string | null>(null);
  
  const displayTripLength = manualTripLength || `${totalDurationDays} Days`;
  
  const departureInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);
  const highlightsScrollRef = useRef<HTMLDivElement>(null);

  // Clear manual trip length when package changes
  useEffect(() => {
    setManualTripLength(null);
  }, [pkg]);

  useEffect(() => {
    const el = highlightsScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture & Heritage']);
  const [travelStyle, setTravelStyle] = useState<string>('Slow & immersive');
  const [selectedRegion, setSelectedRegion] = useState<string>(pkg.country.name);
  
  // Accommodation & Flight state
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(['Boutique guesthouses', 'Heritage properties']);
  const [flightSupport, setFlightSupport] = useState<string>("I've arranged my international flights");
  
  // Contact details
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [residenceCountry, setResidenceCountry] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync selected region when pkg country changes
  useEffect(() => {
    setSelectedRegion(pkg.country.name);
  }, [pkg.country.name]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const selectedPackageTier = pkg.pricePackages.find(p => p.id === selectedPriceId);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:        firstName,
          lastName:         lastName,
          email:            contactEmail,
          phone:            contactPhone,
          residenceCountry: residenceCountry,
          notes:            notes,
          packageTitle:     pkg.title,
          destination:      selectedRegion,
          addons:           addedExtensions.length > 0 ? addedExtensions.join(', ') : null,
          departureDate:    departureDate,
          returnDate:       returnDate,
          tripLength:       displayTripLength,
          adults:           adults,
          children:         childrenCount,
          infants:          infants,
          interests:        selectedInterests.join(', '),
          travelStyle:      travelStyle,
          accommodations:   selectedAccommodations.join(', '),
          flightSupport:    flightSupport,
          packageTier:      selectedPackageTier?.title || null,
          totalPrice:       derivedBudgetValue.toLocaleString(),
          currency:         pkg.currency,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Submission failed');
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  function getDaysCount(lenStr: string): number {
    const match = lenStr.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]) - 1;
    }
    return totalDurationDays - 1;
  };

  const handleTripLengthChange = (length: string) => {
    setManualTripLength(length);
    const daysToAdd = getDaysCount(length);
    const baseDate = new Date(departureDate);
    if (!isNaN(baseDate.getTime())) {
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setReturnDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const handleDepartureChange = (newVal: string) => {
    setDepartureDate(newVal);
    const daysToAdd = getDaysCount(displayTripLength);
    const baseDate = new Date(newVal);
    if (!isNaN(baseDate.getTime())) {
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setReturnDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const [loadingExtensions, setLoadingExtensions] = useState<Record<string, boolean>>({});

  const toggleExtension = async (addon: AddonItem) => {
    if (activeAddonsData[addon.id]) {
      setActiveAddonsData({});
    } else {
      setLoadingExtensions({ [addon.id]: true });
      try {
        const cachedAddon = fetchedAddonDetails[addon.id];
        if (cachedAddon) {
          setActiveAddonsData({ [addon.id]: cachedAddon });
        } else {
          const res = await fetch(`/api/packages/${addon.addonPackage.slug}`);
          if (res.ok) {
            const data = await res.json();
            const addonPkg = data.pkg;
            
            setFetchedAddonDetails(prev => ({ 
              ...prev, 
              [addon.id]: addonPkg
            }));

            setActiveAddonsData({ [addon.id]: addonPkg });
          } else {
            throw new Error('Failed to fetch add-on details');
          }
        }
      } catch (err) {
        console.error('Failed to fetch addon details', err);
      } finally {
        setLoadingExtensions({});
      }
    }
  };

  const handleAddNewDay = () => {
    const newItem = {
      id: `custom-${Date.now()}`,
      tag: '✨ CUSTOM DAY',
      tagColor: pkgPrimary,
      title: 'Custom Stop',
      city: 'Custom Stop',
      description: 'Relax, shop, or explore local cultural points at leisure.',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=100&q=80',
    };
    setCustomDays(prev => [...prev, newItem]);
  };

  const getPackageSummaryAndTags = () => {
    const titleLower = pkg.title.toLowerCase();
    const isSriLanka = titleLower.includes('sri lanka') || titleLower.includes('srilanka') || pkg.country.name.toLowerCase().includes('sri lanka');
    const isKerala = titleLower.includes('kerala');

    // Default: Golden Triangle / India
    const defaultData = {
      summary: pkg.description || "Discover the historic monuments, majestic forts, and rich heritage of India's Golden Triangle. The iconic Taj Mahal, Jaipur's royal palaces, and Delhi's vibrant culture make it a truly unforgettable experience.",
      perfectFor: [
        { label: 'Couples', icon: <Heart className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        { label: 'Families', icon: <Users className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        { label: 'First-time Visitors', icon: <Compass className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        { label: 'Culture Lovers', icon: <Landmark className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        { label: 'Luxury Travellers', icon: <Gem className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        { label: 'Photography', icon: <Camera className="w-5 h-5 text-[var(--pkg-primary)]" /> },
      ]
    };
    
    let result = defaultData;
    if (isKerala) {
      result = {
        summary: pkg.description || "Discover enchanting backwaters, lush hill stations, serene beaches, and rejuvenating Ayurveda wellness. Kerala's natural beauty and warm hospitality make it a truly unforgettable experience.",
        perfectFor: [
          { label: 'Couples', icon: <Heart className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Families', icon: <Users className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Nature Seekers', icon: <Compass className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Culture Lovers', icon: <Landmark className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Wellness Seekers', icon: <Gem className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Photography', icon: <Camera className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        ]
      };
    } else if (isSriLanka) {
      result = {
        summary: pkg.description || "Discover scenic tea plantations, pristine sandy beaches, ancient UNESCO ruins, and rich wildlife safaris. Sri Lanka's natural beauty and warm tropical hospitality make it a truly unforgettable experience.",
        perfectFor: [
          { label: 'Couples', icon: <Heart className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Families', icon: <Users className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Wildlife Lovers', icon: <Compass className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Culture Lovers', icon: <Landmark className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Adventure Seekers', icon: <Gem className="w-5 h-5 text-[var(--pkg-primary)]" /> },
          { label: 'Photography', icon: <Camera className="w-5 h-5 text-[var(--pkg-primary)]" /> },
        ]
      };
    }

    if (pkg.perfectFors && pkg.perfectFors.length > 0) {
      result.perfectFor = pkg.perfectFors.map((pf: any) => {
        const labelLower = pf.title.toLowerCase();
        
        // Match common labels to clean Lucide icons so they take primary color perfectly
        let LucideIcon = Star;
        let isStandard = false;
        
        if (labelLower.includes('couple')) {
          LucideIcon = Heart;
          isStandard = true;
        } else if (labelLower.includes('family') || labelLower.includes('families')) {
          LucideIcon = Users;
          isStandard = true;
        } else if (
          labelLower.includes('first-time') || 
          labelLower.includes('visitor') || 
          labelLower.includes('nature') || 
          labelLower.includes('wildlife') ||
          labelLower.includes('enthusiast') && !labelLower.includes('photo')
        ) {
          LucideIcon = Compass;
          isStandard = true;
        } else if (labelLower.includes('culture') || labelLower.includes('heritage')) {
          LucideIcon = Landmark;
          isStandard = true;
        } else if (labelLower.includes('luxury') || labelLower.includes('wellness') || labelLower.includes('adventure')) {
          LucideIcon = Gem;
          isStandard = true;
        } else if (labelLower.includes('photograph') || labelLower.includes('camera')) {
          LucideIcon = Camera;
          isStandard = true;
        }

        return {
          label: pf.title,
          icon: isStandard ? (
            <LucideIcon className="w-5 h-5 text-[var(--pkg-primary)]" />
          ) : pf.icon?.image?.url ? (
            pf.icon.image.url.endsWith('.svg') ? (
              <SvgIcon 
                url={pf.icon.image.url} 
                primaryColor="var(--pkg-primary)" 
                className="w-5 h-5 shrink-0" 
              />
            ) : (
              <img 
                src={pf.icon.image.url} 
                alt={pf.title} 
                className="w-5 h-5 object-contain" 
              />
            )
          ) : (
            <LucideIcon className="w-5 h-5 text-[var(--pkg-primary)]" />
          )
        };
      });
    }

    return result;
  };

  const packageDetails = getPackageSummaryAndTags();

  const currencySymbol = pkg.currency === 'USD' ? '$' : pkg.currency === 'EUR' ? '€' : '₹';

  const styleVariables = {
    '--pkg-primary': pkgPrimary,
    '--pkg-secondary': pkgSecondary,
  } as React.CSSProperties;

  return (
    <section className="bg-[#FAF8F6] py-12 border-t border-slate-100" style={styleVariables}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 xl:px-0 w-full">

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-white shadow-sm rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-0 w-full max-w-5xl overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => {
              const isCompletedOrActive = step.num <= activeStep;
              const isActive = step.num === activeStep;
              return (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => {
                      if (step.num === 1) {
                        const targetSlug = countrySlug || pkg.country.name.toLowerCase().replace(/\s+/g, '-');
                        router.push(`/${targetSlug}`);
                      } else {
                        setActiveStep(step.num);
                      }
                    }}
                    className="flex items-center gap-1 sm:gap-2 shrink-0 focus:outline-none cursor-pointer"
                  >
                    <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      isCompletedOrActive
                        ? 'bg-[var(--pkg-primary)] text-white shadow-sm'
                        : 'bg-[#F1F5F9] text-slate-400'
                    }`}>
                      {step.num}
                    </span>
                    <span className={`text-[11px] lg:text-[15px] whitespace-nowrap transition-colors ${
                      isActive ? 'inline' : 'lg:inline hidden'
                    } ${
                      isCompletedOrActive
                        ? 'text-[#111827] font-semibold'
                        : 'text-[#94A3B8] font-medium'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 border-t border-dashed border-slate-200 mx-1 lg:mx-3 min-w-[8px] lg:min-w-[15px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Package Summary & Perfect For Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200/60 mb-10 items-start">
          {/* Left Column: Summary and CTA buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#6B7280]">
              {packageDetails.summary}
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-2">
              <button className="px-8 py-3 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer select-none">
                Book now
              </button>
              <a 
                href="tel:+442012345678" 
                className="px-6 py-3 rounded-lg border border-[var(--pkg-primary)]/30 hover:bg-[var(--pkg-primary)]/5 text-[var(--pkg-primary)] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white select-none"
              >
                <Phone className="w-4 h-4" />
                <span>+44 20 1234 5678</span>
              </a>
            </div>
          </div>

          {/* Right Column: Perfect For grid */}
          <div className="lg:col-span-7">
            <h4 className="text-[11px] sm:text-[12px] font-semibold text-[#6B7280] tracking-wider uppercase block mb-4 select-none">
              Perfect For
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
              {packageDetails.perfectFor.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 select-none">
                  {/* Circular Icon Badge */}
                  <div className="w-12 h-12 rounded-full border border-slate-100 bg-white flex items-center justify-center shrink-0 shadow-xs">
                    {item.icon}
                  </div>
                  {/* Label */}
                  <span className="text-sm sm:text-base font-semibold text-[#111827]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mx-auto w-full">

          {/* Col 1: Wizard Steps */}
          <div className="col-span-1 lg:col-span-4 bg-white border border-slate-100 rounded-xl p-5 h-auto lg:h-[577px] flex flex-col justify-between gap-5 shadow-sm">
            {(() => {
              switch (activeStep) {
                case 1:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="mb-6">
                          <h3 className="text-[#111827] font-bold text-[22px] lg:text-[24px] mb-0.5">Your Selected Destination</h3>
                          <p className="text-[#6B7280] text-[14px]">This experience takes place in {pkg.country.name}.</p>
                        </div>

                        <div className="flex flex-col text-left rounded-xl overflow-hidden border border-[var(--pkg-primary)] shadow-md shadow-[var(--pkg-primary)]/10 ring-1 ring-[var(--pkg-primary)] p-6 max-w-md">
                          <span className="text-[var(--pkg-primary)] font-serif text-sm font-bold tracking-wide block uppercase mb-1">
                            Active Package
                          </span>
                          <h4 className="text-[#111827] font-bold text-[20px] mb-2">{pkg.title}</h4>
                          <p className="text-[14px] text-[#6B7280] leading-relaxed">{pkg.description.slice(0, 180)}...</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button className="px-6 py-2.5 rounded-lg bg-[#353535]/50 text-white/50 text-sm font-semibold tracking-wider cursor-not-allowed focus:outline-none" disabled>BACK</button>
                        <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 2:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-[#111827] font-semibold text-xl">Extend Your Holiday</h3>
                            <p className="text-[#6B7280] text-[14px]">Add extensions and addon variants</p>
                          </div>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-1 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full min-h-0">
                          {pkg.addons.length === 0 ? (
                            <div className="text-slate-400 font-light py-8 text-center">No add-ons available for this package.</div>
                          ) : (
                            pkg.addons.map((addon) => {
                              const extId = addon.addonPackage.title;
                              const added = !!activeAddonsData[addon.id];
                              const cachedAddon = fetchedAddonDetails[addon.id];
                              const addonImage = cachedAddon?.gallery?.[0]?.image?.url || addon.addonPackage.gallery?.[0]?.image?.url || 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80';
                              const defaultPrice = cachedAddon?.pricePackages?.find((p: any) => p.isDefault)?.price;
                              return (
                                <div
                                  key={addon.id}
                                  style={{ borderRadius: '9px', borderWidth: '1px' }}
                                  className={`flex items-center overflow-hidden border transition-all h-[95px] sm:h-[108px] ${
                                    added
                                      ? 'border-[var(--pkg-primary)] shadow-md shadow-[var(--pkg-primary)]/10'
                                      : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  <div className="pl-2 sm:pl-3 py-2 sm:py-3 shrink-0">
                                    <img
                                      src={addonImage}
                                      alt={addon.addonPackage.title}
                                      className="object-cover w-24 h-[75px] sm:w-[150px] sm:h-[84px] rounded-[8px]"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 px-3 sm:px-5">
                                    <p className="text-[#111827] font-semibold text-[14px] sm:text-[16px] leading-snug truncate sm:whitespace-normal">{addon.addonPackage.title}</p>
                                    <span className="text-[12px] sm:text-[13px] text-[#6B7280] font-normal mt-0.5 block line-clamp-2">
                                      {addon.addonPackage.subtitle || ''}
                                      {defaultPrice !== undefined && ` (+${currencySymbol}${defaultPrice})`}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => toggleExtension(addon)}
                                    disabled={loadingExtensions[addon.id]}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mr-2 sm:mr-4 transition-all focus:outline-none shadow-sm bg-[var(--pkg-primary)] text-white ${loadingExtensions[addon.id] ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
                                  >
                                    {loadingExtensions[addon.id]
                                      ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                      : added
                                        ? <Check className="w-4 h-4 stroke-[3px]" />
                                        : <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
                                    }
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button 
                          onClick={() => {
                            const targetSlug = countrySlug || pkg.country.name.toLowerCase().replace(/\s+/g, '-');
                            router.push(`/${targetSlug}`);
                          }} 
                          className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none"
                        >
                          BACK
                        </button>
                        <button onClick={() => setActiveStep(3)} className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 3:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-4">
                          <div className="mb-4">
                            <h3 className="text-[#111827] font-semibold text-xl">When are you travelling?</h3>
                            <p className="text-[#6B7280] text-[14px] leading-relaxed">
                              Seasons transform each destination. We've mapped the ideal windows for you.
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5">
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">Departure</span>
                              <div
                                className="relative h-11 w-full cursor-pointer"
                                onClick={() => { try { departureInputRef.current?.showPicker(); } catch { departureInputRef.current?.focus(); } }}
                              >
                                <div className="absolute inset-0 flex items-center pl-3 pr-4 py-2 border border-slate-200 rounded-lg text-slate-800 bg-slate-50/30 font-medium text-sm pointer-events-none">
                                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                  <span>{formatDate(departureDate)}</span>
                                </div>
                               <input ref={departureInputRef} type="date" value={departureDate} onChange={(e) => handleDepartureChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
                              </div>
                            </div>
                            <div className="hidden sm:block self-end pb-3.5">
                              <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">Return</span>
                              <div
                                className="relative h-11 w-full cursor-pointer"
                                onClick={() => { try { returnInputRef.current?.showPicker(); } catch { returnInputRef.current?.focus(); } }}
                              >
                                <div className="absolute inset-0 flex items-center pl-3 pr-4 py-2 border border-slate-200 rounded-lg text-slate-800 bg-slate-50/30 font-medium text-sm pointer-events-none">
                                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                                  <span>{formatDate(returnDate)}</span>
                                </div>
                                <input ref={returnInputRef} type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          <div className="mb-5">
                            <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">Trip Length</span>
                            <div className="flex flex-wrap gap-2">
                              {[`${totalDurationDays} Days`, `${totalDurationDays + 2} Days`, `${totalDurationDays + 4} Days`].map((len) => {
                                const active = displayTripLength === len;
                                return (
                                  <button key={len} onClick={() => handleTripLengthChange(len)}
                                    className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${active ? 'border-2 border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 font-semibold px-[19px] py-[5px]' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-5 py-1.5 font-medium'}`}>
                                    {len}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">Best Time for {pkg.title}</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                              {['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'].map((m) => {
                                const shortName = m.substring(0, 3).toLowerCase();
                                const displayName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
                                const season = pkg.bestSeasons?.find(s => s.month === m);
                                let colorClasses = 'border-slate-200 text-slate-500 bg-slate-50/10';
                                if (season?.type === 'BEST') colorClasses = 'border-emerald-500/40 text-emerald-600 bg-emerald-50/20';
                                else if (season?.type === 'MODERATE') colorClasses = 'border-amber-500/40 text-amber-600 bg-amber-50/20';
                                else if (season?.type === 'OFF_SEASON') colorClasses = 'border-red-500/40 text-red-600 bg-red-50/20';
                                return <span key={m} className={`py-1.5 rounded-lg text-xs font-semibold border text-center block ${colorClasses}`}>{displayName}</span>;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(4)} className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 4:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-3 lg:gap-3.5">
                          <div>
                            <h3 className="text-[#111827] font-semibold text-xl">Who's making this journey?</h3>
                            <p className="text-[#6B7280] text-[14px] leading-relaxed">Your group shapes everything — pace, accommodations, and special activities.</p>
                          </div>

                          <div className="flex gap-4">
                            {[
                              { label: 'Adults', value: adults, set: setAdults, min: 1 },
                              { label: 'Children', value: childrenCount, set: setChildrenCount, min: 0 },
                              { label: 'Infants', value: infants, set: setInfants, min: 0 },
                            ].map(({ label, value, set, min }) => (
                              <div key={label} className="flex flex-col gap-0.5 flex-1">
                                <span className="text-sm font-semibold text-[#374151] uppercase block mb-1">{label}</span>
                                <div className="flex items-center justify-between border border-slate-200 rounded-lg p-1 bg-slate-50/30 h-10">
                                  <button onClick={() => set((prev: number) => Math.max(min, prev - 1))} className="w-8 h-8 rounded-md border border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 flex items-center justify-center font-bold text-base cursor-pointer focus:outline-none transition-colors">-</button>
                                  <span className="text-slate-800 font-semibold text-sm">{value}</span>
                                  <button onClick={() => set((prev: number) => prev + 1)} className="w-8 h-8 rounded-md border border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 flex items-center justify-center font-bold text-base cursor-pointer focus:outline-none transition-colors">+</button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div>
                            <span className="text-sm font-semibold text-[#374151]">WHAT DRAWS YOU MOST TO TRAVEL?</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Culture & Heritage', 'Beach & Relaxation', 'Wildlife Safari', 'Adventure & Trekking', 'Spiritual Journey', 'Culinary Discovery', 'Wellness & Ayurveda'].map((interest) => {
                                const isSelected = selectedInterests.includes(interest);
                                return (
                                  <button key={interest}
                                    onClick={() => isSelected ? setSelectedInterests(prev => prev.filter(i => i !== interest)) : setSelectedInterests(prev => [...prev, interest])}
                                    className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${isSelected ? 'border-2 border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 font-semibold px-4 py-1' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-4.5 py-1.5 font-medium'}`}>
                                    {interest}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm font-semibold text-[#374151]">TRAVEL STYLE</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Slow & immersive', 'Fast-paced highlights', 'Flexible & self-directed'].map((style) => {
                                const isSelected = travelStyle === style;
                                return (
                                  <button key={style} onClick={() => setTravelStyle(style)}
                                    className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${isSelected ? 'border-2 border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 font-semibold px-4 py-1' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-4.5 py-1.5 font-medium'}`}>
                                    {style}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-1">
                        <button onClick={() => setActiveStep(3)} className="px-6 py-2 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(5)} className="px-6 py-2 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 5:
                  return (
                    <>
                      <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-6">
                        <div>
                          <h3 className="text-[#111827] font-semibold text-xl">Select Package Variant</h3>
                          <p className="text-[#6B7280] text-[14px] leading-relaxed">
                            Choose the package tier and variant configured in the CMS database.
                          </p>
                        </div>

                        {/* Large price display */}
                        <div className="flex flex-col items-center justify-center py-1 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-baseline text-[#111827]">
                            <span className="text-[32px] font-medium font-serif mr-1.5">{currencySymbol}</span>
                            <span className="text-[58px] font-bold font-serif leading-none tracking-tight">{derivedBudgetValue.toLocaleString()}</span>
                          </div>
                          <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mt-1 block">Total Base Price per Person</span>
                        </div>

                        {/* Variant cards */}
                        <div>
                          <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">AVAILABLE TIERS</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {pkg.pricePackages.map((style) => {
                              const isSelected = selectedPriceId === style.id;
                              return (
                                <button
                                  key={style.id}
                                  onClick={() => setSelectedPriceId(style.id)}
                                  className={`flex flex-col text-left p-4 rounded-lg border transition-all cursor-pointer focus:outline-none min-h-[140px] pb-3.5 justify-between ${
                                    isSelected
                                      ? 'border-[var(--pkg-primary)] bg-[var(--pkg-secondary)]/20 shadow-sm ring-1 ring-[var(--pkg-primary)]'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div>
                                    <span className="font-semibold text-lg text-[var(--pkg-primary)] tracking-wider block uppercase">{style.title}</span>
                                    <div className="text-[#111827] font-semibold text-xl mt-0.5">{currencySymbol}{(Number(style.price) + totalAddonPrice).toLocaleString()}</div>
                                    <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">{style.subtitle} — {style.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Accommodation preferences */}
                        <div>
                          <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">ACCOMMODATION PREFERENCE</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Boutique guesthouses', 'Heritage properties', 'Luxury resorts', 'Private villas', '5-star city hotels'].map((acc) => {
                              const active = selectedAccommodations.includes(acc);
                              return (
                                <button
                                  key={acc}
                                  onClick={() => {
                                    if (active) {
                                      setSelectedAccommodations(prev => prev.filter(a => a !== acc));
                                    } else {
                                      setSelectedAccommodations(prev => [...prev, acc]);
                                    }
                                  }}
                                  className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${
                                    active
                                      ? 'border-2 border-[var(--pkg-primary)] text-[var(--pkg-primary)] bg-[var(--pkg-primary)]/5 font-semibold px-4 py-1'
                                      : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-4.5 py-1.5 font-medium'
                                  }`}
                                >
                                  {acc}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Flight support */}
                        <div>
                          <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">FLIGHT SUPPORT</span>
                          <select
                            value={flightSupport}
                            onChange={(e) => setFlightSupport(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)] cursor-pointer"
                          >
                            <option value="I've arranged my international flights">I've arranged my international flights</option>
                            <option value="I need help booking international flights">I need help booking international flights</option>
                            <option value="I want an all-inclusive flight + land package">I want an all-inclusive flight + land package</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button onClick={() => setActiveStep(4)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(6)} className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 6:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="mb-6">
                          <h3 className="text-[#111827] font-semibold text-xl">Let's make it personal</h3>
                          <p className="text-[#6B7280] text-[14px]">
                            We never share your details. A specialist will craft and send a customized itinerary within 24 hours.
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">First Name</label>
                              <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Karan"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)]"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Last Name</label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Singh"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Email Address</label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="karansingh@gmail.com"
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)]"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Phone Number</label>
                              <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="0000 000 000 00"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)]"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Country of Residence</label>
                              <select
                                value={residenceCountry}
                                onChange={(e) => setResidenceCountry(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)] cursor-pointer"
                              >
                                <option value="" disabled hidden>Select country</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Special Requests or Notes</label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Dietary needs, accessibility, a special occasion, must-have moments..."
                              rows={3}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[var(--pkg-primary)] focus:ring-1 focus:ring-[var(--pkg-primary)] resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button onClick={() => setActiveStep(5)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button
                          onClick={() => {
                            if (!firstName || !lastName || !contactEmail) {
                              alert('Please fill out your First Name, Last Name, and Email to proceed.');
                              return;
                            }
                            setActiveStep(7);
                          }}
                          className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none"
                        >
                          CONTINUE →
                        </button>
                      </div>
                    </>
                  );

                case 7:
                default: {
                  if (isSubmitted) {
                    return (
                      <div className="flex flex-col items-center justify-center text-center py-10 px-4 flex-grow gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
                          <Check className="w-8 h-8 stroke-[3px]" />
                        </div>
                        <h3 className="text-[#111827] font-bold text-2xl">Enquiry Submitted!</h3>
                        <p className="text-[#6B7280] text-sm leading-relaxed max-w-sm">
                          Thank you, <span className="font-semibold text-slate-800">{firstName} {lastName}</span>. Your custom journey request has been recorded. Our travel expert will contact you at <span className="font-semibold text-slate-800">{contactEmail}</span> within 24 hours.
                        </p>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setActiveStep(2);
                          }}
                          className="mt-4 px-6 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-semibold transition-all cursor-pointer focus:outline-none"
                        >
                          Design Another Trip
                        </button>
                      </div>
                    );
                  }

                  const selectedPackageTier = pkg.pricePackages.find(p => p.id === selectedPriceId);

                  const reviewRows = [
                    { label: 'Destination', value: selectedRegion },
                    { label: 'Active Package', value: pkg.title },
                    { label: 'Selected Addons', value: addedExtensions.length > 0 ? addedExtensions.join(', ') : 'None' },
                    { label: 'Travel dates', value: departureDate && returnDate ? `${formatDate(departureDate)} - ${formatDate(returnDate)}` : '-' },
                    { label: 'Duration', value: displayTripLength || '-' },
                    { label: 'Travellers', value: `${adults} ${adults === 1 ? 'adult' : 'adults'}${childrenCount > 0 ? `, ${childrenCount} child` : ''}${infants > 0 ? `, ${infants} infant` : ''}` },
                    { label: 'Interests', value: selectedInterests.length > 0 ? selectedInterests.join(', ') : '-' },
                    { label: 'Travel style', value: travelStyle || '-' },
                    { label: 'Package Tier', value: selectedPackageTier ? selectedPackageTier.title : '-' },
                    { label: 'Total Investment', value: `${currencySymbol}${derivedBudgetValue.toLocaleString()} / person` },
                    { label: 'Name', value: firstName || lastName ? `${firstName} ${lastName}` : '-' },
                    { label: 'Email', value: contactEmail || '-' },
                    { label: 'Phone', value: contactPhone || '-' },
                  ];

                  return (
                    <>
                      <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full space-y-4">
                        <div className="mb-6">
                          <h3 className="text-[#111827] font-semibold text-xl">Review your custom journey</h3>
                          <p className="text-[#6B7280] text-[14px]">Double-check your preferences before submitting your travel request.</p>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200/60 bg-white">
                          <div className="bg-[#352513] text-white px-6 py-4 flex justify-between items-center">
                            <h4 className="font-bold text-[18px]">Your {selectedRegion} Journey</h4>
                            <span className="border border-[var(--pkg-primary)]/80 text-[var(--pkg-primary)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                              Personalised Quote
                            </span>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {reviewRows.map((row) => (
                              <div key={row.label} className="py-3.5 px-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 hover:bg-slate-50/50 transition-colors">
                                <span className="text-[var(--pkg-primary)] font-medium text-[14px] sm:text-[15px]">{row.label}</span>
                                <span className="text-slate-800 font-semibold text-[14px] sm:text-[15px] text-left sm:text-right">{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {submitError && (
                          <p className="text-sm text-red-500 text-center font-medium">{submitError}</p>
                        )}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <button onClick={() => setActiveStep(6)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg bg-[var(--pkg-primary)] hover:opacity-90 disabled:opacity-60 text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>Submitting...</>
                            ) : 'SUBMIT →'}
                          </button>
                        </div>
                      </div>
                    </>
                  );
                }
              }
            })()}
          </div>

          {/* Col 2: Day-by-Day Itinerary */}
          <div className="col-span-1 lg:col-span-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col h-[577px] lg:h-[577px] gap-5">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 shrink-0">
              <h2 className="text-[#111827] font-semibold text-lg">Day-by-Day Itinerary</h2>
              <button onClick={handleAddNewDay} className="text-xs font-semibold flex items-center gap-1 cursor-pointer focus:outline-none transition-colors hover:opacity-80" style={{ color: pkgPrimary }}>
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full min-h-0">
              {derivedItineraries.map((item, idx) => (
                <div key={item.id} className="relative flex gap-3">
                  {idx < derivedItineraries.length - 1 && (
                    <span className="absolute left-[14px] top-8 bottom-[-16px] w-px bg-slate-100 z-0" />
                  )}
                  <span className="w-7 h-7 rounded-full bg-[var(--pkg-primary)] text-white flex items-center justify-center text-xs font-semibold shrink-0 z-10 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 flex justify-between items-start gap-2 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {item.icons && item.icons[0]?.image?.url && (
                          <img src={item.icons[0].image.url} alt="icon" className="w-4 h-4 object-contain shrink-0" />
                        )}
                        <span className="text-[11px] font-semibold tracking-wider uppercase block" style={{ color: item.tagColor }}>{item.tag}</span>
                      </div>
                      <p className="text-[#111827] font-semibold text-base">{item.city}</p>
                      <p className="text-[#6B7280] text-[13px] mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                    <img src={item.image} alt={item.city} className="w-24 h-12 sm:w-[150px] sm:h-[60px] rounded-lg object-cover shrink-0 border border-slate-100 self-center" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Route Map */}
          <div className="col-span-1 lg:col-span-3 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col h-[400px] sm:h-[500px] lg:h-[573px] gap-4">
            <h2 className="text-[#111827] font-semibold text-lg pb-4 border-b border-slate-100 mb-4 shrink-0">Route Map</h2>
            <div className="flex-1 w-full overflow-hidden rounded-xl" style={{ minHeight: 0 }}>
              <InteractiveMap itineraries={derivedItineraries} />
            </div>
          </div>

        </div>

        {/* Experience Highlights Section */}
        {derivedExperiences.length > 0 && (
          <div className="mt-8 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-[#111827] font-semibold text-xl">
                  Experience Highlights
                </h2>
                <p className="text-[#6B7280] text-sm mt-1">
                  Curated moments that define your journey.
                </p>
              </div>
            </div>

            <div 
              ref={highlightsScrollRef}
              className="flex gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
            >
              {derivedExperiences.map((hl) => {
                const hlImage = hl.imageOne?.url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80';
                return (
                  <div 
                    key={hl.id} 
                    className="group rounded-xl overflow-hidden border border-slate-200/80 transition-all flex flex-col bg-white w-[200px] min-w-[200px] sm:w-[338px] sm:min-w-[338px] h-[175px] sm:h-[231px] shrink-0 shadow-sm hover:shadow-md"
                  >
                    <div className="relative h-[120px] sm:h-[150px] w-full overflow-hidden">
                      <img 
                        src={hlImage} 
                        alt={hl.title} 
                        draggable="false"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center bg-white border-t border-slate-50">
                      <p className="text-[#374151] font-bold text-xs sm:text-[14px] leading-snug group-hover:text-[var(--pkg-primary)] transition-colors line-clamp-2">
                        {hl.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
