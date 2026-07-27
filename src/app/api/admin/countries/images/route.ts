import { CountryController } from '@/controllers/admin/country.controller';

export async function GET() {
  return CountryController.getImages();
}
