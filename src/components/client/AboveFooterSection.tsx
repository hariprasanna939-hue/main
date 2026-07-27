import React from 'react';

interface AboveFooterSectionProps {
  title?: string | null;
  imageUrl?: string | null;
  countryName?: string;
  packageTitle?: string;
}

export const AboveFooterSection: React.FC<AboveFooterSectionProps> = ({
  title,
  imageUrl,
  countryName = 'India',
  packageTitle,
}) => {
  return (
    <section
      className="w-full bg-cover bg-no-repeat relative overflow-hidden py-16 sm:py-24 px-6 sm:px-16 lg:px-24 m-0 block"
      style={{
        backgroundImage: `url('${imageUrl || '/IMAGE/above%20footer/abovefooter1.png'}')`,
        backgroundPosition: "center 35%"
      }}
    >
      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col justify-center min-h-[220px]">
        {/* Subtitle: e.g. India is calling. */}
        <span className="font-cormorant italic text-[var(--country-primary,var(--pkg-primary,#CDA054))] text-[20px] sm:text-[24px] font-medium mb-3 block">
          {countryName} is calling.
        </span>

        {/* Main Title: Let's plan your escape. or custom package title */}
        <h2 className="font-poppins font-medium text-[36px] sm:text-[48px] lg:text-[54px] text-[#1E2A3B] leading-tight mb-8 max-w-xl">
          {title || "Let's plan your escape."}
        </h2>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 font-poppins w-full mt-2">
          {/* Enquire Now Button */}
          <button
            className="flex items-center justify-center gap-2 text-white px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-medium tracking-wider transition-all hover:opacity-90 shadow-md cursor-pointer w-auto text-center"
            style={{ backgroundColor: 'var(--country-primary, var(--pkg-primary, #CDA054))' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            ENQUIRE NOW
          </button>

          {/* Call Us Button */}
          <a
            href="tel:+442012345678"
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[var(--country-primary,var(--pkg-primary,#CDA054))] text-[var(--country-primary,var(--pkg-primary,#CDA054))] px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-medium tracking-wider uppercase transition-all cursor-pointer w-auto text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[2.5px] w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            CALL US: +44 20 1234 5678
          </a>
        </div>
      </div>
    </section>
  );
};
