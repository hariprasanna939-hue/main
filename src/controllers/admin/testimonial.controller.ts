import { NextResponse } from 'next/server';
import { getTestimonials, getTestimonialsPaginated, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialActive } from '@/services/admin/testimonial.service';
import { revalidatePath } from 'next/cache';

export class TestimonialController {
  static async getTestimonials(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = (searchParams.get('status') || 'ALL') as 'ALL' | 'ACTIVE' | 'INACTIVE';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const result = await getTestimonialsPaginated({
      search,
      status,
      limit,
      page
    });
    return NextResponse.json(result);
  }

  static async getTestimonial(id: string) {
    const testimonial = await getTestimonial(id);
    if (!testimonial) return new NextResponse('Not Found', { status: 404 });
    return NextResponse.json(testimonial);
  }

  static async createTestimonial(req: Request) {
    const data = await req.json();
    const newTestimonial = await createTestimonial(data);
    revalidatePath('/admin/testimonials');
    return NextResponse.json(newTestimonial);
  }

  static async updateTestimonial(req: Request, id: string) {
    const data = await req.json();
    const updated = await updateTestimonial(id, data);
    revalidatePath('/admin/testimonials');
    return NextResponse.json(updated);
  }

  static async deleteTestimonial(id: string) {
    await deleteTestimonial(id);
    revalidatePath('/admin/testimonials');
    return NextResponse.json({ success: true });
  }

  static async toggleActive(req: Request, id: string) {
    const { isActive } = await req.json();
    const updated = await toggleTestimonialActive(id, isActive);
    revalidatePath('/admin/testimonials');
    return NextResponse.json(updated);
  }
}
