import React from 'react';
import IconsClient from '@/components/admin/icons/IconsClient';
import { getIcons } from '@/services/admin/icon.service';

export default async function AdminIconsPage() {
  const icons = await getIcons();
  return <IconsClient initialIcons={icons} />;
}
