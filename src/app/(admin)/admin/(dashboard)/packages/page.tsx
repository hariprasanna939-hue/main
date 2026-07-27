import React from 'react';
import PackagesClient from '@/components/admin/package/PackagesClient';
import { getPackages, getCountriesForDropdown as getCountries } from '@/services/admin/package.service';

export default async function AdminToursPage() {
  const [packages, countries] = await Promise.all([
    getPackages(),
    getCountries()
  ]);

  return <PackagesClient initialPackages={packages} countries={countries} />;
}
