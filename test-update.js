const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const pkg = await prisma.package.findFirst();
  console.log("Package ID:", pkg.id);
  
  await prisma.package.update({
    where: { id: pkg.id },
    data: {
      perfectFors: {
        deleteMany: {},
        create: [
          { title: "Test Perfect For", iconId: null, sortOrder: 0 }
        ]
      }
    }
  });
  
  const updated = await prisma.package.findUnique({
    where: { id: pkg.id },
    include: { perfectFors: true }
  });
  
  console.log("Updated PerfectFors:", updated.perfectFors);
}

test().catch(console.error).finally(() => prisma.$disconnect());
