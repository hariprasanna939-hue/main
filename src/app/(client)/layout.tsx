'use client';

import React from 'react';
import { Navbar } from '@/components/client/Navbar';
import { Footer } from '@/components/client/Footer';
import { AboveFooterSection } from '@/components/client/AboveFooterSection';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingRoute = pathname === '/landing';
  const hideFooter = pathname === '/' || pathname === '/landing';
  
  // Detect package details route (e.g. /package/india/golden-triangle)
  const isPackageDetails = pathname.startsWith('/package/') && pathname.split('/').filter(Boolean).length === 3;
  // Detect country route (e.g. /india)
  const isCountryPage = pathname.split('/').filter(Boolean).length === 1 && pathname !== '/' && pathname !== '/landing';

  return (
    <div className="flex flex-col min-h-screen">
      {!isLandingRoute && <Navbar />}
      <main className="flex-grow m-0 p-0">{children}</main>
      {!hideFooter && !isPackageDetails && !isCountryPage && <AboveFooterSection />}
      {!hideFooter && <Footer />}
    </div>
  );
}
