import Image from 'next/image';
import { Hotel, Image as PrismaImage } from '@prisma/client';
import { Star } from 'lucide-react';

type HotelItem = Hotel & { image: PrismaImage };

export default function HotelsSlider({ hotels }: { hotels: HotelItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden group">
          <div className="relative h-60 w-full overflow-hidden">
            <Image 
              src={hotel.image.url} 
              alt={hotel.image.altText || hotel.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{hotel.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{hotel.title}</h3>
            <p className="text-neutral-600 line-clamp-3">
              {hotel.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
