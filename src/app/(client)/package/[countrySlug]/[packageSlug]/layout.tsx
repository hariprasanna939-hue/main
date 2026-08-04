import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PackageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ countrySlug: string; packageSlug: string }>;
}) {
  const resolvedParams = await params;
  const { packageSlug } = resolvedParams;

  const pkg = await prisma.package.findUnique({
    where: { slug: packageSlug },
    select: {
      primaryColor: true,
      secondaryColor: true,
      isActive: true,
    },
  });

  if (!pkg || !pkg.isActive) {
    notFound();
  }

  // Define CSS variables for dynamic theming
  const style = {
    '--pkg-primary': pkg.primaryColor || '#2563eb', // Default to a blue
    '--pkg-secondary': pkg.secondaryColor || '#bfdbfe', // Default to light blue
  } as React.CSSProperties;

  return (
    <div style={style} className="package-theme-wrapper w-full min-h-screen bg-neutral-50 selection:bg-[var(--pkg-primary)] selection:text-white pb-0">
      {children}
    </div>
  );
}
