import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee"
import { prisma } from '@/lib/prisma';

export async function Testimonials() {
  const dbTestimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    include: { image: true },
    orderBy: { createdAt: 'desc' }
  });

  let displayTestimonials = dbTestimonials.map(t => ({
    author: {
      name: t.name,
      handle: "@" + t.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      avatar: t.image?.url || ""
    },
    text: t.content,
    href: "#"
  }));

  if (displayTestimonials.length === 0) {
    return null;
  }

  // If there are fewer than 3 testimonials, duplicate them to ensure smooth marquee looping without showing hardcoded default ones
  if (displayTestimonials.length < 3) {
    const original = [...displayTestimonials];
    while (displayTestimonials.length < 3) {
      displayTestimonials = [...displayTestimonials, ...original];
    }
  }

  return (
    <TestimonialsSection
      title="What Our Guests Say"
      description=""
      testimonials={displayTestimonials}
    />
  )
}
