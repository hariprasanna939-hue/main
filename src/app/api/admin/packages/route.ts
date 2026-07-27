import { PackageController } from '@/controllers/admin/package.controller';

export async function GET(req: Request) {
  return PackageController.getPackages(req);
}

export async function POST(req: Request) {
  return PackageController.createPackage(req);
}
