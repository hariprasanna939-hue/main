'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  itineraries: any[];
}

function getBezierPoints(
  start: [number, number],
  end: [number, number],
  factor: number = 0.15
): [number, number][] {
  const [lat0, lng0] = start;
  const [lat1, lng1] = end;

  const mLat = (lat0 + lat1) / 2;
  const mLng = (lng0 + lng1) / 2;

  const dLat = lat1 - lat0;
  const dLng = lng1 - lng0;

  const cLat = mLat - dLng * factor;
  const cLng = mLng + dLat * factor;

  const points: [number, number][] = [];
  const steps = 30;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const lat = mt * mt * lat0 + 2 * mt * t * cLat + t * t * lat1;
    const lng = mt * mt * lng0 + 2 * mt * t * cLng + t * t * lng1;
    points.push([lat, lng]);
  }

  return points;
}

export default function InteractiveMap({ itineraries }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const linesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create the map centered around the Golden Triangle region
    const map = L.map(mapContainerRef.current, {
      center: [27.0, 78.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Use clean light-styled maps tiles without default city labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old overlays
    markersRef.current.forEach(m => m.remove());
    linesRef.current.forEach(l => l.remove());
    markersRef.current = [];
    linesRef.current = [];

    // Red custom pin using div icon with pin.svg
    const redPinIcon = L.divIcon({
      className: 'custom-pin-red',
      html: `
        <div class="relative flex flex-col items-center justify-center" style="width: 24px; height: 32px;">
          <img src="/images/plans/pin.svg" class="w-6 h-8 relative z-10" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.15));" />
          <span class="absolute rounded-full bg-red-500 animate-ping opacity-25" style="width: 14px; height: 14px; left: 50%; bottom: 0; transform: translate(-50%, 50%); z-index: 1;"></span>
        </div>
      `,
      iconSize: [24, 32],
      iconAnchor: [12, 32]
    });

    // Gold custom pin using div icon with pin.svg and gold filter
    const goldPinIcon = L.divIcon({
      className: 'custom-pin-gold',
      html: `
        <div class="relative flex flex-col items-center justify-center" style="width: 24px; height: 32px;">
          <img src="/images/plans/pin.svg" class="w-6 h-8 relative z-10" style="filter: brightness(0) saturate(100%) invert(68%) sepia(54%) saturate(1450%) hue-rotate(355deg) brightness(98%) contrast(93%) drop-shadow(0px 2px 4px rgba(0,0,0,0.15));" />
          <span class="absolute rounded-full bg-[#EAA923] animate-ping opacity-25" style="width: 14px; height: 14px; left: 50%; bottom: 0; transform: translate(-50%, 50%); z-index: 1;"></span>
        </div>
      `,
      iconSize: [24, 32],
      iconAnchor: [12, 32]
    });

    const allLocations = (itineraries || [])
      .filter((it: any) => it.lat != null && it.lng != null)
      .map((it: any) => ({
        coords: [Number(it.lat), Number(it.lng)] as [number, number],
        label: it.city || it.title,
        isExtension: !!it.isExtension
      }));

    const routePoints: typeof allLocations = [];
    allLocations.forEach((loc) => {
      const last = routePoints[routePoints.length - 1];
      // Only add if it's not consecutive duplicate coordinates
      if (!last || last.coords[0] !== loc.coords[0] || last.coords[1] !== loc.coords[1]) {
        routePoints.push(loc);
      }
    });

    // Add marker instances
    routePoints.forEach(loc => {
      const isGold = loc.isExtension;
      const marker = L.marker(loc.coords, {
        icon: isGold ? goldPinIcon : redPinIcon
      }).addTo(map);

      // Tooltip positioning
      marker.bindTooltip(
        `<span class="px-2 py-0.5 rounded border shadow-sm font-semibold text-[10px] bg-white/95 text-slate-800 border-slate-100 whitespace-nowrap ${
          isGold ? 'text-[#EAA923] border-[#EAA923]/30' : ''
        }">${loc.label}</span>`,
        {
          permanent: true,
          direction: 'right',
          offset: [6, -16],
          className: 'leaflet-custom-tooltip'
        }
      );

      markersRef.current.push(marker);
    });

    // Add curved polyline connections
    for (let i = 0; i < routePoints.length - 1; i++) {
      const start = routePoints[i];
      const end = routePoints[i + 1];
      const factor = (i % 2 === 0) ? 0.15 : -0.15; // alternate curve direction
      const coords = getBezierPoints(start.coords, end.coords, factor);
      
      const isGold = end.isExtension;
      const line = L.polyline(coords, {
        color: isGold ? '#EAA923' : '#475569',
        weight: 2,
        dashArray: isGold ? '5, 3' : '6, 4',
        lineCap: 'round'
      }).addTo(map);
      linesRef.current.push(line);
    }

    // Adjust zoom dynamically
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.18));
    }
  }, [itineraries]);

  return (
    <div className="w-full h-full relative rounded-[10px] overflow-hidden border border-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10 bg-[#FAF8F6]" />
      
      <style jsx global>{`
        .leaflet-custom-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-custom-tooltip::before {
          display: none !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
