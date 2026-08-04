'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, MapPin, Package as PackageIcon, CheckCircle, XCircle, Eye, Power } from 'lucide-react';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ViewButton, EditButton, ToggleButton } from '@/components/ui/action-buttons';
import Link from 'next/link';

type CountryItem = any;
type ImageItem = any;

export default function CountriesClient({
  initialCountries,
  images
}: {
  initialCountries: CountryItem[];
  images: ImageItem[];
}) {
  const [countries, setCountries] = useState<CountryItem[]>(initialCountries);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (confirm(`Are you sure you want to mark this country as ${newStatus ? 'Active' : 'Inactive'}?`)) {
      await fetch(`/api/admin/countries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus })
      });
      // Update local state for immediate feedback
      setCountries(countries.map(c => c.id === id ? { ...c, isActive: newStatus } : c));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Countries</h1>
          <p className="text-neutral-500 mt-1">Manage destinations and regions</p>
        </div>
        <Link href="/admin/countries/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Country
          </Button>
        </Link>
      </div>

      <TableContainer>
        {countries.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            No countries found. Add one above.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Country Name</TableHead>
                <TableHead>Packages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id}>
                  {/* Image */}
                  <TableCell>
                    <div className="w-16 h-10 relative bg-neutral-100 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                      {country.image ? (
                        <img src={country.image.url} alt={country.name} className="w-full h-full object-cover" />
                      ) : (
                        <MapPin className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                  </TableCell>

                  {/* Country Name & Title */}
                  <TableCell>
                    <div className="font-semibold text-slate-900">{country.name}</div>
                    {country.title && (
                      <div className="text-slate-400 text-xs mt-0.5">/{country.title}</div>
                    )}
                  </TableCell>

                  {/* Packages Count */}
                  <TableCell>
                    <div className="flex items-center text-slate-600 font-medium">
                      <PackageIcon className="w-4 h-4 mr-2 text-slate-400" />
                      {country._count?.packages || 0} {country._count?.packages === 1 ? 'Package' : 'Packages'}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      country.isActive 
                        ? 'bg-green-50 text-green-700 border border-green-200/40' 
                        : 'bg-red-50 text-red-700 border border-red-200/40'
                    }`}>
                      {country.isActive ? (
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                      )}
                      <span>{country.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-1.5">
                    <ViewButton href={`/admin/countries/${country.id}/view`} />
                    <EditButton href={`/admin/countries/${country.id}`} />
                    <ToggleButton 
                      isActive={country.isActive} 
                      onClick={() => handleToggleActive(country.id, country.isActive)} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
