import { prisma } from '@/lib/prisma';

function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}

export async function getCountriesForDropdown() {
  return prisma.country.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true }
  });
}

export async function getPackages(type: 'MAIN' | 'ADDON' = 'MAIN') {
  const result = await prisma.package.findMany({
    where: { type },
    orderBy: { createdAt: 'desc' },
    include: {
      country: {
        select: { name: true }
      },
      gallery: {
        where: { isCover: true },
        include: { image: true }
      },
      pricePackages: {
        select: { price: true, isDefault: true }
      },
      _count: {
        select: {
          addons: true
        }
      },
      addonFor: {
        include: {
          package: {
            select: { title: true }
          }
        }
      }
    }
  });
  return serializePrisma(result);
}

export async function getPackage(id: string) {
  if (id === 'new') return null;
  const result = await prisma.package.findUnique({
    where: { id },
    include: {
      country: {
        select: { name: true }
      },
      itineraries: {
        orderBy: { dayNumber: 'asc' },
        include: { image: true, icons: { include: { image: true } } }
      },
      experiences: {
        orderBy: { sortOrder: 'asc' },
        include: { imageOne: true }
      },
      hotels: {
        orderBy: { sortOrder: 'asc' },
        include: { image: true }
      },
      goodToKnows: {
        orderBy: { sortOrder: 'asc' },
        include: { icon: { include: { image: true } } }
      },
      perfectFors: {
        orderBy: { sortOrder: 'asc' },
        include: { icon: { include: { image: true } } }
      },
      localCuisines: {
        orderBy: { sortOrder: 'asc' },
        include: { icon: { include: { image: true } }, image: true }
      },
      pricePackages: {
        orderBy: { sortOrder: 'asc' }
      },
      bestSeasons: true,
      highlights: {
        orderBy: { sortOrder: 'asc' },
        include: { icon: { include: { image: true } } }
      },
      footerImage: true,
      cuisineBgImage: true,
      whyLoveBgImage: true,
      addonFor: true,
      gallery: {
        include: { image: true }
      }
    }
  });
  return serializePrisma(result);
}

export async function createPackage(data: any) {
  let finalCountryId = data.countryId;

  if (data.type === 'ADDON' && data.mainPackageId) {
    const mainPkg = await prisma.package.findUnique({ where: { id: data.mainPackageId } });
    if (mainPkg) {
      finalCountryId = mainPkg.countryId;
      if (data.isActive && !mainPkg.isActive) {
        throw new Error('Cannot activate add-on because its main package is inactive.');
      }
    }
  }

  return prisma.package.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      slug: data.slug,
      sortOrder: Number(data.sortOrder) || 0,
      description: data.description,
      durationDays: Number(data.durationDays),
      durationNights: Number(data.durationNights),
      bestTimeToTravel: data.bestTimeToTravel || null,
      weather: data.weather || null,
      travelTime: data.travelTime || null,
      tourDuration: data.tourDuration || null,
      tourStyle: data.tourStyle || null,
      isActive: data.isActive === undefined ? true : Boolean(data.isActive),
      currency: data.currency || 'INR',
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      footerTitle: data.footerTitle || null,
      ...(data.footerImageId ? { footerImage: { connect: { id: data.footerImageId } } } : {}),
      ...(data.cuisineBgImageId ? { cuisineBgImage: { connect: { id: data.cuisineBgImageId } } } : {}),
      ...(data.whyLoveBgImageId ? { whyLoveBgImage: { connect: { id: data.whyLoveBgImageId } } } : {}),
      country: {
        connect: { id: finalCountryId }
      },
      type: data.type || 'MAIN',
      ...(data.itineraries && data.itineraries.length > 0 ? {
        itineraries: {
          create: data.itineraries.map((it: any) => ({
            dayNumber: it.dayNumber,
            title: it.title,
            description: it.description,
            imageId: it.imageId || null,
            country: it.country || null,
            state: it.state || null,
            city: it.city || null,
            lat: it.lat != null ? Number(it.lat) : null,
            lng: it.lng != null ? Number(it.lng) : null,
            ...(it.iconIds && it.iconIds.length > 0 ? {
              icons: {
                connect: it.iconIds.map((id: string) => ({ id }))
              }
            } : {})
          }))
        }
      } : {}),
      ...(data.experiences && data.experiences.length > 0 ? {
        experiences: {
          create: data.experiences.map((exp: any, i: number) => ({
            title: exp.title,
            description: exp.description,
            imageOneId: exp.imageOneId,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.hotels && data.hotels.length > 0 ? {
        hotels: {
          create: data.hotels.map((hotel: any, i: number) => ({
            title: hotel.title,
            description: hotel.description,
            rating: Number(hotel.rating),
            imageId: hotel.imageId,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.goodToKnows && data.goodToKnows.length > 0 ? {
        goodToKnows: {
          create: data.goodToKnows.map((gtk: any, i: number) => ({
            title: gtk.title,
            description: gtk.description,
            iconId: gtk.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.perfectFors && data.perfectFors.length > 0 ? {
        perfectFors: {
          create: data.perfectFors.map((pf: any, i: number) => ({
            title: pf.title,
            iconId: pf.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.localCuisines && data.localCuisines.length > 0 ? {
        localCuisines: {
          create: data.localCuisines.map((lc: any, i: number) => ({
            title: lc.title || null,
            imageId: lc.imageId || null,
            iconId: lc.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.pricePackages && data.pricePackages.length > 0 ? {
        pricePackages: {
          create: data.pricePackages.map((pp: any, i: number) => ({
            title: pp.title,
            subtitle: pp.subtitle || null,
            description: pp.description,
            price: Number(pp.price),
            isDefault: Boolean(pp.isDefault),
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.bestSeasons && data.bestSeasons.length > 0 ? {
        bestSeasons: {
          create: data.bestSeasons.map((bs: any) => ({
            month: bs.month,
            type: bs.type || 'BEST'
          }))
        }
      } : {}),
      ...(data.highlights && data.highlights.length > 0 ? {
        highlights: {
          create: data.highlights.map((hl: any, i: number) => ({
            title: hl.title,
            value: hl.value,
            iconId: hl.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.type === 'ADDON' && data.mainPackageId ? {
        addonFor: {
          create: {
            packageId: data.mainPackageId
          }
        }
      } : {}),
      ...(data.coverImageId ? {
        gallery: {
          create: [{ imageId: data.coverImageId, isCover: true, sortOrder: 0 }]
        }
      } : {})
    }
  });
}

export async function updatePackage(id: string, data: any) {
  let finalCountryId = data.countryId;

  if (data.type === 'ADDON' && data.mainPackageId) {
    const mainPkg = await prisma.package.findUnique({ where: { id: data.mainPackageId } });
    if (mainPkg) {
      finalCountryId = mainPkg.countryId;
      if (data.isActive && !mainPkg.isActive) {
        throw new Error('Cannot activate add-on because its main package is inactive.');
      }
    }
  }

  const updated = await prisma.package.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      slug: data.slug,
      sortOrder: Number(data.sortOrder) || 0,
      description: data.description,
      durationDays: Number(data.durationDays),
      durationNights: Number(data.durationNights),
      bestTimeToTravel: data.bestTimeToTravel || null,
      weather: data.weather || null,
      travelTime: data.travelTime || null,
      tourDuration: data.tourDuration || null,
      tourStyle: data.tourStyle || null,
      isActive: data.isActive === undefined ? true : Boolean(data.isActive),
      currency: data.currency || 'INR',
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      footerTitle: data.footerTitle || null,
      ...(data.footerImageId ? { footerImage: { connect: { id: data.footerImageId } } } : { footerImage: { disconnect: true } }),
      ...(data.cuisineBgImageId ? { cuisineBgImage: { connect: { id: data.cuisineBgImageId } } } : { cuisineBgImage: { disconnect: true } }),
      ...(data.whyLoveBgImageId ? { whyLoveBgImage: { connect: { id: data.whyLoveBgImageId } } } : { whyLoveBgImage: { disconnect: true } }),
      country: { connect: { id: finalCountryId } },
      type: data.type || 'MAIN',
      ...(data.itineraries ? {
        itineraries: {
          deleteMany: {},
          create: data.itineraries.map((it: any) => ({
            dayNumber: it.dayNumber,
            title: it.title,
            description: it.description,
            imageId: it.imageId || null,
            country: it.country || null,
            state: it.state || null,
            city: it.city || null,
            lat: it.lat != null ? Number(it.lat) : null,
            lng: it.lng != null ? Number(it.lng) : null,
            ...(it.iconIds && it.iconIds.length > 0 ? {
              icons: {
                connect: it.iconIds.map((id: string) => ({ id }))
              }
            } : {})
          }))
        }
      } : {}),
      ...(data.experiences ? {
        experiences: {
          deleteMany: {},
          create: data.experiences.map((exp: any, i: number) => ({
            title: exp.title,
            description: exp.description,
            imageOneId: exp.imageOneId,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.hotels ? {
        hotels: {
          deleteMany: {},
          create: data.hotels.map((hotel: any, i: number) => ({
            title: hotel.title,
            description: hotel.description,
            rating: Number(hotel.rating),
            imageId: hotel.imageId,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.goodToKnows ? {
        goodToKnows: {
          deleteMany: {},
          create: data.goodToKnows.map((gtk: any, i: number) => ({
            title: gtk.title,
            description: gtk.description,
            iconId: gtk.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.perfectFors ? {
        perfectFors: {
          deleteMany: {},
          create: data.perfectFors.map((pf: any, i: number) => ({
            title: pf.title,
            iconId: pf.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.localCuisines ? {
        localCuisines: {
          deleteMany: {},
          create: data.localCuisines.map((lc: any, i: number) => ({
            title: lc.title || null,
            imageId: lc.imageId || null,
            iconId: lc.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.pricePackages ? {
        pricePackages: {
          deleteMany: {},
          create: data.pricePackages.map((pp: any, i: number) => ({
            title: pp.title,
            subtitle: pp.subtitle || null,
            description: pp.description,
            price: Number(pp.price),
            isDefault: Boolean(pp.isDefault),
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.highlights ? {
        highlights: {
          deleteMany: {},
          create: data.highlights.map((hl: any, i: number) => ({
            title: hl.title,
            value: hl.value,
            iconId: hl.iconId || null,
            sortOrder: i
          }))
        }
      } : {}),
      ...(data.type === 'ADDON' && data.mainPackageId ? {
        addonFor: {
          deleteMany: {},
          create: {
            packageId: data.mainPackageId
          }
        }
      } : {}),
      ...(data.coverImageId ? {
        gallery: {
          deleteMany: { isCover: true },
          create: [{ imageId: data.coverImageId, isCover: true, sortOrder: 0 }]
        }
      } : {})
    }
  });

  if (!updated.isActive && updated.type === 'MAIN') {
    const addons = await prisma.packageAddon.findMany({
      where: { packageId: id }
    });
    if (addons.length > 0) {
      await prisma.package.updateMany({
        where: { id: { in: addons.map(a => a.addonPackageId) } },
        data: { isActive: false }
      });
    }
  }

  return updated;
}

export async function deletePackage(id: string) {
  await prisma.package.delete({
    where: { id }
  });
  return { success: true };
}

export async function togglePackageStatus(id: string, isActive: boolean) {
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { addonFor: true }
  });

  if (!pkg) throw new Error('Package not found');

  if (isActive && pkg.type === 'ADDON') {
    const parentLink = pkg.addonFor[0];
    if (parentLink) {
      const parentPkg = await prisma.package.findUnique({
        where: { id: parentLink.packageId }
      });
      if (parentPkg && !parentPkg.isActive) {
        throw new Error('Cannot activate add-on because its main package is inactive.');
      }
    }
  }

  const updated = await prisma.package.update({
    where: { id },
    data: { isActive }
  });

  if (!isActive && pkg.type === 'MAIN') {
    const addons = await prisma.packageAddon.findMany({
      where: { packageId: id }
    });
    if (addons.length > 0) {
      await prisma.package.updateMany({
        where: {
          id: { in: addons.map(a => a.addonPackageId) }
        },
        data: { isActive: false }
      });
    }
  }

  return updated;
}

export async function getPackagesPaginated(params: {
  type?: 'MAIN' | 'ADDON';
  search?: string;
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  packageId?: string;
  countryId?: string;
  limit?: number;
  page?: number;
}) {
  const type = params.type || 'MAIN';
  const search = params.search || '';
  const status = params.status || 'ALL';
  const packageId = params.packageId || '';
  const countryId = params.countryId || '';
  const limit = params.limit || 10;
  const page = params.page || 1;
  const skip = (page - 1) * limit;

  // Build the where clause
  const where: any = { type };

  if (status === 'ACTIVE') {
    where.isActive = true;
  } else if (status === 'INACTIVE') {
    where.isActive = false;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { subtitle: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (packageId) {
    where.addonFor = {
      some: {
        packageId: packageId
      }
    };
  }

  if (countryId) {
    where.countryId = countryId;
  }

  const [total, items] = await Promise.all([
    prisma.package.count({ where }),
    prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        country: {
          select: { name: true }
        },
        gallery: {
          where: { isCover: true },
          include: { image: true }
        },
        pricePackages: {
          select: { price: true, isDefault: true }
        },
        _count: {
          select: {
            addons: true
          }
        },
        addonFor: {
          include: {
            package: {
              select: { title: true }
            }
          }
        }
      }
    })
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    items: serializePrisma(items)
  };
}
