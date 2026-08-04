'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ArrowRight, Check, Plus, Edit2, ChevronRight, Car, Clock, Calendar, ArrowLeftRight, Heart, Users, Landmark, Gem, Camera, Phone, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#FAF8F6] flex items-center justify-center text-[11px] text-slate-400">
      Loading Route Map...
    </div>
  ),
});

interface ItineraryItem {
  id: number;
  tag: string;
  tagColor: string;
  city: string;
  description: string;
  image: string;
}

interface ExtensionCard {
  id: string;
  name: string;
  distance: string;
  days: string;
  image: string;
  subtitle?: string;
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

const defaultItinerary: ItineraryItem[] = [
  {
    id: 1,
    tag: '✈ ARRIVAL',
    tagColor: '#EAA923',
    city: 'Delhi',
    description: 'Arrival at Delhi airport. Transfer to hotel, rest at leisure.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 2,
    tag: '🏛 EXPLORE',
    tagColor: '#EAA923',
    city: 'Delhi',
    description: 'Full-day sightseeing of Old and New Delhi monuments.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 3,
    tag: 'DELHI → AGRA',
    tagColor: '#94a3b8',
    city: 'Agra',
    description: 'Drive to Agra, visit Taj Mahal and Agra Fort.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 4,
    tag: 'AGRA → JAIPUR',
    tagColor: '#94a3b8',
    city: 'Jaipur',
    description: 'Drive to Jaipur en-route visiting Fatehpur Sikri.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 5,
    tag: 'AGRA → JAIPUR',
    tagColor: '#94a3b8',
    city: 'Jaipur',
    description: 'Drive to Jaipur en-route visiting Fatehpur Sikri.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 6,
    tag: 'AGRA → JAIPUR',
    tagColor: '#94a3b8',
    city: 'Jaipur',
    description: 'Drive to Jaipur en-route visiting Fatehpur Sikri.',
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=100&q=80',
  },
];

const extensions: ExtensionCard[] = [
  {
    id: 'Varanasi',
    name: 'Varanasi',
    distance: '420 km',
    days: '2 Days',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80',
    subtitle: 'Spiritual India'
  },
  {
    id: 'Udaipur',
    name: 'Udaipur',
    distance: '420 km',
    days: '2 Days',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80',
    subtitle: 'City of Lakes'
  },
  {
    id: 'Rishikesh',
    name: 'Rishikesh',
    distance: '515 km',
    days: '2 Days',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80',
    subtitle: 'Adventure & Yoga'
  },
  {
    id: 'Goa',
    name: 'Goa',
    distance: '420 km',
    days: '3 Days',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    subtitle: 'Sun, Sand & Beach'
  },
];

export const highlights = [
  {
    title: 'Sunrise visit to the Taj Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Explore Old Delhi & Chandni Chowk',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Amber Fort & Eleph and Ride in Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'UNESCO World Heritage Sites',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Royal Palace & Lake Pichola in Udaipur',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
  },
];

const monthsConfig = [
  { name: 'Jan', status: 'pleasant' },
  { name: 'Feb', status: 'pleasant' },
  { name: 'Mar', status: 'pleasant' },
  { name: 'Apr', status: 'pleasant' },
  { name: 'May', status: 'hot' },
  { name: 'Jun', status: 'hot' },
  { name: 'Jul', status: 'monsoon' },
  { name: 'Aug', status: 'monsoon' },
  { name: 'Sep', status: 'monsoon' },
  { name: 'Oct', status: 'peak' },
  { name: 'Nov', status: 'peak' },
  { name: 'Dec', status: 'peak' },
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

export const JourneyPlanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);
  const [addedExtensions, setAddedExtensions] = useState<string[]>(['Varanasi']);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(defaultItinerary);
  const [departureDate, setDepartureDate] = useState('2024-10-15');
  const [returnDate, setReturnDate] = useState('2024-10-20');
  const [tripLength, setTripLength] = useState('6 Days');
  const departureInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);
  const highlightsScrollRef = useRef<HTMLDivElement>(null);

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
      const walk = (x - startX) * 1.5; // Drag speed multiplier
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
  const [selectedRegion, setSelectedRegion] = useState<string>('India');
  const [budgetLevel, setBudgetLevel] = useState<string>('Premium');
  const [budgetValue, setBudgetValue] = useState<number>(2500);
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>('EXPLORER');
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(['Boutique guesthouses', 'Heritage properties']);
  const [flightSupport, setFlightSupport] = useState<string>("I've arranged my international flights");
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const getDaysCount = (lenStr: string): number => {
    if (lenStr === '5 Days') return 4;
    if (lenStr === '6 Days') return 5;
    if (lenStr === '7 Days') return 6;
    if (lenStr === '10 Days') return 9;
    if (lenStr === '2 Weeks') return 13;
    return 5;
  };

  const handleTripLengthChange = (length: string) => {
    setTripLength(length);
    const daysToAdd = getDaysCount(length);
    const baseDate = new Date(departureDate);
    if (!isNaN(baseDate.getTime())) {
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setReturnDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const handleDepartureChange = (newVal: string) => {
    setDepartureDate(newVal);
    const daysToAdd = getDaysCount(tripLength);
    const baseDate = new Date(newVal);
    if (!isNaN(baseDate.getTime())) {
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      setReturnDate(baseDate.toISOString().split('T')[0]);
    }
  };

  const toggleExtension = (ext: ExtensionCard) => {
    if (addedExtensions.includes(ext.id)) {
      setAddedExtensions(prev => prev.filter(e => e !== ext.id));
    } else {
      setAddedExtensions(prev => [...prev, ext.id]);
      const newItem: ItineraryItem = {
        id: Date.now(),
        tag: `🔗 ${ext.name.toUpperCase()}`,
        tagColor: '#EAA923',
        city: ext.name,
        description: `Explore the highlights of ${ext.name} — ${ext.days} extension.`,
        image: ext.image,
      };
      setItinerary(prev => [...prev, newItem]);
    }
  };

  const handleAddNewDay = () => {
    const newItem: ItineraryItem = {
      id: Date.now(),
      tag: '✨ CUSTOM DAY',
      tagColor: '#EAA923',
      city: 'Custom Stop',
      description: 'Relax, shop, or explore local cultural points at leisure.',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=100&q=80',
    };
    setItinerary(prev => [...prev, newItem]);
  };

  const getPackageSummaryAndTags = () => {
    const isSriLanka = selectedRegion === 'Sri Lanka';

    if (isSriLanka) {
      return {
        summary: "Discover scenic tea plantations, pristine sandy beaches, ancient UNESCO ruins, and rich wildlife safaris. Sri Lanka's natural beauty and warm tropical hospitality make it a truly unforgettable experience.",
        perfectFor: [
          { label: 'Couples', icon: <Heart className="w-5 h-5 text-[#EAA923]" /> },
          { label: 'Families', icon: <Users className="w-5 h-5 text-[#EAA923]" /> },
          { label: 'Wildlife Lovers', icon: <Compass className="w-5 h-5 text-[#EAA923]" /> },
          { label: 'Culture Lovers', icon: <Landmark className="w-5 h-5 text-[#EAA923]" /> },
          { label: 'Adventure Seekers', icon: <Gem className="w-5 h-5 text-[#EAA923]" /> },
          { label: 'Photography', icon: <Camera className="w-5 h-5 text-[#EAA923]" /> },
        ]
      };
    }

    // Default: India
    return {
      summary: "Discover the historic monuments, majestic forts, and rich heritage of India's Golden Triangle. The iconic Taj Mahal, Jaipur's royal palaces, and Delhi's vibrant culture make it a truly unforgettable experience.",
      perfectFor: [
        { label: 'Couples', icon: <Heart className="w-5 h-5 text-[#EAA923]" /> },
        { label: 'Families', icon: <Users className="w-5 h-5 text-[#EAA923]" /> },
        { label: 'First-time Visitors', icon: <Compass className="w-5 h-5 text-[#EAA923]" /> },
        { label: 'Culture Lovers', icon: <Landmark className="w-5 h-5 text-[#EAA923]" /> },
        { label: 'Luxury Travellers', icon: <Gem className="w-5 h-5 text-[#EAA923]" /> },
        { label: 'Photography', icon: <Camera className="w-5 h-5 text-[#EAA923]" /> },
      ]
    };
  };

  const packageDetails = getPackageSummaryAndTags();

  return (
    <section className="bg-[#FAF8F6] py-12 border-t border-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 xl:px-0 w-full">

        {/* ─── Step Progress Tracker ─── */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-white shadow-sm rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-0 w-full max-w-5xl overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => {
              const isCompletedOrActive = step.num <= activeStep;
              const isActive = step.num === activeStep;
              return (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => setActiveStep(step.num)}
                    className="flex items-center gap-1 sm:gap-2 shrink-0 focus:outline-none cursor-pointer"
                  >
                    <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      isCompletedOrActive
                        ? 'bg-[#EAA923] text-white shadow-sm'
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
              <button className="px-8 py-3 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer select-none">
                Book now
              </button>
              <a 
                href="tel:+442012345678" 
                className="px-6 py-3 rounded-lg border border-[#EAA923]/30 hover:bg-[#EAA923]/5 text-[#EAA923] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-white select-none"
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

        {/* ─── Main Grid Layout: 3 flat columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mx-auto w-full">

          {/* ── Col 1: Wizard Steps ── */}
          <div className="col-span-1 lg:col-span-6 bg-white border border-slate-100 rounded-xl p-6 h-auto lg:h-[579px] flex flex-col justify-between gap-4 shadow-sm">
            {(() => {
              switch (activeStep) {
                case 1:
                  return (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="mb-6">
                          <h3 className="text-[#111827] font-bold text-[22px] lg:text-[24px] mb-0.5">Where would you like to go?</h3>
                          <p className="text-[#6B7280] text-[14px]">Select your primary destination region for this journey.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            {
                              id: 'India',
                              name: 'India',
                              desc: 'Golden Triangle, Spiritual Ganges, Tiger Safaris & Palace hotels',
                              image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80',
                            },
                            {
                              id: 'Sri Lanka',
                              name: 'Sri Lanka',
                              desc: 'Ancient Ruins, Tea Plantations, Wildlife & Pristine Beaches',
                              image: 'https://images.unsplash.com/photo-1588598126483-2476d5318f75?auto=format&fit=crop&w=300&q=80',
                            }
                          ].map((reg) => {
                            const isSelected = selectedRegion === reg.id;
                            return (
                              <button
                                key={reg.id}
                                onClick={() => setSelectedRegion(reg.id)}
                                className={`flex flex-col text-left rounded-xl overflow-hidden border transition-all cursor-pointer focus:outline-none ${
                                  isSelected
                                    ? 'border-[#EAA923] shadow-md shadow-[#EAA923]/10 ring-1 ring-[#EAA923]'
                                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                }`}
                              >
                                <img src={reg.image} alt={reg.name} className="w-full h-32 object-cover" />
                                <div className="p-4 flex-grow">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[#111827] font-bold text-[16px]">{reg.name}</span>
                                    {isSelected && <span className="w-4 h-4 rounded-full bg-[#EAA923] flex items-center justify-center text-white text-[9px] font-bold">✓</span>}
                                  </div>
                                  <p className="text-[12px] text-[#6B7280] leading-relaxed">{reg.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button className="px-6 py-2.5 rounded-lg bg-[#353535]/50 text-white/50 text-sm font-semibold tracking-wider cursor-not-allowed focus:outline-none" disabled>BACK</button>
                        <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
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
                            <p className="text-[#6B7280] text-[14px]">Add more destinations to your perfect trip</p>
                          </div>
                          <button className="text-[13px] text-[#EAA923] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer focus:outline-none whitespace-nowrap">
                            View All <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Extension cards — Figma spec: h-122px, border-radius 9px, border 1px */}
                        <div className="flex-grow overflow-y-auto pr-1 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full min-h-0">
                          {extensions.map((ext) => {
                            const added = addedExtensions.includes(ext.id);
                            return (
                              <div
                                key={ext.id}
                                style={{ borderRadius: '9px', borderWidth: '1px' }}
                                className={`flex items-center overflow-hidden border transition-all h-[95px] sm:h-[108px] ${
                                  added
                                    ? 'border-[#EAA923] shadow-md shadow-[#EAA923]/10'
                                    : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                                }`}
                              >
                                {/* Left image — with padding + its own border radius */}
                                <div className="pl-2 sm:pl-3 py-2 sm:py-3 shrink-0">
                                  <img
                                    src={ext.image}
                                    alt={ext.name}
                                    className="object-cover w-24 h-[75px] sm:w-[150px] sm:h-[84px] rounded-[8px]"
                                  />
                                </div>
                                {/* Text */}
                                <div className="flex-1 min-w-0 px-3 sm:px-5">
                                  <p className="text-[#111827] font-semibold text-[14px] sm:text-[16px] leading-snug truncate sm:whitespace-normal">{ext.name}</p>
                                  <span className="text-[12px] sm:text-[13px] text-[#6B7280] font-normal mt-0.5 block line-clamp-2">{ext.subtitle || ''}</span>
                                </div>
                                {/* Chevron button */}
                                <button
                                  onClick={() => toggleExtension(ext)}
                                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mr-2 sm:mr-4 transition-all cursor-pointer focus:outline-none shadow-sm ${
                                    added
                                      ? 'bg-[#EAA923] text-white'
                                      : 'bg-[#EAA923] text-white hover:bg-[#d8961b]'
                                  }`}
                                >
                                  {added
                                    ? <Check className="w-4 h-4 stroke-[3px]" />
                                    : <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
                                  }
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button onClick={() => setActiveStep(1)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(3)} className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
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
                            India's seasons transform each destination. We've mapped the ideal windows for you — hover any month to see conditions in your selected regions.
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
                            {['5 Days', '6 Days', '7 Days', '10 Days', '2 Weeks'].map((len) => {
                              const active = tripLength === len;
                              return (
                                <button key={len} onClick={() => handleTripLengthChange(len)}
                                  className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${active ? 'border-2 border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 font-semibold px-[19px] py-[5px]' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-5 py-1.5 font-medium'}`}>
                                  {len}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">Best Time for Golden Triangle</span>
                          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                            {monthsConfig.map((m) => {
                              let colorClasses = '';
                              if (m.status === 'pleasant') colorClasses = 'border-emerald-500/40 text-emerald-600 bg-emerald-50/20';
                              else if (m.status === 'hot' || m.status === 'monsoon') colorClasses = 'border-amber-500/40 text-amber-600 bg-amber-50/20';
                              else colorClasses = 'border-red-500/40 text-red-600 bg-red-50/20';
                              return <span key={m.name} className={`py-1.5 rounded-lg text-xs font-semibold border text-center block ${colorClasses}`}>{m.name}</span>;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(4)} className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
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
                          <p className="text-[#6B7280] text-[14px] leading-relaxed">Your group shapes everything — from the pace of days to room configurations, activity levels, and special moments we weave in for you.</p>
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
                                <button onClick={() => set((prev: number) => Math.max(min, prev - 1))} className="w-8 h-8 rounded-md border border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 flex items-center justify-center font-bold text-base cursor-pointer focus:outline-none transition-colors">-</button>
                                <span className="text-slate-800 font-semibold text-sm">{value}</span>
                                <button onClick={() => set((prev: number) => prev + 1)} className="w-8 h-8 rounded-md border border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 flex items-center justify-center font-bold text-base cursor-pointer focus:outline-none transition-colors">+</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <span className="text-sm font-semibold text-[#374151]">WHAT DRAWS YOU MOST TO TRAVEL?</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Culture & Heritage', 'Beach & Relaxation', 'Wildlife Safari', 'Adventure & Trekking', 'Spiritual Journey', 'Culinary Discovery', 'Wellness & Ayurveda', 'Photography'].map((interest) => {
                              const isSelected = selectedInterests.includes(interest);
                              return (
                                <button key={interest}
                                  onClick={() => isSelected ? setSelectedInterests(prev => prev.filter(i => i !== interest)) : setSelectedInterests(prev => [...prev, interest])}
                                  className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${isSelected ? 'border-2 border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 font-semibold px-4 py-1' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-4.5 py-1.5 font-medium'}`}>
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
                                  className={`rounded-full text-sm transition-all cursor-pointer focus:outline-none ${isSelected ? 'border-2 border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 font-semibold px-4 py-1' : 'border border-slate-200 text-slate-700 hover:border-slate-300 px-4.5 py-1.5 font-medium'}`}>
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
                        <button onClick={() => setActiveStep(5)} className="px-6 py-2 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
                      </div>
                    </>
                  );

                case 5:
                  const pct = ((budgetValue - 500) / (25000 - 500)) * 100;
                  return (
                    <>
                      <style dangerouslySetInnerHTML={{__html: `
                        .range-slider-input::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          appearance: none;
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #ffffff;
                          border: 5px solid #EAA923;
                          cursor: pointer;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                          transition: transform 0.1s ease;
                        }
                        .range-slider-input::-webkit-slider-thumb:hover {
                          transform: scale(1.15);
                        }
                        .range-slider-input::-moz-range-thumb {
                          width: 10px;
                          height: 10px;
                          border-radius: 50%;
                          background: #ffffff;
                          border: 5px solid #EAA923;
                          cursor: pointer;
                          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                        }
                      `}} />

                      <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-6">
                        {/* Title and description */}
                        <div>
                          <h3 className="text-[#111827] font-semibold text-xl">Your investment in this journey</h3>
                          <p className="text-[#6B7280] text-[14px] leading-relaxed">
                            Per person, excluding international flights. This guides us in recommending the right properties, experiences, and private transfers.
                          </p>
                        </div>

                        {/* Huge price display */}
                        <div className="flex flex-col items-center justify-center py-1">
                          <div className="flex items-baseline text-[#111827]">
                            <span className="text-[32px] font-medium font-serif mr-1.5">$</span>
                            <span className="text-[58px] font-bold font-serif leading-none tracking-tight">{budgetValue}</span>
                          </div>
                          <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mt-1 block">Per Person</span>
                        </div>

                        {/* Custom styled slider */}
                        <div className="px-1">
                          <div className="relative w-full flex items-center">
                            <input
                              type="range"
                              min="500"
                              max="25000"
                              step="500"
                              value={budgetValue}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBudgetValue(val);
                                if (val < 2000) {
                                  setSelectedTravelStyle('EXPLORER');
                                } else if (val <= 6000) {
                                  setSelectedTravelStyle('SIGNATURE');
                                } else {
                                  setSelectedTravelStyle('GRAND');
                                }
                              }}
                              className="w-full h-[5px] rounded-lg appearance-none cursor-pointer focus:outline-none range-slider-input"
                              style={{
                                background: `linear-gradient(to right, #EAA923 0%, #EAA923 ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-start text-[13px] font-semibold text-slate-500 mt-2">
                            <span>$500</span>
                            <span>$25,000</span>
                          </div>
                        </div>

                        {/* Travel style cards */}
                        <div>
                          <span className="text-sm font-semibold text-[#374151] uppercase block mb-2">TRAVEL STYLE</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: 'EXPLORER', name: 'EXPLORER', price: '$500 - $2,000', val: 1250, desc: 'Boutique Guesthouses, Local Transport, Authentic Street Experiences' },
                              { id: 'SIGNATURE', name: 'SIGNATURE', price: '$2,000 - $6,000', val: 4000, desc: 'Boutique Guesthouses, Local Transport, Authentic Street Experiences' },
                              { id: 'GRAND', name: 'GRAND', price: '$6,000 +', val: 8000, desc: 'Boutique Guesthouses, Local Transport, Authentic Street Experiences' }
                            ].map((style) => {
                              const isSelected = selectedTravelStyle === style.id;
                              return (
                                <button
                                  key={style.id}
                                  onClick={() => {
                                    setSelectedTravelStyle(style.id);
                                    setBudgetValue(style.val);
                                  }}
                                  className={`flex flex-col text-left p-4 rounded-lg border transition-all cursor-pointer focus:outline-none min-h-[160px] pb-3.5 justify-between ${
                                    isSelected
                                      ? 'border-[#EAA923] bg-amber-50/20 shadow-sm ring-1 ring-[#EAA923]'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div>
                                    <span className="font-semibold text-lg text-[#EAA923] tracking-wider block">{style.name}</span>
                                    <div className="text-[#111827] font-semibold text-xl mt-0.5">{style.price}</div>
                                    <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">{style.desc}</p>
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
                            {['Boutique guesthouses', 'Heritage properties', 'Luxury resorts', 'Private villas', 'Eco lodges', '5-star city hotels'].map((acc) => {
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
                                      ? 'border-2 border-[#EAA923] text-[#EAA923] bg-[#EAA923]/5 font-semibold px-4 py-1'
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
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923] cursor-pointer"
                          >
                            <option value="I've arranged my international flights">I've arranged my international flights</option>
                            <option value="I need help booking international flights">I need help booking international flights</option>
                            <option value="I want an all-inclusive flight + land package">I want an all-inclusive flight + land package</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button onClick={() => setActiveStep(4)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setActiveStep(6)} className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">CONTINUE →</button>
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
                            Your dedicated specialist will use these to craft and send a personalised itinerary within 24 hours. We never share your details.
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
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923]"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Last Name</label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Singh"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923]"
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
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923]"
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
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923]"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Country of Residence</label>
                              <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923] cursor-pointer"
                              >
                                <option value="" disabled hidden>Select country</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="India">India</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-[#374151] uppercase block mb-1.5">Anything Special We Should Know?</label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Dietary needs, accessibility, a special occasion, must-have moments, anything that matters..."
                              rows={3}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50/30 focus:outline-none focus:border-[#EAA923] focus:ring-1 focus:ring-[#EAA923] resize-none"
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
                          className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none"
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
                            setActiveStep(2); // Restart at step 2
                          }}
                          className="mt-4 px-6 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-semibold transition-all cursor-pointer focus:outline-none"
                        >
                          Design Another Trip
                        </button>
                      </div>
                    );
                  }

                  const reviewRows = [
                    { label: 'Destination', value: selectedRegion },
                    { label: 'Selected regions', value: addedExtensions.length > 0 ? `${selectedRegion}, ${addedExtensions.join(', ')}` : 'Open — suggest the best' },
                    { label: 'Travel dates', value: departureDate && returnDate ? `${formatDate(departureDate)} - ${formatDate(returnDate)}` : '-' },
                    { label: 'Duration', value: tripLength || '-' },
                    { label: 'Flexibility', value: 'Exact dates only' },
                    { label: 'Travellers', value: `${adults} ${adults === 1 ? 'adult' : 'adults'}${childrenCount > 0 ? `, ${childrenCount} child` : ''}${infants > 0 ? `, ${infants} infant` : ''}` },
                    { label: 'Interests', value: selectedInterests.length > 0 ? selectedInterests.join(', ') : '-' },
                    { label: 'Travel style', value: travelStyle || '-' },
                    { label: 'Budget', value: `$${budgetValue.toLocaleString()} / person` },
                    { label: 'Accommodation', value: selectedAccommodations.length > 0 ? selectedAccommodations.join(', ') : '-' },
                    { label: 'Name', value: firstName || lastName ? `${firstName} ${lastName}` : '-' },
                    { label: 'Email', value: contactEmail || '-' },
                    { label: 'Phone', value: contactPhone || '-' },
                    { label: 'Country', value: country || '-' },
                  ];

                  return (
                    <>
                      <div className="flex-grow overflow-y-auto pr-1 min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full space-y-4">
                        <div className="mb-6">
                          <h3 className="text-[#111827] font-semibold text-xl">Review your custom journey</h3>
                          <p className="text-[#6B7280] text-[14px]">Double-check your preferences before submitting your travel request.</p>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200/60 bg-white">
                          {/* Header */}
                          <div className="bg-[#352513] text-white px-6 py-4 flex justify-between items-center">
                            <h4 className="font-bold text-[18px]">Your {selectedRegion} Journey</h4>
                            <span className="border border-[#EAA923]/80 text-[#EAA923] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                              Personalised Quote
                            </span>
                          </div>
                          {/* Rows */}
                          <div className="divide-y divide-slate-100">
                            {reviewRows.map((row) => (
                              <div key={row.label} className="py-3.5 px-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 hover:bg-slate-50/50 transition-colors">
                                <span className="text-[#EAA923] font-medium text-[14px] sm:text-[15px]">{row.label}</span>
                                <span className="text-slate-800 font-semibold text-[14px] sm:text-[15px] text-left sm:text-right">{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button onClick={() => setActiveStep(6)} className="px-6 py-2.5 rounded-lg bg-[#353535] hover:bg-black text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">BACK</button>
                        <button onClick={() => setIsSubmitted(true)} className="px-6 py-2.5 rounded-lg bg-[#EAA923] hover:bg-[#d8961b] text-white text-sm font-semibold tracking-wider transition-colors cursor-pointer focus:outline-none">SUBMIT →</button>
                      </div>
                    </>
                  );
                }
              }
            })()}
          </div>

          {/* ── Col 2: Day-by-Day Itinerary ── */}
          <div className="col-span-1 lg:col-span-3 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col h-[579px] lg:h-[579px]">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 shrink-0">
              <h2 className="text-[#111827] font-semibold text-lg">Day-by-Day Itinerary</h2>
              <button className="flex items-center gap-1 text-[13px] text-[#EAA923] font-semibold cursor-pointer focus:outline-none hover:underline">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full min-h-0">
              {itinerary.map((item, idx) => (
                <div key={item.id} className="relative flex gap-3">
                  {idx < itinerary.length - 1 && (
                    <span className="absolute left-[14px] top-8 bottom-[-16px] w-px bg-slate-100 z-0" />
                  )}
                  <span className="w-7 h-7 rounded-full bg-[#EAA923] text-white flex items-center justify-center text-xs font-semibold shrink-0 z-10 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 flex justify-between items-start gap-2 min-w-0">
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold tracking-wider uppercase block" style={{ color: item.tagColor }}>{item.tag}</span>
                      <p className="text-[#111827] font-semibold text-base mt-0.5">{item.city}</p>
                      <p className="text-[#6B7280] text-[13px] mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                    <img src={item.image} alt={item.city} className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-100" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 shrink-0">
              <button onClick={handleAddNewDay} className="w-full border border-dashed border-slate-200 hover:border-[#EAA923] rounded-xl py-2.5 text-[13px] font-semibold text-[#EAA923] hover:bg-amber-50/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none">
                <Plus className="w-3.5 h-3.5" /> Add New Day
              </button>
            </div>
          </div>

          {/* ── Col 3: Route Map ── */}
          <div className="col-span-1 lg:col-span-3 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col h-[400px] sm:h-[500px] lg:h-[579px]">
            <h2 className="text-[#111827] font-semibold text-lg pb-4 border-b border-slate-100 mb-4 shrink-0">Route Map</h2>
            <div className="flex-1 w-full overflow-hidden rounded-xl" style={{ minHeight: 0 }}>
              <InteractiveMap itineraries={itinerary} />
            </div>
          </div>

        </div>

        {/* ─── Experience Highlights Section ─── */}
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
            <button className="text-[13px] text-[#EAA923] font-semibold flex items-center gap-1 hover:underline cursor-pointer focus:outline-none group">
              View All <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

          <div 
            ref={highlightsScrollRef}
            className="flex gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
          >
            {highlights.map((hl: { title: string; image: string }) => (
              <div 
                key={hl.title} 
                className="group rounded-xl overflow-hidden border border-slate-200/80 transition-all flex flex-col bg-white w-[200px] min-w-[200px] sm:w-[338px] sm:min-w-[338px] h-[175px] sm:h-[231px] shrink-0 shadow-sm hover:shadow-md"
              >
                <div className="relative h-[120px] sm:h-[150px] w-full overflow-hidden">
                  <img 
                    src={hl.image} 
                    alt={hl.title} 
                    draggable="false"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center bg-white border-t border-slate-50">
                  <p className="text-[#374151] font-bold text-xs sm:text-[14px] leading-snug group-hover:text-[#EAA923] transition-colors line-clamp-2">
                    {hl.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


    

      </div>
    </section>
  );
};
