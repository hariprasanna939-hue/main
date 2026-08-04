import React from 'react';

interface ConfidenceItem {
  title: string;
}

const ConfidenceIcon: React.FC<{ index: number; className?: string }> = ({ index, className }) => {
  switch (index) {
    case 0: // ATOL Protected (ctwc1.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="56" height="56" rx="28" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #D4AF37)" strokeOpacity="0.2"/>
          <path d="M31.75 21C31.75 18.9303 30.0697 17.25 28 17.25C25.9303 17.25 24.25 18.9303 24.25 21C24.25 23.0697 25.9303 24.75 28 24.75C30.0697 24.75 31.75 23.0697 31.75 21ZM22 21C22 17.6885 24.6885 15 28 15C31.3115 15 34 17.6885 34 21C34 24.3115 31.3115 27 28 27C24.6885 27 22 24.3115 22 21ZM19.8109 36.75H36.1891C35.7719 33.7828 33.2219 31.5 30.1422 31.5H25.8578C22.7781 31.5 20.2281 33.7828 19.8109 36.75ZM17.5 37.6078C17.5 32.9906 21.2406 29.25 25.8578 29.25H30.1422C34.7594 29.25 38.5 32.9906 38.5 37.6078C38.5 38.3766 37.8766 39 37.1078 39H18.8922C18.1234 39 17.5 38.3766 17.5 37.6078Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    case 1: // 24/7 Travel Support (ctwc2.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="56" height="56" rx="28" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #D4AF37)" strokeOpacity="0.2"/>
          <path d="M28 17.25C22.6141 17.25 18.25 21.6141 18.25 27V28.875C18.25 29.4984 17.7484 30 17.125 30C16.5016 30 16 29.4984 16 28.875V27C16 20.3719 21.3719 15 28 15C34.6281 15 40 20.3719 40 27V33.7547C40 36.0328 38.1531 37.8797 35.8703 37.8797L30.7 37.875C30.3109 38.5453 29.5844 39 28.75 39H27.25C26.0078 39 25 37.9922 25 36.75C25 35.5078 26.0078 34.5 27.25 34.5H28.75C29.5844 34.5 30.3109 34.9547 30.7 35.625L35.875 35.6297C36.9109 35.6297 37.75 34.7906 37.75 33.7547V27C37.75 21.6141 33.3859 17.25 28 17.25ZM22.75 24.75H23.5C24.3297 24.75 25 25.4203 25 26.25V31.5C25 32.3297 24.3297 33 23.5 33H22.75C21.0953 33 19.75 31.6547 19.75 30V27.75C19.75 26.0953 21.0953 24.75 22.75 24.75ZM33.25 24.75C34.9047 24.75 36.25 26.0953 36.25 27.75V30C36.25 31.6547 34.9047 33 33.25 33H32.5C31.6703 33 31 32.3297 31 31.5V26.25C31 25.4203 31.6703 24.75 32.5 24.75H33.25Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    case 2: // No Hidden Costs (ctwc3.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="56" height="56" rx="28" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #D4AF37)" strokeOpacity="0.2"/>
          <path d="M28 15C28.2156 15 28.4313 15.0469 28.6281 15.1359L37.4547 18.8812C38.486 19.3172 39.2547 20.3344 39.25 21.5625C39.2266 26.2125 37.3141 34.7203 29.2375 38.5875C28.4547 38.9625 27.5453 38.9625 26.7625 38.5875C18.686 34.7203 16.7735 26.2125 16.75 21.5625C16.7453 20.3344 17.5141 19.3172 18.5453 18.8812L27.3766 15.1359C27.5688 15.0469 27.7844 15 28 15ZM28 18.1312V35.85C34.4688 32.7188 36.2078 25.7859 36.25 21.6281L28 18.1312Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    case 3: // Trusted by Travellers (ctwc4.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #F1EAD3)"/>
          <path d="M29.3538 15.8438C29.1054 15.3281 28.5804 15 28.0038 15C27.4273 15 26.9069 15.3281 26.6538 15.8438L23.6398 22.0453L16.9085 23.0391C16.346 23.1234 15.8773 23.5172 15.7038 24.0562C15.5304 24.5953 15.671 25.1906 16.0741 25.5891L20.9585 30.4219L19.8054 37.2516C19.7116 37.8141 19.946 38.3859 20.4101 38.7188C20.8741 39.0516 21.4882 39.0938 21.9944 38.8266L28.0085 35.6156L34.0226 38.8266C34.5288 39.0938 35.1429 39.0562 35.6069 38.7188C36.071 38.3813 36.3054 37.8141 36.2116 37.2516L35.0538 30.4219L39.9382 25.5891C40.3413 25.1906 40.4866 24.5953 40.3085 24.0562C40.1304 23.5172 39.6663 23.1234 39.1038 23.0391L32.3679 22.0453L29.3538 15.8438Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    case 4: // 100% Financial Protection (ctwc5.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="56" height="56" rx="28" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #D4AF37)" strokeOpacity="0.2"/>
          <path d="M33.25 19.5V19.5328C33.0016 19.5141 32.7531 19.5 32.5 19.5H26.5C25.7266 19.5 24.9766 19.5984 24.2594 19.7812C24.2547 19.6875 24.25 19.5938 24.25 19.5C24.25 17.0156 26.2656 15 28.75 15C31.2344 15 33.25 17.0156 33.25 19.5ZM32.5 21C32.6641 21 32.8281 21.0047 32.9875 21.0141C33.1844 21.0281 33.3813 21.0469 33.5781 21.075C34.4031 20.1141 35.6313 19.5 37 19.5H37.5391C38.0266 19.5 38.3828 19.9594 38.2656 20.4328L37.6187 23.0203C38.3594 23.7141 38.9641 24.5578 39.3766 25.5H40C40.8297 25.5 41.5 26.1703 41.5 27V31.5C41.5 32.3297 40.8297 33 40 33H38.5C38.0734 33.5672 37.5672 34.0734 37 34.5V37.5C37 38.3297 36.3297 39 35.5 39H34C33.1703 39 32.5 38.3297 32.5 37.5V36H26.5V37.5C26.5 38.3297 25.8297 39 25 39H23.5C22.6703 39 22 38.3297 22 37.5V34.5C20.3641 33.2719 19.2484 31.3922 19.0375 29.25H17.6875C15.925 29.25 14.5 27.825 14.5 26.0625C 15.925 22.875 17.6875 22.875H17.875C18.4984 22.875 19 23.3766 19 24C 18.4984 25.125 17.875 25.125H17.6875C17.1719 25.125 16.75 25.5469 16.75 26.0625C 17.1719 27 17.6875 27H19.15C19.7172 24.1969 21.8547 21.9609 24.6016 21.2438C25.2063 21.0844 25.8438 21 26.5 21H32.5ZM35.5 27.375C35.5 26.7541 34.9959 26.25 34.375 26.25C33.7541 26.25 33.25 26.7541 33.25 27.375C33.25 27.9959 33.7541 28.5 34.375 28.5C34.9959 28.5 35.5 27.9959 35.5 27.375Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    case 5: // UK Travel Specialists (twc3.svg)
      return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="56" height="56" rx="28" fill="#F8F9FA"/>
          <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="var(--country-primary, #D4AF37)" strokeOpacity="0.2"/>
          <path d="M33.625 20.625C33.625 23.1844 30.1984 27.7453 28.6938 29.625C28.3328 30.075 27.6625 30.075 27.3062 29.625C25.8016 27.7453 22.375 23.1844 22.375 20.625C22.375 17.5172 24.8922 15 28 15C31.1078 15 33.625 17.5172 33.625 20.625ZM34 24.3938C34.1641 24.0703 34.3141 23.7469 34.45 23.4281C34.4734 23.3719 34.4969 23.3109 34.5203 23.2547L39.9578 21.0797C40.6984 20.7844 41.5 21.3281 41.5 22.125V34.8188C41.5 35.2781 41.2188 35.6906 40.7922 35.8641L34 38.5781V24.3938ZM20.95 21.4828C21.0625 22.1437 21.2875 22.8094 21.55 23.4281C21.6859 23.7469 21.8359 24.0703 22 24.3938V36.1781L16.0422 38.5641C15.3016 38.8594 14.5 38.3156 14.5 37.5187V24.825C14.5 24.3656 14.7812 23.9531 15.2078 23.7797L20.9547 21.4828H20.95ZM29.8656 30.5625C30.5172 29.7469 31.5391 28.4203 32.5 26.9531V38.6391L23.5 36.0656V26.9531C24.4609 28.4203 25.4828 29.7469 26.1344 30.5625C27.0953 31.7625 28.9047 31.7625 29.8656 30.5625ZM28 22.125C29.0348 22.125 29.875 21.2848 29.875 20.25C29.875 19.2152 29.0348 18.375 28 18.375C26.9652 18.375 26.125 19.2152 26.125 20.25C26.125 21.2848 26.9652 22.125 28 22.125Z" fill="var(--country-primary, #D4AF37)"/>
        </svg>
      );
    default:
      return null;
  }
};

export const IndiaTravelWithConfidence: React.FC = () => {
  const items: ConfidenceItem[] = [
    {
      title: 'ATOL Protected',
    },
    {
      title: '24/7 Travel Support',
    },
    {
      title: 'No Hidden Costs',
    },
    {
      title: 'Trusted by Travellers',
    },
    {
      title: '100% Financial Protection',
    },
    {
      title: 'UK Travel Specialists',
    },
  ];

  return (
    <section className="bg-[#FAF8F6] py-12 sm:py-14 border-t border-slate-100 font-poppins">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-[#111827] text-[28px] sm:text-[32px] font-semibold tracking-tight">
            Travel with Confidence
          </h2>
          <p className="text-[#6B7280] text-[14px] font-light mt-1.5">
            Everything you need for a worry-free journey
          </p>
        </div>

        {/* 6 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100/80 hover:shadow-[0_8px_25px_rgba(0,0,0,0.035)] transition-all duration-300 group"
            >
              {/* Icon Container */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                <ConfidenceIcon index={idx} className="w-full h-full object-contain" />
              </div>

              {/* Title */}
              <h4 className="text-[#111827] font-medium text-xs sm:text-[18px] leading-tight">
                {item.title}
              </h4>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
