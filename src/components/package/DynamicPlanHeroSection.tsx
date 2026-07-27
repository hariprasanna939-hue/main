'use client';

import React from 'react';
import Link from 'next/link';

interface PackageInfo {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
}

interface DynamicPlanHeroSectionProps {
  currentPackageSlug: string;
  countryName: string;
  countrySlug: string;
  packages: PackageInfo[];
  coverImageUrl: string;
  title: string;
  subtitle: string;
}

export const DynamicPlanHeroSection: React.FC<DynamicPlanHeroSectionProps> = ({
  currentPackageSlug,
  countryName,
  countrySlug,
  packages,
  coverImageUrl,
  title,
  subtitle,
}) => {
  return (
    <section className="relative w-full h-[620px] sm:h-[720px] lg:h-[840px] flex flex-col justify-end pb-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
        style={{ backgroundImage: `url('${coverImageUrl}')` }}
      />
      
      {/* Gradients */}
      {/* Top gradient for navbar text readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      {/* Bottom gradient/shadow for text readability and premium fade */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative max-w-[1760px] mx-auto px-6 sm:px-12 xl:px-16 w-full z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
        {/* Left Text Block */}
        <div className="space-y-4 max-w-max shrink-0 lg:pl-8 xl:pl-12">
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.1] drop-shadow-md sm:whitespace-nowrap">
            {title}
          </h1>
          <p className="text-base sm:text-2xl text-[var(--pkg-primary)] font-medium tracking-wide block sm:whitespace-nowrap">
            {subtitle}
          </p>
        </div>

  
      </div>
    </section>
  );
};
