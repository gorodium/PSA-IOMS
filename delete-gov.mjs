import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const res = await prisma.personnel.deleteMany({
    where: {
      employeeNo: {
        startsWith: 'GOV'
      }
    }
  });
  console.log(`Deleted ${res.count} employees`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
