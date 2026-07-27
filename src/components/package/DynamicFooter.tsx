import Image from 'next/image';
import { Image as PrismaImage } from '@prisma/client';

export default function DynamicFooter({ 
  title, 
  image 
}: { 
  title: string | null;
  image: PrismaImage | null;
}) {
  if (!image) return null;

  return (
    <footer className="relative w-full h-[400px] mt-24 flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image 
        src={image.url} 
        alt={image.altText || 'Footer background'} 
        fill 
        className="object-cover" 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[var(--pkg-primary)]/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight drop-shadow-md">
          {title || 'Ready to start your journey?'}
        </h2>
        <button className="px-8 py-4 bg-white text-[var(--pkg-primary)] font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform">
          Contact an Expert
        </button>
      </div>

    </footer>
  );
}
