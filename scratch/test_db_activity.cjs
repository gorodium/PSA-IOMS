const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.calendarActivity.findMany({
    where: {
      createdAt: { gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.dir(activities, { depth: null });
}

main().finally(() => prisma.$disconnect());
