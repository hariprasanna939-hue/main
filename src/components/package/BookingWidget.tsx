'use client';

import React, { useState, useMemo } from 'react';
import { Package, PricePackage, DepartureDate, PackageAddon } from '@prisma/client';

export type SerializedPricePackage = Omit<PricePackage, 'price'> & { price: number };

type BookingWidgetProps = {
  pkg: Package;
  pricePackages: SerializedPricePackage[];
  departureDates: DepartureDate[];
  addons: any[]; // Extended type from Prisma include
};

export default function BookingWidget({ pkg, pricePackages, departureDates, addons }: BookingWidgetProps) {
  const defaultPricePkg = pricePackages.find(p => p.isDefault) || pricePackages[0];
  
  const [selectedPriceId, setSelectedPriceId] = useState<string>(defaultPricePkg?.id || '');
  const [selectedDateId, setSelectedDateId] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  const selectedPrice = pricePackages.find(p => p.id === selectedPriceId);
  const selectedDate = departureDates.find(d => d.id === selectedDateId);

  // Calculate Return Date automatically
  const returnDate = useMemo(() => {
    if (!selectedDate) return null;
    const d = new Date(selectedDate.departureDate);
    d.setDate(d.getDate() + pkg.durationDays);
    return d;
  }, [selectedDate, pkg.durationDays]);

  // Calculate Total Price
  const totalPrice = useMemo(() => {
    let total = Number(selectedPrice?.price || 0);
    addons.forEach(addon => {
      if (selectedAddons[addon.addonPackageId]) {
        // Assuming the addon has a default price package
        const addonPrice = addon.addonPackage.pricePackages.find((p: any) => p.isDefault)?.price || 0;
        total += Number(addonPrice);
      }
    });
    return total;
  }, [selectedPrice, selectedAddons, addons]);

  const currencySymbol = pkg.currency === 'USD' ? '$' : pkg.currency === 'EUR' ? '€' : '₹';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 flex flex-col gap-8">
      
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-[var(--pkg-primary)] uppercase tracking-wider mb-1">
          {pkg.durationDays} Days / {pkg.durationNights} Nights
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-neutral-900">{currencySymbol}{totalPrice.toLocaleString()}</span>
          <span className="text-neutral-500">per person</span>
        </div>
      </div>

      {/* Select Price Package */}
      {pricePackages.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wide">1. Select Package Tier</h4>
          <div className="space-y-3">
            {pricePackages.map(p => (
              <label 
                key={p.id} 
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedPriceId === p.id 
                    ? 'border-[var(--pkg-primary)] bg-[var(--pkg-secondary)]/10 ring-1 ring-[var(--pkg-primary)]' 
                    : 'border-neutral-200 hover:border-[var(--pkg-primary)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="pricePackage" 
                      value={p.id} 
                      checked={selectedPriceId === p.id}
                      onChange={() => setSelectedPriceId(p.id)}
                      className="w-4 h-4 text-[var(--pkg-primary)] border-neutral-300 focus:ring-[var(--pkg-primary)]"
                    />
                    <span className="font-bold text-neutral-900">{p.title}</span>
                  </div>
                  <span className="font-semibold text-neutral-900">+{currencySymbol}{Number(p.price).toLocaleString()}</span>
                </div>
                {p.subtitle && <p className="text-sm text-neutral-500 mt-1 ml-6">{p.subtitle}</p>}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Select Departure Date */}
      <div>
        <h4 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wide">2. Select Departure Date</h4>
        {departureDates.length === 0 ? (
          <p className="text-sm text-red-500">No upcoming departures available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {departureDates.map(d => {
              const dateObj = new Date(d.departureDate);
              const isSelected = selectedDateId === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDateId(d.id)}
                  className={`p-3 border rounded-xl text-center transition-all ${
                    isSelected 
                      ? 'border-[var(--pkg-primary)] bg-[var(--pkg-primary)] text-white shadow-md' 
                      : 'border-neutral-200 hover:border-[var(--pkg-primary)] text-neutral-700 bg-white'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                    {dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="text-xl font-bold">
                    {dateObj.getDate()}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Auto-calculated Return Date */}
        {returnDate && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex justify-between items-center text-sm">
            <span className="text-neutral-500 font-medium">Return Date:</span>
            <span className="font-bold text-neutral-900">
              {returnDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Add-ons */}
      {addons.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wide">3. Add-ons (Optional)</h4>
          <div className="space-y-2">
            {addons.map(addon => {
              const addonPkg = addon.addonPackage;
              const price = addonPkg.pricePackages.find((p: any) => p.isDefault)?.price || 0;
              return (
                <label key={addon.id} className="flex items-start gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={!!selectedAddons[addonPkg.id]}
                    onChange={(e) => setSelectedAddons(prev => ({ ...prev, [addonPkg.id]: e.target.checked }))}
                    className="mt-1 w-4 h-4 rounded text-[var(--pkg-primary)] border-neutral-300 focus:ring-[var(--pkg-primary)]"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neutral-900 text-sm">{addonPkg.title}</span>
                      <span className="font-semibold text-neutral-700 text-sm">+{currencySymbol}{Number(price).toLocaleString()}</span>
                    </div>
                    {addonPkg.durationDays && (
                      <p className="text-xs text-[var(--pkg-primary)] font-semibold mt-0.5">+{addonPkg.durationDays} Days</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button 
        disabled={!selectedDateId || !selectedPriceId}
        className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{ backgroundColor: 'var(--pkg-primary)' }}
      >
        Book Now
      </button>

    </div>
  );
}
