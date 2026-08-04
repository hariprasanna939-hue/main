import Image from 'next/image';
import { PackageGallery, Image as PrismaImage } from '@prisma/client';

type GalleryItem = PackageGallery & { image: PrismaImage };

export default function HeroGallery({ 
  gallery, 
  title, 
  subtitle 
}: { 
  gallery: GalleryItem[];
  title: string;
  subtitle: string | null;
}) {
  const coverImage = gallery.find(g => g.isCover)?.image || gallery[0]?.image;
  const otherImages = gallery.filter(g => g.image.id !== coverImage?.id).slice(0, 3);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex gap-2 p-2 bg-neutral-900">
      
      {/* Main Cover Image */}
      <div className="relative flex-1 h-full rounded-2xl overflow-hidden group">
        {coverImage && (
          <Image 
            src={coverImage.url} 
            alt={coverImage.altText || title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-md">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-2xl text-neutral-200 max-w-2xl font-light drop-shadow">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Side Gallery (Desktop Only) */}
      {otherImages.length > 0 && (
        <div className="hidden lg:flex flex-col w-[30%] gap-2">
          {otherImages.map((item, idx) => (
            <div key={item.id} className="relative flex-1 rounded-2xl overflow-hidden group">
              <Image 
                src={item.image.url} 
                alt={item.image.altText || 'Gallery image'} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
