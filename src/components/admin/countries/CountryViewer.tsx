'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CountryViewer({
  country
}: {
  country: any;
}) {
  const router = useRouter();

  if (!country) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{country.name}</h1>
          <p className="text-neutral-500 mt-1">Country Details</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/admin/countries/${country.id}`)}>
            Edit Country
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/countries')}>
            Back to List
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {country.image && (
            <div className="w-full h-64 relative rounded-md overflow-hidden">
              <img src={country.image.url} alt={country.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Name</h3>
              <p className="text-lg font-medium">{country.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Title</h3>
              <p className="text-lg font-medium">{country.title || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-500">Description</h3>
            <p className="whitespace-pre-wrap">{country.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Sort Order</h3>
              <p>{country.sortOrder}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Status</h3>
              <p>{country.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
