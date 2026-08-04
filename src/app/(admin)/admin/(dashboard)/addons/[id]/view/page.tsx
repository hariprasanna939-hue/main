import React from 'react';
import { getPackage } from '@/services/admin/package.service';
import PackageViewer from '@/components/admin/package/PackageViewer';
import { notFound } from 'next/navigation';

export default async function AdminAddonViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  if (id === 'new') {
    notFound();
  }
  
  const pkg = await getPackage(id);

  if (!pkg || pkg.type !== 'ADDON') {
    notFound();
  }

  return <PackageViewer pkg={pkg} type="ADDON" />;
}
