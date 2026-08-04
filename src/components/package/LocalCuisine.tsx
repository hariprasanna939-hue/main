'use client';

import React from 'react';

interface LocalCuisineProps {
  cuisines?: any[];
  primaryColor?: string;
  bgImageUrl?: string;
}

const defaultCuisines = [
  {
    id: "default-1",
    title: "Butter Chicken, Chole Bhature, Paratha",
    imageUrl: "/images/food1.png",
    iconUrl: "/images/icons/foodicon1.png"
  },
  {
    id: "default-2",
    title: "Agra Petha, Bedai, Mughlai Kebabs",
    imageUrl: "/images/food2.png",
    iconUrl: "/images/icons/foodicon2.png"
  },
  {
    id: "default-3",
    title: "Dal Baati Churma, Pyaaz Kachori, Ghewar",
    imageUrl: "/images/food3.png",
    iconUrl: "/images/icons/foodicon3.png"
  }
];

export const LocalCuisine: React.FC<LocalCuisineProps> = ({ cuisines, primaryColor = '#EAA923', bgImageUrl }) => {
  const displayCuisines = (cuisines && cuisines.length > 0)
    ? cuisines.map((c, index) => {
        const fallback = defaultCuisines[index % 3];
        // Resolve dynamic icon from database if set
        let resolvedIconUrl = c.icon?.image?.url;
        if (!resolvedIconUrl) {
          // Check icon name mappings to assign the correct custom local icon
          const iconName = c.icon?.name?.toLowerCase() || '';
          if (iconName.includes('veg') || iconName.includes('leaf') || iconName.includes('1')) {
            resolvedIconUrl = "/images/icons/foodicon1.png";
          } else if (iconName.includes('fish') || iconName.includes('seafood') || iconName.includes('2')) {
            resolvedIconUrl = "/images/icons/foodicon2.png";
          } else {
            resolvedIconUrl = "/images/icons/foodicon3.png";
          }
        }
        
        return {
          id: c.id,
          title: c.title,
          imageUrl: c.image?.url || fallback.imageUrl,
          iconUrl: resolvedIconUrl
        };
      })
    : defaultCuisines;

  return (
    <section 
      className="w-full py-20 px-6 sm:px-12 lg:px-24 bg-cover bg-center bg-no-repeat bg-[#FAF8F6] relative overflow-hidden"
      style={{ 
        backgroundImage: `url('${bgImageUrl || '/images/localcuisine.png'}')`,
        '--pkg-primary': primaryColor 
      } as React.CSSProperties}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Title */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left select-none">
          <span className="font-playfair font-normal text-xl lg:text-[28.42px] lg:leading-[34.1px] tracking-[0px] text-[#1E2A3B] align-middle mb-3">
            Discover
          </span>
          <h2 className="text-[#1E2A3B] font-playfair font-bold text-4xl sm:text-6xl lg:text-[83.36px] lg:leading-[75.02px] tracking-[-1.5px] lg:tracking-[-2.08px] align-middle mb-6">
            Local <br className="hidden lg:block" />
            <span className="text-[var(--pkg-primary)]">Cuisine</span>
          </h2>
          
          {/* Ornament Divider */}
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div className="h-px bg-slate-350/60 flex-1"></div>
            <span className="text-[var(--pkg-primary)] text-sm">✦</span>
            <div className="h-px bg-slate-350/60 flex-1"></div>
          </div>
        </div>

        {/* Right Side: Cuisine Cards */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full max-w-[480px] mx-auto lg:mr-0 lg:ml-auto">
          {displayCuisines.map((item) => (
            <div 
              key={item.id}
              className="bg-white/90 backdrop-blur-xs hover:bg-white rounded-[24px] p-4 pr-6 border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 sm:gap-6 group"
            >
              {/* Food Image */}
              <img 
                src={item.imageUrl} 
                alt={item.title || "Local dish"} 
                className="w-24 h-16 sm:w-[140px] sm:h-[92px] shrink-0 object-contain group-hover:scale-105 transition-transform duration-500 select-none" 
              />

              {/* Title & Accent Divider */}
              <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-2">
                <h3 className="font-playfair font-normal text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] tracking-[0px] text-[#1E2A3B] text-center align-middle max-w-[240px]">
                  {item.title}
                </h3>
                
                {/* Micro ornament */}
                <div className="flex items-center gap-1.5 mt-2 opacity-60">
                  <div className="h-[1px] w-3 bg-slate-300"></div>
                  <span className="text-[8px] text-[var(--pkg-primary)]">✦</span>
                  <div className="h-[1px] w-3 bg-slate-300"></div>
                </div>
              </div>

              {/* Icon Badge Image */}
              <img 
                src={item.iconUrl} 
                alt="Cuisine Icon" 
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0 select-none transition-transform duration-300 group-hover:scale-105" 
              />

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
