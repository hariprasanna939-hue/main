"use client"

import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  // Setup Embla with AutoScroll plugin for an infinite scrolling effect that can be dragged manually
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ playOnInit: true, speed: 0.8, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  // Duplicate testimonials enough times to ensure smooth looping
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className={cn(
      "bg-[#FAF8F6] text-gray-900 font-poppins relative",
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      {/* Title Header Wrapper */}
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 text-center sm:gap-16 mb-12 sm:mb-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] font-semibold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-[#1E2A3B] tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-md max-w-[600px] font-medium text-gray-500 sm:text-xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Full-Width Marquee Container */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden w-full py-4" ref={emblaRef}>
          <div className="flex w-full touch-pan-y cursor-grab active:cursor-grabbing items-stretch">
            {displayTestimonials.map((testimonial, i) => (
              <div key={i} className="flex-[0_0_auto] min-w-0 pl-4 sm:pl-6">
                <TestimonialCard {...testimonial} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
