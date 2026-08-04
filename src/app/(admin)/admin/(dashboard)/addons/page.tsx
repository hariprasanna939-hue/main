import React from 'react';
import { getPackages, getCountriesForDropdown as getCountries } from '@/services/admin/package.service';
import AddonsClient from '@/components/admin/addons/AddonsClient';

export default async function AdminToursPage() {
  const [addons, mainPackages, countries] = await Promise.all([
    getPackages('ADDON'),
    getPackages('MAIN'),
    getCountries()
  ]);

  return (
    <AddonsClient
      initialPackages={addons}
      mainPackages={mainPackages}
      countries={countries}
    />
  );
}
