'use client';

import React, { useEffect, useState } from 'react';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'good-to-know', label: 'Good to Know' },
];

export default function PackageNavigation() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && window.scrollY >= (el.offsetTop - 150)) {
          current = item.id;
        }
      }
      if (current) setActive(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-medium whitespace-nowrap transition-colors border-b-2 pb-1 ${
                active === item.id 
                  ? 'border-[var(--pkg-primary)] text-[var(--pkg-primary)]' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
