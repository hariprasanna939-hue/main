'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookings } from '@/lib/mockData';
import { Booking } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  DollarSign,
  CalendarCheck,
  Map,
  AlertCircle,
  ArrowUpRight,
  Compass,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Globe,
  Package,
  Layers,
  ImageIcon,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  ShieldCheck,
  Tags
} from 'lucide-react';

interface DBStats {
  countries: { total: number; active: number };
  packages: { total: number; active: number };
  addons: { total: number; active: number };
  testimonials: { total: number; active: number };
  icons: { total: number };
  averagePrice: number;
  countriesWithCounts: Array<{ id: string; name: string; count: number }>;
}

export default function AdminDashboard() {
  const [dbStats, setDbStats] = useState<DBStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real DB stats and mock bookings from localStorage
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setDbStats(data);
        }
        
        const bookings = getBookings();
        setRecentBookings(bookings.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getStatusBadgeClass = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/70';
      case 'pending':   return 'bg-amber-50 text-amber-700 border border-amber-200/70';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border border-rose-200/70';
      default:          return 'bg-slate-50 text-slate-700 border border-slate-200/70';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
      case 'pending':   return <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />;
      default:          return null;
    }
  };

  // Stats cards configuration based on live backend data
  const statsCards = dbStats ? [
    {
      label: 'Main Tour Packages',
      value: `${dbStats.packages.active} / ${dbStats.packages.total}`,
      description: 'Active / Total Tours',
      icon: Package,
      iconBg: 'bg-white/80 shadow-sm',
      iconColor: 'text-amber-700',
      bgClass: 'bg-gradient-to-br from-amber-50/90 to-orange-50/70 border-amber-200/70',
      trend: 'Live packages shown online',
      trendUp: true,
    },
    {
      label: 'Add-on Experiences',
      value: `${dbStats.addons.active} / ${dbStats.addons.total}`,
      description: 'Active / Total Add-ons',
      icon: Layers,
      iconBg: 'bg-white/80 shadow-sm',
      iconColor: 'text-violet-750',
      bgClass: 'bg-gradient-to-br from-violet-50/90 to-purple-50/70 border-violet-200/70',
      trend: 'Selectable during booking',
      trendUp: true,
    },
    {
      label: 'Countries Covered',
      value: `${dbStats.countries.active} / ${dbStats.countries.total}`,
      description: 'Active / Total Regions',
      icon: Globe,
      iconBg: 'bg-white/80 shadow-sm',
      iconColor: 'text-emerald-700',
      bgClass: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border-emerald-200/70',
      trend: 'India, Sri Lanka & more',
      trendUp: true,
    },
    {
      label: 'Average Tour Price',
      value: dbStats.averagePrice > 0 ? `₹${dbStats.averagePrice.toLocaleString()}` : '₹0',
      description: 'Default package tier avg',
      icon: DollarSign,
      iconBg: 'bg-white/80 shadow-sm',
      iconColor: 'text-sky-700',
      bgClass: 'bg-gradient-to-br from-sky-50/90 to-blue-50/70 border-sky-200/70',
      trend: 'From default pricing tiers',
      trendUp: false,
    },
  ] : [];

  const quickLinks = [
    { label: 'Countries',    icon: Globe,        href: '/admin/countries',    color: 'text-sky-600',    bg: 'bg-sky-50',    border: 'border-sky-200/50',    action: 'Manage' },
    { label: 'Packages',     icon: Package,      href: '/admin/packages',     color: 'text-[#ebb337]',  bg: 'bg-[#ebb337]/10', border: 'border-[#ebb337]/20', action: 'Create' },
    { label: 'Add-ons',      icon: Layers,       href: '/admin/addons',       color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200/50', action: 'Manage' },
    { label: 'Bookings',     icon: BookOpen,     href: '/admin/bookings',     color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200/50', action: 'View' },
    { label: 'Icons',        icon: ImageIcon,    href: '/admin/icons',        color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200/50',   action: 'Upload' },
    { label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200/50', action: 'Manage' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading dashboard analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Welcome back — Here's a overview of your Packages.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ebb337] text-slate-950 text-sm font-semibold rounded-xl hover:bg-[#d9a52e] transition-colors shadow-sm shadow-[#ebb337]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Package
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.bgClass} rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 ${card.iconBg} ${card.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">{card.description} • <span className="text-slate-500">{card.trend}</span></p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Recent Bookings Table (2/3 width) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recent Customer Enquiries</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest traveler bookings and quote requests</p>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#ebb337] hover:text-[#d9a52e] transition-colors"
            >
              See All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 text-slate-400 text-sm">
              No recent bookings recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tour Package</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Travel Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-400">{b.id}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900 line-clamp-1 text-sm">{b.tourTitle}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900 text-sm">{b.customerName}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{b.customerEmail}</div>
                      </TableCell>
                      <TableCell className="text-slate-650 text-sm font-medium">{b.travelDate}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusBadgeClass(b.status)}`}>
                          {getStatusIcon(b.status)}
                          {b.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Right Column: Quick Access & Destination Breakdown (1/3 width) */}
        <div className="flex flex-col gap-6">
          {/* Quick Access */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Quick Access</h3>
              <p className="text-xs text-slate-400 mt-0.5">Jump to any section instantly</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex flex-col items-start gap-2 p-3.5 rounded-xl border ${link.border} ${link.bg} hover:shadow-md transition-all group`}
                  >
                    <div className={`${link.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-850 leading-tight">{link.label}</p>
                      <p className={`text-[10px] font-semibold ${link.color} mt-1 group-hover:opacity-80 transition-opacity`}>{link.action} →</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Destination Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Tours by Destination</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active main package distribution</p>
            </div>

            <div className="flex flex-col gap-3">
              {dbStats?.countriesWithCounts.map((country) => (
                <div key={country.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#ebb337] border border-amber-100">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{country.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-650 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                    {country.count} {country.count === 1 ? 'tour' : 'tours'}
                  </span>
                </div>
              ))}
              {dbStats?.countriesWithCounts.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No countries found.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
