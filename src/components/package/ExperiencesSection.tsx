import Image from 'next/image';
import { Experience, Image as PrismaImage } from '@prisma/client';

type ExperienceItem = Experience & { imageOne: PrismaImage | null };

export default function ExperiencesSection({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <div className="space-y-16">
      {experiences.map((exp, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div key={exp.id} className={`flex flex-col gap-8 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
            
            {/* Image */}
            <div className="w-full lg:w-1/2 h-[350px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg mt-4 lg:mt-0">
                {exp.imageOne && (
                  <Image src={exp.imageOne.url} alt={exp.imageOne.altText || exp.title} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 lg:px-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">{exp.title}</h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {exp.description}
              </p>
            </div>

          </div>
        );
      })}
    </div>
  );
}
