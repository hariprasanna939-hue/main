import React from 'react';
import { getPackage, getCountriesForDropdown as getCountries } from '@/services/admin/package.service';
import PackageEditor from '@/components/admin/package/PackageEditor';
import { notFound } from 'next/navigation';

export default async function AdminPackageEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // If id is 'new', we are creating a new package
  const isNew = id === 'new';
  
  const [pkg, countries] = await Promise.all([
    isNew ? null : getPackage(id),
    getCountries()
  ]);

  if (!isNew && !pkg) {
    notFound();
  }

  // Ensure type validation if necessary, but editor can handle it
  // if pkg exists, make sure it's a MAIN package
  if (pkg && pkg.type !== 'MAIN') {
    notFound();
  }

  return <PackageEditor pkg={pkg} countries={countries} type="MAIN" />;
}
