'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const PlanHeroSection: React.FC = () => {
  const [activeSearch, setActiveSearch] = useState('Golden Triangle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const searchVal = params.get('search');
      if (searchVal) {
        setActiveSearch(searchVal);
      }
    }
  }, []);

  const cards = [
    {
      name: 'Golden Triangle',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=300&q=80',
      href: '/package?search=Golden%20Triangle'
    },
    {
      name: 'Kerala',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=300&q=80',
      href: '/package?search=Kerala'
    },
    {
      name: 'Goa',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
      href: '/package?search=Goa'
    },
    {
      name: 'Wild life',
      image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=300&q=80',
      href: '/package?search=Ranthambore'
    },
    {
      name: 'Spiritual India',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=300&q=80',
      href: '/package?search=Varanasi'
    }
  ];

  const isCardActive = (cardName: string) => {
    const q = activeSearch.toLowerCase();
    const name = cardName.toLowerCase();
    if (name === 'wild life') {
      return q.includes('wild') || q.includes('ranthambore') || q.includes('yala');
    }
    if (name === 'spiritual india') {
      return q.includes('spiritual') || q.includes('varanasi');
    }
    return q.includes(name);
  };

  return (
    <section className="relative w-full h-[620px] sm:h-[680px] flex flex-col justify-end pb-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/images/plans/thag.png')" }}
      />
      
      {/* Gradients */}
      {/* Top gradient for navbar text readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      {/* Bottom gradient/shadow for text readability and premium fade */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative max-w-[1760px] mx-auto px-6 sm:px-12 xl:px-0 w-full z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
        {/* Left Text Block */}
        <div className="space-y-4 max-w-xl shrink-0">
          <span className="text-[#EAA923] font-serif text-md sm:text-lg font-bold tracking-wide block">
            The Subcontinent
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.1] drop-shadow-md">
            Plan Your <br />
            <span className="text-[#EAA923]">India</span> Journey
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-lg font-light tracking-wide">
            Choose the destination that inspires you <br className="hidden sm:inline" /> most.
          </p>
        </div>

        {/* Right Cards Slider */}
        <div className="flex gap-4 overflow-x-auto lg:overflow-x-visible pb-4 pt-2 scrollbar-none flex-1 max-w-full lg:max-w-[1020px] justify-start lg:justify-end [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {cards.map((card) => {
            const active = isCardActive(card.name);
            return (
              <Link
                key={card.name}
                href={card.href}
                className={`flex-shrink-0 w-[190px] h-[190px] rounded-[15px] border-t border-r-4 border-b-2 border-l relative overflow-hidden group transition-all duration-300 ${
                  active 
                    ? 'border-[#EAA923] scale-105 shadow-[0_0_15px_rgba(234,169,35,0.4)]' 
                    : 'border-white/20 hover:border-white/50 hover:scale-102'
                }`}
              >
                {/* Card Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                {/* Gradient overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {/* Card Text */}
                <span className="absolute bottom-3 left-0 right-0 text-center text-white text-[11px] font-bold tracking-wider uppercase drop-shadow-sm">
                  {card.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
