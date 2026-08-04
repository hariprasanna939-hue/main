import Image from 'next/image';
import { Itinerary, Image as PrismaImage } from '@prisma/client';

type ItineraryItem = Itinerary & { image?: PrismaImage | null };

export default function ItineraryTimeline({ itineraries }: { itineraries: ItineraryItem[] }) {
  return (
    <div className="relative border-l-2 border-[var(--pkg-secondary)] ml-3 md:ml-6 space-y-12 pb-8">
      {itineraries.map((day, idx) => (
        <div key={day.id} className="relative pl-8 md:pl-12">
          
          {/* Timeline Dot */}
          <div className="absolute w-6 h-6 bg-white border-4 border-[var(--pkg-primary)] rounded-full -left-[13px] top-1" />
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <span className="text-sm font-semibold tracking-wider uppercase text-[var(--pkg-primary)]">
                Day {day.dayNumber}
              </span>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{day.title}</h3>
              {day.subtitle && (
                <p className="text-lg text-neutral-500 font-medium mt-1">{day.subtitle}</p>
              )}
              <p className="mt-4 text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {day.description}
              </p>
            </div>
            
            {day.image && (
              <div className="w-full md:w-[280px] h-[200px] shrink-0 relative rounded-xl overflow-hidden shadow-sm">
                <Image 
                  src={day.image.url} 
                  alt={day.image.altText || day.title} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
