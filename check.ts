import { prisma } from './src/lib/prisma'
async function main() {
  const its = await prisma.itinerary.findMany({ select: { id: true, title: true, country: true, state: true, city: true, lat: true, lng: true } })
  console.dir(its, { depth: null })
}
main().catch(console.error).finally(() => prisma.$disconnect())
