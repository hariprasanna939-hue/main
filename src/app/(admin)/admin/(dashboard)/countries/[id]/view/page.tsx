import React from 'react';
import { getCountry } from '@/services/admin/country.service';
import CountryViewer from '@/components/admin/countries/CountryViewer';
import { notFound } from 'next/navigation';

export default async function AdminCountryViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  if (id === 'new') {
    notFound();
  }
  
  const country = await getCountry(id);

  if (!country) {
    notFound();
  }

  return <CountryViewer country={country} />;
}
