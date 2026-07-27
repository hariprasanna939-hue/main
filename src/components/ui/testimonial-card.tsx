import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle?: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-[24px] border border-[var(--pkg-primary,#CDA054)]/20",
        "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.015)]",
        "p-5 sm:p-7 text-start",
        "hover:shadow-md transition-all duration-300",
        "w-[280px] sm:w-[350px] shrink-0",
        className
      )}
    >
      {/* Author Info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] shrink-0">
          {author.avatar ? (
            <AvatarImage src={author.avatar} alt={author.name} className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold uppercase text-base sm:text-lg flex items-center justify-center w-full h-full">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-[17px] sm:text-[19px] font-semibold leading-tight text-[#0B2240] tracking-tight">
            {author.name}
          </h3>
        </div>
      </div>

      {/* Gold Divider Line */}
      <div className="h-[1.5px] w-[60%] bg-[var(--pkg-primary,#CDA054)] mt-4 mb-4 sm:mt-5 sm:mb-5 opacity-80" />

      {/* Testimonial Text */}
      <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#222B36] font-normal leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>
    </Card>
  )
}

