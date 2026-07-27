import { NextResponse } from 'next/server';
import { getCountries, getCountry, createCountry, updateCountry, deleteCountry, toggleCountryActive, getImages } from '@/services/admin/country.service';
import { revalidatePath } from 'next/cache';

export class CountryController {
  static async getCountries() {
    const countries = await getCountries();
    return NextResponse.json(countries);
  }

  static async createCountry(req: Request) {
    const data = await req.json();
    const newCountry = await createCountry(data);
    revalidatePath('/admin/countries');
    return NextResponse.json(newCountry);
  }

  static async getCountry(id: string) {
    const country = await getCountry(id);
    if (!country) return new NextResponse('Not Found', { status: 404 });
    return NextResponse.json(country);
  }

  static async updateCountry(req: Request, id: string) {
    const data = await req.json();
    const updatedCountry = await updateCountry(id, data);
    revalidatePath('/admin/countries');
    return NextResponse.json(updatedCountry);
  }

  static async deleteCountry(id: string) {
    await deleteCountry(id);
    revalidatePath('/admin/countries');
    return NextResponse.json({ success: true });
  }

  static async toggleActive(req: Request, id: string) {
    const { isActive } = await req.json();
    const updatedCountry = await toggleCountryActive(id, isActive);
    revalidatePath('/admin/countries');
    return NextResponse.json(updatedCountry);
  }

  static async getImages() {
    const images = await getImages();
    return NextResponse.json(images);
  }
}
