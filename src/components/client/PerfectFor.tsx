'use client';

import React from 'react';
import { WhyLoveIcon } from './WhyLoveIcon';

const PERFECT_FOR_ITEMS = [
  { text: "UNESCO Heritage Sites" },
  { text: "Local Expert Guides" },
  { text: "Private Chauffeur & Comfortable Travel" },
  { text: "Rich Culture & Royal Heritage" },
  { text: "Handpicked Luxury Hotels" },
  { text: "Flexible & Customisable Itineraries" },
];

interface PerfectForProps {
  primaryColor?: string;
  items?: any[]; // Kept for API compatibility, but ignored
  bgImageUrl?: string;
}

export const PerfectFor: React.FC<PerfectForProps> = ({ primaryColor = '#EAA923', bgImageUrl }) => {
  return (
    <section
      className="w-full py-20 px-6 sm:px-12 font-poppins bg-cover bg-top bg-no-repeat bg-[#FAF8F6]"
      style={{
        backgroundImage: `url('${bgImageUrl || '/IMAGE/Perfect%20For/Frame%20358.png'}')`,
        '--pkg-primary': primaryColor
      } as React.CSSProperties}
    >
      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] text-[#111827] text-center mb-10 select-none">
          <span className="font-semibold">Why YOU'll Love </span>
          <span className="text-[var(--pkg-primary)] font-semibold">This Holiday</span>
        </h2>

        {/* White Container Box */}
        <div className="bg-white rounded-[24px] p-4 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 w-full">
          <div className="grid grid-cols-2 gap-3 sm:gap-y-5 sm:gap-x-8">
            {PERFECT_FOR_ITEMS.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-4 bg-white border border-slate-100 hover:border-[var(--pkg-primary)]/30 rounded-[12px] sm:rounded-[14px] p-2.5 sm:p-4 shadow-[0_2px_8px_rgb(0,0,0,0.01)] hover:shadow-md transition-all duration-300 group"
              >
                {/* Render the inline SVGs (Group 50–65) with custom primary colors */}
                <WhyLoveIcon index={index} primaryColor={primaryColor} />

                {/* Text Label */}
                <span className="font-medium text-[#111827] text-[11px] sm:text-base leading-tight sm:leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectFor;
