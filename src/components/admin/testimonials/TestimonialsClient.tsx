'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EditButton, ToggleButton } from '@/components/ui/action-buttons';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function TestimonialsClient({
  initialTestimonials,
  initialTotal
}: {
  initialTestimonials: any[];
  initialTotal: number;
}) {
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Pagination & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 10));
  const [loading, setLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Testimonials from API
  const fetchTestimonials = async (
    currentPage: number,
    currentLimit: number,
    search: string,
    status: string
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentLimit.toString(),
        search,
        status
      });
      const res = await fetch(`/api/admin/testimonials?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.items);
        setTotal(data.total);
        setTotalPages(Math.ceil(data.total / currentLimit));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTestimonials(page, limit, searchTerm, statusFilter);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [page, limit, searchTerm, statusFilter]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t));
        showToast(`Testimonial successfully ${currentStatus ? 'hidden' : 'activated'}.`, 'success');
      } else {
        showToast('Failed to update status.', 'error');
      }
    } catch (error) {
      showToast('Failed to update status.', 'error');
    } finally {
      setIsToggling(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setIsDeleting(id);
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTestimonials(testimonials.filter(t => t.id !== id));
          setTotal(prev => prev - 1);
          showToast('Testimonial deleted successfully.', 'success');
        } else {
          showToast('Failed to delete testimonial.', 'error');
        }
      } catch (error) {
        showToast('Failed to delete testimonial.', 'error');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage customer reviews and feedback</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {/* Filters UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Search Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by customer name or content..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 font-medium text-slate-800"
          />
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
            <option value="INACTIVE">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <TableContainer className="relative min-h-[150px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all">
            <div className="flex items-center gap-2 bg-white/95 px-4 py-2.5 rounded-full shadow-md border border-slate-100">
              <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-slate-700">Loading testimonials...</span>
            </div>
          </div>
        )}

        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No testimonials found matching the current filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Avatar</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t.id} className={!t.isActive ? 'opacity-60' : ''}>
                  {/* Avatar */}
                  <TableCell>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      {t.image?.url ? (
                        <img src={t.image.url} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 text-base font-bold uppercase">
                          {t.name?.charAt(0) ?? '?'}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  </TableCell>

                  {/* Review quote */}
                  <TableCell className="max-w-xs">
                    <p className="text-slate-600 text-sm italic line-clamp-2">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                      t.isActive
                        ? 'bg-green-50 text-green-700 border border-green-200/50'
                        : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                    }`}>
                      {t.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right space-x-1.5">
                    <EditButton href={`/admin/testimonials/${t.id}`} />
                    <ToggleButton
                      isActive={t.isActive}
                      onClick={() => handleToggle(t.id, t.isActive)}
                      disabled={isToggling === t.id}
                    />
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
          Showing <span className="font-semibold text-slate-800">{testimonials.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{total}</span> testimonials
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
