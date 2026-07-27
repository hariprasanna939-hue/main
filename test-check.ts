import { prisma } from './src/lib/prisma';

async function check() {
  const pkg = await prisma.package.findUnique({
    where: { slug: "golden-triangle" }
  });
  console.log("Package Banner Highlights:");
  console.log("bestTimeToTravel:", pkg?.bestTimeToTravel);
  console.log("weather:", pkg?.weather);
  console.log("travelTime:", pkg?.travelTime);
  console.log("tourDuration:", pkg?.tourDuration);
  console.log("tourStyle:", pkg?.tourStyle);
}

check().catch(console.error).finally(() => prisma.$disconnect());
