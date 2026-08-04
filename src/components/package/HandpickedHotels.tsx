'use client';

import React, { useRef, useEffect } from 'react';

interface HandpickedHotelsProps {
  hotels?: any[];
  primaryColor?: string;
}

export const HandpickedHotels: React.FC<HandpickedHotelsProps> = ({
  hotels = [],
  primaryColor = '#EAA923',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
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

  // Hardcoded default hotels to display if package has no hotels or to match the mockup perfectly
  const defaultHotels = [
    {
      id: 'default-1',
      title: 'ITC Grand Bharat Hotel',
      location: 'Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1585983224974-084a8e065e76?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'default-2',
      title: 'The Leela Palace',
      location: 'Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'default-3',
      title: 'Taj Hotel',
      location: 'Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'default-4',
      title: 'Rambagh Palace',
      location: 'Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop',
    },
  ];

  // If there are hotels in the package, use them, otherwise use the defaults
  const displayHotels = hotels && hotels.length > 0
    ? hotels.map((h, index) => ({
        id: h.id,
        title: h.title,
        location: h.description || '',
        imageUrl: h.image?.url || defaultHotels[index % 4].imageUrl,
      }))
    : defaultHotels;

  return (
    <section className="w-full bg-[#FAF8F6] py-16 border-t border-slate-100" style={{ '--pkg-primary': primaryColor } as React.CSSProperties}>
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 xl:px-0 w-full">
        {/* Header Block */}
        <div className="text-center mb-12">
          {/* Top Subtitle with ornament */}
          <div className="flex flex-col items-center mb-1">
            <span className="text-[11px] sm:text-[12px] font-semibold text-[var(--pkg-primary)] tracking-[0.2em] uppercase">
              Crafted Journeys, Timeless Memories
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-[1px] w-6 bg-[var(--pkg-primary)] opacity-40"></span>
              <span className="text-[10px] text-[var(--pkg-primary)]">✦</span>
              <span className="h-[1px] w-6 bg-[var(--pkg-primary)] opacity-40"></span>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#111827] mt-3 mb-2 tracking-tight">
            Handpicked Hotels
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#6B7280]">
            Add more destinations to your perfect trip
          </p>
        </div>

        {/* Hotels Grid */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
        >
          {displayHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="bg-white rounded-2xl border border-slate-200/60 p-3 flex flex-col group hover:shadow-md transition-all duration-300 w-[240px] min-w-[240px] sm:w-auto sm:min-w-0 shrink-0"
            >
              {/* Image wrapper */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                <img 
                  src={hotel.imageUrl} 
                  alt={hotel.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Text Block */}
              <div className="pt-4 pb-2 px-1 flex flex-col items-center">
                <h3 className="text-base sm:text-[17px] font-medium text-[#111827] text-center line-clamp-1 group-hover:text-[var(--pkg-primary)] transition-colors duration-200">
                  {hotel.title}
                </h3>
                <span className="text-xs sm:text-sm text-[#6B7280] font-medium text-center mt-1">
                  {hotel.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
