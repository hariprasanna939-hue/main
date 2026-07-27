import Image from 'next/image';
import { GoodToKnow, BestSeason, Image as PrismaImage } from '@prisma/client';

type GoodToKnowItem = GoodToKnow & { image: PrismaImage };

export default function GoodToKnowSection({ 
  items, 
  bestSeasons 
}: { 
  items: GoodToKnowItem[];
  bestSeasons: BestSeason[];
}) {
  return (
    <div className="space-y-12">
      
      {/* Best Seasons Info */}
      {bestSeasons.length > 0 && (
        <div className="bg-[var(--pkg-secondary)]/30 border border-[var(--pkg-secondary)] p-6 rounded-2xl flex items-start gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-[var(--pkg-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-900 mb-1">Best Time to Visit</h4>
            <p className="text-neutral-700">
              The ideal months for this package are:{' '}
              <span className="font-semibold text-[var(--pkg-primary)]">
                {bestSeasons.map(s => s.month.charAt(0) + s.month.slice(1).toLowerCase()).join(', ')}
              </span>.
            </p>
          </div>
        </div>
      )}

      {/* Info Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-20 h-20 shrink-0 relative rounded-full overflow-hidden shadow-sm border-2 border-[var(--pkg-secondary)]">
              <Image src={item.image.url} alt={item.image.altText || item.title} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-neutral-900 mb-1">{item.title}</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
