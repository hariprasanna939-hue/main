import React from 'react';
import CountriesClient from '@/components/admin/countries/CountriesClient';
import { getCountries, getImages } from '@/services/admin/country.service';

export default async function AdminCountriesPage() {
  const [countries, images] = await Promise.all([
    getCountries(),
    getImages()
  ]);

  return <CountriesClient initialCountries={countries} images={images} />;
}
