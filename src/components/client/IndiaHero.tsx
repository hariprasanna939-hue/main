'use client';

import React from 'react';

interface IndiaHeroProps {
  heroDesktopUrl?: string;
  heroMobileUrl?: string;
}

export const IndiaHero: React.FC<IndiaHeroProps> = ({ heroDesktopUrl, heroMobileUrl }) => {
  return (
    <section className="relative w-full h-[650px] sm:h-[720px] lg:h-[820px] flex flex-col justify-end pb-16 lg:pb-24 overflow-hidden font-poppins bg-black">
      {/* Background Image */}
      <div 
        className="hidden sm:block absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] scale-100 opacity-90"
        style={{ backgroundImage: `url('${heroDesktopUrl || '/images/plans/india.png'}')` }}
      />
      <div 
        className="block sm:hidden absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] scale-100 opacity-90"
        style={{ backgroundImage: `url('${heroMobileUrl || '/images/thagmob.png'}')` }}
      />
      
      {/* Gradients */}
      {/* Left to right dark gradient for text readability (matches the dark fade on the left of the image) */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[70%] lg:w-[55%] bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none z-1" />
      
      {/* Top gradient for navbar text readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-1" />
      
      {/* Bottom gradient/shadow for text readability and premium fade */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-1" />

      {/* Content Container */}
      <div className="relative max-w-[1760px] mx-auto px-6 sm:px-12 xl:px-16 w-full z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
        {/* Left Title Block */}
        <div className="space-y-3 max-w-xl shrink-0 text-left animate-fade-in">
          <span className="text-[var(--country-primary,#ebb337)] font-cormorant italic text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-wide block leading-none">
            Where does
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.05]">
            Your <span className="text-[var(--country-primary,#ebb337)]">Soul</span> <br />
            Want to go?
          </h1>
        </div>

        {/* Right Badge Block */}
        <div className="self-start md:self-end animate-fade-in-delayed shrink-0 mb-2 md:mb-0">
          <img 
            src="/images/plans/indiarating.png" 
            alt="Trusted by 10,000+ Happy Travellers" 
            className="w-[180px] sm:w-[210px] lg:w-[245px] h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)] transform hover:scale-103 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};
