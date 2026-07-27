import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-[#111111] m-0 block">
      <div className="flex flex-col lg:flex-row w-full mx-auto min-h-[400px]">

        {/* LEFT SIDE (Image Background) */}
        <div
          className="relative w-full lg:w-[35%] bg-cover bg-center p-10 md:p-14 flex flex-col justify-center min-h-[300px] lg:min-h-full"
          style={{ backgroundImage: "url('/IMAGE/footer/footer.png')" }}
        >
          {/* Title */}
          <div className="mb-6 mt-4">
            <img
              src="/logo/indsrilogo2.png"
              alt="India Sri Lanka Escapes"
              className="h-10 w-auto object-contain mb-2"
            />
          </div>

          {/* Description */}
          <p className="font-poppins text-[13.5px] leading-relaxed max-w-sm font-medium text-[#111111]">
            Established in 1980, Sunset Travel Ltd,<br />
            (ABTA 57032, ATOL 2886)<br />
            has been one of the pioneers in luxury<br />
            travel for over 35 years. This<br />
            is a family run organisation.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-8 mb-4">
            <Link href="#" className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </Link>
            <Link href="#" className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </Link>
            <Link href="#" className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" /></svg>
            </Link>
            <Link href="#" className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE (Links) */}
        <div className="w-full lg:w-[65%] p-10 md:p-14 flex flex-col sm:flex-row justify-between pt-16 font-sora">

          {/* Column 1 */}
          <div className="mb-10 sm:mb-0">
            <h3 className="font-semibold text-[18px] mb-6 text-black">Join Us</h3>
            <ul className="space-y-4 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-black transition-colors">Become A Travel Agent</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Already A Travel Agent?</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Limited Travel Experience</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="mb-10 sm:mb-0">
            <h3 className="font-semibold text-[18px] mb-6 text-black">Travel-pa</h3>
            <ul className="space-y-4 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Why Travel-pa</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Meet The Team</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-[18px] mb-6 text-black">Helpful Pages</h3>
            <ul className="space-y-4 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-black transition-colors">Download Our Brochure</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Inhouse Systems</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">FAQ's</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="w-full bg-[#FFC107] py-3 text-center">
        <p className="font-sora text-[13px] text-[#111111] font-medium tracking-wide">
          Copyright © 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
