'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TableContainer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Check,
  X,
  RefreshCw,
  Search,
  Mail,
  Phone,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  residenceCountry: string | null;
  notes: string | null;
  packageTitle: string;
  destination: string;
  addons: string | null;
  departureDate: string | null;
  returnDate: string | null;
  tripLength: string | null;
  adults: number;
  children: number;
  infants: number;
  interests: string | null;
  travelStyle: string | null;
  accommodations: string | null;
  flightSupport: string | null;
  packageTier: string | null;
  totalPrice: string | null;
  currency: string;
  status: BookingStatus;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
        setFilteredBookings(data);
      } else {
        console.error('Failed to load bookings, API returned:', data);
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (e) {
      console.error(e);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    let result = bookings;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.firstName.toLowerCase().includes(q) ||
        b.lastName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.packageTitle.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status.toLowerCase() === statusFilter);
    }
    setFilteredBookings(result);
  }, [searchQuery, statusFilter, bookings]);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadData();
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'PENDING':   return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'CANCELLED': return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:          return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
      case 'PENDING':   return <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />;
      case 'CANCELLED': return <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />;
      default:          return null;
    }
  };

  const sym = (currency: string) => currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Manage Bookings</h1>
        <p className="text-slate-500 mt-1">Review traveler enquiries, confirm trip plans, and manage status updates.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, booking ID or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-800"
          />
        </div>
        <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer w-full md:w-auto text-center ${
                statusFilter === status
                  ? 'bg-white text-primary-dark shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={loadData} className="shrink-0 rounded-xl cursor-pointer">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Table */}
      <TableContainer>
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-medium">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-850">No Bookings Found</h3>
            <p className="text-sm text-slate-450">No bookings match the specified filters or queries.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref & Date</TableHead>
                <TableHead>Traveler</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Trip Details</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((b) => (
                <React.Fragment key={b.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  >
                    {/* Ref & Date */}
                    <TableCell>
                      <div className="font-mono font-semibold text-slate-900 text-xs">#{b.id.slice(-8).toUpperCase()}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</div>
                    </TableCell>

                    {/* Traveler */}
                    <TableCell className="space-y-1">
                      <div className="font-semibold text-slate-900">{b.firstName} {b.lastName}</div>
                      <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" /><span>{b.email}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" /><span>{b.phone}</span>
                      </div>
                    </TableCell>

                    {/* Package */}
                    <TableCell>
                      <div className="font-semibold text-slate-900 max-w-xs">{b.packageTitle}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{b.destination}</div>
                      {b.addons && <div className="text-xs text-amber-600 mt-0.5">+{b.addons}</div>}
                    </TableCell>

                    {/* Trip Details */}
                    <TableCell className="space-y-1">
                      {b.departureDate && (
                        <div className="flex items-center text-xs text-slate-600 gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary-dark" />
                          <span>{b.departureDate} → {b.returnDate}</span>
                        </div>
                      )}
                      <div className="flex items-center text-xs text-slate-600 gap-1.5">
                        <Users className="w-3.5 h-3.5 text-teal-500" />
                        <span>{b.adults} adult{b.adults !== 1 ? 's' : ''}{b.children > 0 ? `, ${b.children} child` : ''}{b.infants > 0 ? `, ${b.infants} infant` : ''}</span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-semibold text-slate-900">
                      {b.totalPrice ? `${sym(b.currency)}${b.totalPrice}` : '-'}
                      {b.packageTier && <div className="text-xs text-slate-400 font-normal">{b.packageTier}</div>}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClass(b.status)}`}>
                        {getStatusIcon(b.status)}<span>{b.status}</span>
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      {b.status === 'PENDING' && (
                        <>
                          <Button onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')} variant="emerald" size="sm" className="h-8 w-8 !p-0 rounded-lg cursor-pointer" title="Confirm">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleUpdateStatus(b.id, 'CANCELLED')} variant="danger" size="sm" className="h-8 w-8 !p-0 rounded-lg cursor-pointer" title="Cancel">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <Button onClick={() => handleUpdateStatus(b.id, 'CANCELLED')} variant="danger" size="sm" className="h-8 px-2.5 text-xs rounded-lg cursor-pointer">
                          <X className="w-3 h-3 mr-1" /><span>Cancel</span>
                        </Button>
                      )}
                      {b.status === 'CANCELLED' && (
                        <Button onClick={() => handleUpdateStatus(b.id, 'PENDING')} variant="outline" size="sm" className="h-8 px-2.5 text-xs rounded-lg cursor-pointer">
                          <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" /><span>Reopen</span>
                        </Button>
                      )}
                      <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none">
                        {expandedId === b.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded detail row */}
                  {expandedId === b.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-slate-50/80 p-0">
                        <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3 text-sm">
                          {[
                            ['Duration',        b.tripLength],
                            ['Interests',       b.interests],
                            ['Travel Style',    b.travelStyle],
                            ['Accommodation',   b.accommodations],
                            ['Flight Support',  b.flightSupport],
                            ['Country of Res.', b.residenceCountry],
                            ['Notes',           b.notes],
                          ].filter(([, v]) => v).map(([label, value]) => (
                            <div key={label as string}>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                              <p className="text-slate-800 font-medium mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
