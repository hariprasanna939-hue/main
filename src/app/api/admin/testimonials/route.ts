import { TestimonialController } from '@/controllers/admin/testimonial.controller';

export async function GET(req: Request) {
  return TestimonialController.getTestimonials(req);
}

export async function POST(req: Request) {
  return TestimonialController.createTestimonial(req);
}
