import { NextResponse } from 'next/server';
import { getPackages, getPackage, createPackage, updatePackage, deletePackage, togglePackageStatus } from '@/services/admin/package.service';
import { revalidatePath } from 'next/cache';

export class PackageController {
  static async getPackages(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') as 'MAIN' | 'ADDON') || 'MAIN';
    const search = searchParams.get('search') || '';
    const status = (searchParams.get('status') as 'ALL' | 'ACTIVE' | 'INACTIVE') || 'ALL';
    const packageId = searchParams.get('packageId') || '';
    const countryId = searchParams.get('countryId') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const isPaginated = searchParams.get('paginated') === 'true';

    if (isPaginated) {
      const { getPackagesPaginated } = await import('@/services/admin/package.service');
      const result = await getPackagesPaginated({
        type,
        search,
        status,
        packageId,
        countryId,
        limit,
        page
      });
      return NextResponse.json(result);
    }

    const packages = await getPackages(type);
    return NextResponse.json(packages);
  }

  static async createPackage(req: Request) {
    try {
      const data = await req.json();
      const newPackage = await createPackage(data);
      revalidatePath('/admin/packages');
      revalidatePath('/admin/addons');
      return NextResponse.json(newPackage);
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 400 });
    }
  }

  static async getPackage(id: string) {
    const pkg = await getPackage(id);
    if (!pkg) return new NextResponse('Not Found', { status: 404 });
    return NextResponse.json(pkg);
  }

  static async updatePackage(req: Request, id: string) {
    try {
      const data = await req.json();
      console.log(`[updatePackage] ID: ${id} Data banner highlights:`, {
        bestTimeToTravel: data.bestTimeToTravel,
        weather: data.weather,
        travelTime: data.travelTime,
        tourDuration: data.tourDuration,
        tourStyle: data.tourStyle
      });
      console.log(`[updatePackage] ID: ${id} Data perfectFors:`, data.perfectFors);
      const updatedPackage = await updatePackage(id, data);
      revalidatePath('/admin/packages');
      revalidatePath('/admin/addons');
      return NextResponse.json(updatedPackage);
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 400 });
    }
  }

  static async deletePackage(id: string) {
    await deletePackage(id);
    revalidatePath('/admin/packages');
    revalidatePath('/admin/addons');
    return NextResponse.json({ success: true });
  }

  static async togglePackageStatus(req: Request, id: string) {
    try {
      const data = await req.json();
      const updatedPackage = await togglePackageStatus(id, data.isActive);
      revalidatePath('/admin/packages');
      revalidatePath('/admin/addons');
      return NextResponse.json(updatedPackage);
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 400 });
    }
  }
}
