import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const admin = await getAdminFromToken(token);
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex">
      {/* Sidebar - Fixed width layout */}
      <Sidebar />
      
      {/* Main Admin Workspace */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/50 bg-[#FAF8F6]/95 backdrop-blur-md flex items-center justify-end px-8 sticky top-0 z-20">
          <AdminTopBar email={admin.email} />
        </header>
        
        {/* Workspace Content */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
