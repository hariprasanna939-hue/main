import React from 'react';
import TestimonialsClient from '@/components/admin/testimonials/TestimonialsClient';
import { getTestimonialsPaginated } from '@/services/admin/testimonial.service';

export default async function AdminTestimonialsPage() {
  const data = await getTestimonialsPaginated({ page: 1, limit: 10 });
  return (
    <TestimonialsClient
      initialTestimonials={data.items}
      initialTotal={data.total}
    />
  );
}
