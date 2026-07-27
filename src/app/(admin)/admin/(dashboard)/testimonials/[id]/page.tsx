import React from 'react';
import TestimonialEditor from '@/components/admin/testimonials/TestimonialEditor';
import { getTestimonial } from '@/services/admin/testimonial.service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);

  if (!testimonial) {
    notFound();
  }

  return <TestimonialEditor testimonial={testimonial} />;
}
