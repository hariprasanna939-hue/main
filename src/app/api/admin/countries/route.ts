import { CountryController } from '@/controllers/admin/country.controller';

export async function GET() {
  return CountryController.getCountries();
}

export async function POST(req: Request) {
  return CountryController.createCountry(req);
}
