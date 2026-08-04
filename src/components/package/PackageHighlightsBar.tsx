'use client';

import React from 'react';
import { Plane, CloudSun, Clock, CalendarDays, Luggage } from 'lucide-react';
import SvgIcon from '@/components/ui/SvgIcon';

interface PackageHighlightsBarProps {
  slug: string;
  countryName: string;
  durationDays: number;
  durationNights: number;
  primaryColor?: string;
  bestTimeToTravel?: string | null;
  weather?: string | null;
  travelTime?: string | null;
  tourDurationText?: string | null;
  tourStyle?: string | null;
  highlights?: Array<{
    title: string;
    value: string;
    icon?: {
      image?: {
        url: string;
      } | null;
    } | null;
  }> | null;
}

export const PackageHighlightsBar: React.FC<PackageHighlightsBarProps> = ({
  slug,
  countryName,
  durationDays,
  durationNights,
  primaryColor = '#EAA923',
  bestTimeToTravel,
  weather,
  travelTime,
  tourDurationText,
  tourStyle,
  highlights,
}) => {
  // Determine contextual values based on slug/country
  const isSriLanka = 
    slug.toLowerCase().includes('sri-lanka') || 
    slug.toLowerCase().includes('srilanka') || 
    countryName.toLowerCase().includes('sri lanka');
  
  const bestTimeVal = bestTimeToTravel || (isSriLanka ? 'Dec to Apr' : 'Oct to Mar');
  const weatherVal = weather || (isSriLanka ? '24°C - 31°C' : '15°C - 30°C');
  const travelTimeVal = travelTime || (isSriLanka ? 'Colombo to Kandy 3 - 4 hrs' : 'Delhi to Agra 3 - 4 hrs');
  const tourDurationVal = tourDurationText || `${durationDays} Days / ${durationNights} Nights`;
  const tourStyleVal = tourStyle || (isSriLanka ? 'Private Escorted Tour' : 'Private Chauffeur Tour');

  const hasDynamicHighlights = highlights && highlights.length > 0;

  const itemsToRender = hasDynamicHighlights
    ? highlights.map((hl) => ({
        label: hl.title,
        value: hl.value,
        icon: hl.icon?.image?.url ? (
          hl.icon.image.url.endsWith('.svg') ? (
            <SvgIcon 
              url={hl.icon.image.url} 
              primaryColor={primaryColor} 
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" 
            />
          ) : (
            <img 
              src={hl.icon.image.url} 
              alt={hl.title} 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain" 
            />
          )
        ) : (
          <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" style={{ transform: 'rotate(45deg)' }} />
        ),
      }))
    : [
        {
          label: 'Best Time to Travel',
          value: bestTimeVal,
          icon: <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" style={{ transform: 'rotate(45deg)' }} />,
        },
        {
          label: 'Weather',
          value: weatherVal,
          icon: <CloudSun className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" />,
        },
        {
          label: 'Travel Time',
          value: travelTimeVal,
          icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" />,
        },
        {
          label: 'Tour Duration',
          value: tourDurationVal,
          icon: <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" />,
        },
        {
          label: 'Tour Style',
          value: tourStyleVal,
          icon: <Luggage className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pkg-primary)]" />,
        },
      ];

  return (
    <div className="w-full bg-white border-b border-slate-100 py-6" style={{ '--pkg-primary': primaryColor } as React.CSSProperties}>
      <div className="max-w-[1760px] mx-auto px-6 sm:px-12 xl:px-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row lg:justify-between gap-x-4 gap-y-6 sm:gap-6 lg:gap-4 items-center">
          {itemsToRender.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 sm:gap-4 select-none">
              {/* Icon Container without outer circle */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              {/* Text Block */}
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[12px] font-semibold text-[#6B7280] tracking-wider uppercase block">
                  {item.label}
                </span>
                <span className="text-xs sm:text-base font-semibold text-[#111827] mt-0.5 sm:mt-1 leading-tight">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
