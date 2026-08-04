'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DestinationCard {
  id: string;
  num: string;
  name: string;
  desc: string;
  image: string;
  slug: string;
}

interface IndiaRegionsSelectorProps {
  packages: any[];
  countrySlug: string;
}

export const IndiaRegionsSelector: React.FC<IndiaRegionsSelectorProps> = ({ packages, countrySlug }) => {
  const [selectedId, setSelectedId] = useState<string>(packages[0]?.id || '');
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

  const steps = [
    { num: 1, label: 'Regions' },
    { num: 2, label: 'Addons' },
    { num: 3, label: 'Dates' },
    { num: 4, label: 'Travellers' },
    { num: 5, label: 'Budget' },
    { num: 6, label: 'Details' },
    { num: 7, label: 'Review' },
  ];

  const cards: DestinationCard[] = packages.map((pkg, index) => ({
    id: pkg.id,
    num: String(index + 1).padStart(2, '0'),
    name: pkg.title,
    desc: pkg.subtitle || (pkg.description ? pkg.description.slice(0, 40) + '...' : ''),
    image: pkg.gallery?.[0]?.image?.url || '/images/plans/goldentriangle.png',
    slug: pkg.slug,
  }));

  const selectedPackage = packages.find(pkg => pkg.id === selectedId);
  const selectedExperiences = selectedPackage?.experiences || [];

  const defaultExperiences = [
    { title: 'Adventure', imageOne: { url: '/images/plans/advanture.jpg' } },
    { title: 'Luxury', imageOne: { url: '/images/plans/luxury.png' } },
    { title: 'Culture', imageOne: { url: '/images/plans/culture.jpg' } },
    { title: 'Wildlife', imageOne: { url: '/images/plans/wildlife.jpg' } },
    { title: 'Food', imageOne: { url: '/images/plans/food.jpg' } }
  ];

  const currentExperiences = selectedExperiences.length > 0 ? selectedExperiences : defaultExperiences;

  return (
    <section className="bg-[#FAF8F6] py-16 sm:py-24 border-t border-slate-100 font-poppins">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Stepper progress tracker (matches image style) */}
        <div className="flex items-center justify-center mb-10 sm:mb-16">
          <div className="bg-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/80 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-1 w-full max-w-5xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {steps.map((step, idx) => {
              const isFirst = step.num === 1;
              return (
                <React.Fragment key={step.num}>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-semibold transition-all shrink-0 ${
                      isFirst
                        ? 'bg-[var(--country-primary,#EAA923)] text-white shadow-md'
                        : 'bg-[#F1F5F9] text-slate-500'
                    }`}>
                      {step.num}
                    </span>
                    <span className={`text-[11px] lg:text-[14px] whitespace-nowrap transition-colors ${
                      isFirst ? 'inline' : 'lg:inline hidden'
                    } ${
                      isFirst
                        ? 'text-[#111827] font-semibold'
                        : 'text-[#94A3B8] font-medium'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 border-t border-dashed border-slate-200 mx-1 lg:mx-4 min-w-[6px] lg:min-w-[20px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Section Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h3 className="text-slate-800 text-lg sm:text-xl font-medium font-poppins leading-relaxed">
            Choose the destination that inspires you most.
          </h3>
          <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
            Click on the destinations to explore in detail, including <br className="hidden sm:inline" />
            the best time to visit, local cuisine, must-try experiences, and much more.
          </p>
        </div>

        {/* Grid of Regions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card) => {
            const isSelected = selectedId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedId(card.id)}
                style={{ borderRadius: '28.87px' }}
                className={`group relative w-full md:w-[436px] h-[300px] sm:h-[387px] mx-auto overflow-hidden cursor-pointer transition-all duration-500 border-t-[1.92px] border-r-[7.7px] border-b-[3.85px] border-l-[1.92px] ${
                  isSelected 
                    ? 'border-[var(--country-primary,#EAA923)] scale-[1.02] shadow-xl' 
                    : 'border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                {/* Selected Checkmark Badge (top-right) */}
                {isSelected && (
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[var(--country-primary,#EAA923)] flex items-center justify-center text-white shadow-md animate-scale-up">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                )}

                {/* Card Number & Gold Line (top-left) */}
                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 flex items-center gap-2">
                  <span className="text-white/90 font-cormorant text-2xl font-semibold tracking-wider leading-none">
                    {card.num}
                  </span>
                  <div className="w-8 h-[2px] bg-[var(--country-primary,#EAA923)] rounded-full" />
                </div>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col justify-end">
                  <h4 className="text-white text-xl sm:text-2xl font-semibold font-poppins tracking-tight mb-1 leading-snug">
                    {card.name}
                  </h4>
                  <p className="text-white/80 text-[11px] sm:text-[13px] font-light leading-relaxed mb-3 sm:mb-4">
                    {card.desc}
                  </p>
                  
                  {/* Explore Button */}
                  <Link
                    href={`/package/${countrySlug}/${card.slug}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-2.5 text-white/90 font-semibold text-xs uppercase tracking-wider mt-1 group-hover:text-[var(--country-primary,#EAA923)] transition-colors"
                  >
                    <span>Explore</span>
                    <span className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center group-hover:border-[var(--country-primary,#EAA923)] group-hover:bg-[var(--country-primary,#EAA923)] group-hover:text-black transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience Highlights Section (Matches User's Screenshot) */}
        <div className="mt-16 bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-3xl p-4 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h4 className="text-[#111827] font-semibold text-lg sm:text-[20px] leading-tight">
              Experience Highlights
            </h4>
            <p className="text-slate-500 text-xs sm:text-sm font-light mt-1">
              Journey through moments that inspire and stay forever.
            </p>
          </div>

          {/* Horizontally scrollable row of experience cards */}
          <div 
            ref={highlightsScrollRef}
            className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
          >
            {currentExperiences.map((exp: any, index: number) => (
              <div 
                key={exp.id || index}
                className="w-[200px] min-w-[200px] sm:w-[338px] sm:min-w-[338px] h-[175px] sm:h-[231px] bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col shrink-0"
              >
                {/* Image */}
                <div className="h-[120px] sm:h-[150px] w-full overflow-hidden bg-slate-50">
                  <img 
                    src={exp.imageOne?.url || '/images/plans/culture.jpg'} 
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {/* Label */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center bg-white border-t border-slate-50">
                  <span className="font-semibold text-xs sm:text-[14px] text-slate-800 tracking-tight leading-snug line-clamp-2">
                    {exp.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Continue Button */}
        <div className="flex justify-center mt-10">
          {(() => {
            const selectedCard = cards.find(c => c.id === selectedId);
            const linkHref = selectedCard ? `/package/${countrySlug}/${selectedCard.slug}` : '#';
            return (
              <a href={linkHref} className="px-10 py-3 bg-[var(--country-primary,#EAA923)] hover:opacity-90 active:scale-98 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
              </a>
            );
          })()}
        </div>

      </div>
    </section>
  );
};
