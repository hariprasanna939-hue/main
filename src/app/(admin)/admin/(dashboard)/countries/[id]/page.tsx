import React from 'react';
import { getCountry, getImages } from '@/services/admin/country.service';
import CountryEditor from '@/components/admin/countries/CountryEditor';
import { notFound } from 'next/navigation';

export default async function AdminCountryEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // If id is 'new', we are creating a new country
  const isNew = id === 'new';
  
  const [country, images] = await Promise.all([
    isNew ? null : getCountry(id),
    getImages()
  ]);

  if (!isNew && !country) {
    notFound();
  }

  return <CountryEditor country={country} images={images} />;
}
