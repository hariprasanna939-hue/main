'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Map, CalendarCheck, ArrowLeft, Compass, Layers, MessageSquare, ImageIcon, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      title: 'Manage Countries',
      icon: Map,
      path: '/admin/countries'
    },
    {
      title: 'Manage Packages',
      icon: Compass,
      path: '/admin/packages'
    },
    {
      title: 'Manage Add-ons',
      icon: Layers,
      path: '/admin/addons'
    },
    {
      title: 'Manage Bookings',
      icon: CalendarCheck,
      path: '/admin/bookings'
    },
    {
      title: 'Manage Icons',
      icon: ImageIcon,
      path: '/admin/icons'
    },
    {
      title: 'Testimonials',
      icon: MessageSquare,
      path: '/admin/testimonials'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-30">
      {/* Brand Header */}
      <div className="flex flex-col justify-center px-5 py-4 border-b border-slate-800 bg-slate-950">
        <Link href="/admin" className="flex flex-col select-none group">
          <img
            src="/logo/indsrilogo.png"
            alt="India Sri Lanka Escapes"
            className="h-8 w-auto object-contain"
          />
     
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active 
                  ? 'bg-primary text-slate-950 font-semibold shadow-sm shadow-primary/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer link to main site & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-1">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/30 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

