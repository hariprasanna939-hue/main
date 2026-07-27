'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHeroPage = pathname === '/' || pathname === '/package' || pathname === '/india' || pathname.startsWith('/package/');

  useEffect(() => {
    if (!isHeroPage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isHeroPage]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      (isScrolled && !isOpen)
        ? 'bg-white/95 border-b border-slate-100 shadow-sm py-4' 
        : 'bg-transparent py-8'
    }`}>
      <div className="w-full px-5 md:px-8">
        <div className="flex justify-between items-center relative z-50">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center select-none group" onClick={() => setIsOpen(false)}>
              <img
                src={(isScrolled && !isOpen) ? '/logo/indsrilogo1.png' : '/logo/indsrilogo.png'}
                alt="India Sri Lanka Escapes"
                className="h-8 md:h-11 w-auto object-contain transition-all duration-300"
              />
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium items-center pt-2">
            <Link 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className={`${
                isScrolled 
                  ? 'text-slate-600 hover:text-[#ebb337]' 
                  : 'text-white/80 hover:text-[#ebb337]'
              } transition-colors duration-200`}
            >
              Destinations
            </Link>
            <Link 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className={`${
                isScrolled 
                  ? 'text-slate-600 hover:text-[#ebb337]' 
                  : 'text-white/80 hover:text-[#ebb337]'
              } transition-colors duration-200`}
            >
              Experiences
            </Link>
            <Link 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className={`${
                isScrolled 
                  ? 'text-slate-600 hover:text-[#ebb337]' 
                  : 'text-white/80 hover:text-[#ebb337]'
              } transition-colors duration-200`}
            >
              About
            </Link>
            <Link 
              href="/package" 
              className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${
                isScrolled 
                  ? 'border-slate-300 text-slate-700 hover:border-[#ebb337] hover:bg-[#ebb337] hover:text-black' 
                  : 'border-white/40 text-white hover:border-[#ebb337] hover:bg-[#ebb337] hover:text-black'
              }`}
            >
              Book now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className={`md:hidden pt-1 relative z-50 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
            <button
              onClick={() => setIsOpen(true)}
              className={`p-2 -mr-2 rounded-md transition-colors ${
                isScrolled
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } focus:outline-none cursor-pointer`}
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-slate-950 z-50 flex flex-col justify-center items-center shadow-2xl transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-5 p-2 text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer"
        >
          <X className="h-8 w-8" />
        </button>

        <div className="flex flex-col items-center space-y-8 w-full px-8">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="text-white text-3xl font-cormorant tracking-widest uppercase hover:text-[#ebb337] transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="text-white text-3xl font-cormorant tracking-widest uppercase hover:text-[#ebb337] transition-colors"
          >
            Experiences
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="text-white text-3xl font-cormorant tracking-widest uppercase hover:text-[#ebb337] transition-colors"
          >
            About
          </Link>
          
          <div className="pt-8 w-full max-w-[200px]">
            <Link
              href="/package"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center py-4 border border-[#ebb337] rounded-full text-sm font-bold uppercase tracking-wider text-[#ebb337] hover:bg-[#ebb337] hover:text-black transition-all duration-300"
            >
              Book now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
