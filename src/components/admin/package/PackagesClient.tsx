'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ViewButton, EditButton, ToggleButton } from '@/components/ui/action-buttons';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type PackageItem = any;
type CountryItem = { id: string; name: string };

export default function PackagesClient({
  initialPackages,
  countries
}: {  
  initialPackages: PackageItem[];
  countries: CountryItem[];
}) {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Pagination & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(initialPackages.length);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Packages from API
  const fetchPackages = async (
    currentPage: number,
    currentLimit: number,
    search: string,
    status: string,
    countryId: string
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'MAIN',
        paginated: 'true',
        page: currentPage.toString(),
        limit: currentLimit.toString(),
        search,
        status,
        countryId: countryId === 'ALL' ? '' : countryId
      });
      const res = await fetch(`/api/admin/packages?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPackages(page, limit, searchTerm, statusFilter, countryFilter);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [page, limit, searchTerm, statusFilter, countryFilter]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setPackages(packages.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
        showToast(`Package successfully ${currentStatus ? 'deactivated' : 'activated'}.`, 'success');
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.error || 'Failed to update package status.', 'error');
      }
    } catch (error) {
      showToast('Failed to update package status.', 'error');
    }
  };

  const getDefaultPrice = (pkg: PackageItem) => {
    const defaultOption = pkg.pricePackages?.find((p: any) => p.isDefault);
    if (defaultOption) return `₹${defaultOption.price.toLocaleString()}`;
    if (pkg.pricePackages && pkg.pricePackages.length > 0) {
      return `₹${pkg.pricePackages[0].price.toLocaleString()}`;
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Packages</h1>
          <p className="text-neutral-500 mt-1">Manage all your travel travel packages</p>
        </div>
        <Link href="/admin/packages/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        </Link>
      </div>

      {/* Filters UI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Search Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 font-medium text-slate-800"
          />
        </div>

        {/* Country Dropdown Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Country</label>
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 font-medium text-slate-800"
          >
            <option value="ALL">All Countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 font-medium text-slate-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      <TableContainer className="relative min-h-[150px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all">
            <div className="flex items-center gap-2 bg-white/95 px-4 py-2.5 rounded-full shadow-md border border-slate-100">
              <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-slate-700">Loading packages...</span>
            </div>
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No packages found matching the current filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Default Price</TableHead>
                <TableHead>Add-ons</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  {/* Name & Subtitle */}
                  <TableCell className="max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/65 flex items-center justify-center shrink-0">
                        {pkg.gallery?.[0]?.image?.url ? (
                          <img src={pkg.gallery[0].image.url} alt={pkg.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-400 text-xs font-bold uppercase">
                            {pkg.title?.charAt(0) ?? '?'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 line-clamp-1">{pkg.title}</div>
                        {pkg.subtitle && (
                          <div className="text-slate-450 text-xs line-clamp-1 mt-0.5 font-medium">{pkg.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Country */}
                  <TableCell className="font-medium text-slate-700">
                    {pkg.country?.name || 'Unknown'}
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="text-slate-650 font-medium">
                    {pkg.durationDays} Days / {pkg.durationNights} Nights
                  </TableCell>

                  {/* Sort Order */}
                  <TableCell className="font-semibold text-slate-700">
                    {pkg.sortOrder}
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-semibold text-slate-900">
                    {getDefaultPrice(pkg)}
                  </TableCell>

                  {/* Add-ons Count */}
                  <TableCell className="font-semibold text-slate-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {pkg._count?.addons ?? 0} {pkg._count?.addons === 1 ? 'Add-on' : 'Add-ons'}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col gap-1 w-fit">
                      {pkg.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 uppercase tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200/50 uppercase tracking-wide">
                          Inactive
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-1.5">
                    <ToggleButton isActive={pkg.isActive} onClick={() => handleToggleStatus(pkg.id, pkg.isActive)} />
                    <ViewButton href={`/admin/packages/${pkg.id}/view`} />
                    <EditButton href={`/admin/packages/${pkg.id}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="text-sm font-medium text-slate-500">
          Showing <span className="font-semibold text-slate-800">{packages.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{total}</span> packages
        </div>
        <div className="flex items-center gap-2">
          {/* Limit Selector */}
          <div className="flex items-center gap-2 mr-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Per Page</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="h-8 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-800"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
            className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-xs font-semibold text-slate-600 px-2">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0 || loading}
            className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-xl text-sm font-medium z-50 flex items-center gap-2.5 transition-all animate-in slide-in-from-bottom-5 ${
          toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
