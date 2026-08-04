import React from 'react';
import { getPackage } from '@/services/admin/package.service';
import PackageViewer from '@/components/admin/package/PackageViewer';
import { notFound } from 'next/navigation';

export default async function AdminPackageViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('[AdminPackageViewPage] id:', id);
  
  if (id === 'new') {
    console.log('[AdminPackageViewPage] id is new, returning notFound');
    notFound();
  }
  
  const pkg = await getPackage(id);
  console.log('[AdminPackageViewPage] pkg found:', pkg ? pkg.title : 'NULL', 'type:', pkg ? pkg.type : 'N/A');

  if (!pkg || pkg.type !== 'MAIN') {
    console.log('[AdminPackageViewPage] Triggering notFound, pkg is null:', !pkg, 'type mismatch:', pkg ? pkg.type !== 'MAIN' : 'N/A');
    notFound();
  }

  return <PackageViewer pkg={pkg} type="MAIN" />;
}
