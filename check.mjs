import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const res = await prisma.personnel.findMany({
    where: {
      fullName: {
        contains: 'Clau',
        mode: 'insensitive',
      },
    },
  });
  console.log(res);
  await prisma.$disconnect();
}
run();
