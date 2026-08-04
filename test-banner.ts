import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const pkg = await prisma.package.findFirst();
  console.log("Found package:", pkg?.id);
  
  if (pkg) {
    const updated = await prisma.package.update({
      where: { id: pkg.id },
      data: {
        bestTimeToTravel: "Test Best Time"
      }
    });
    console.log("Updated bestTimeToTravel:", updated.bestTimeToTravel);
  }
}

run().then(() => console.log("Done")).catch(console.error);
