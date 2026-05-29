import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const all = await prisma.personnel.findMany({ orderBy: { fullName: 'asc' } });
  const c = all.filter(p => p.fullName.toLowerCase().includes('c') || p.position.toLowerCase().includes('c'));
  console.log('Total with c:', c.length);
  const C = all.filter(p => p.fullName.includes('C') || p.position.includes('C'));
  console.log('Total with capital C:', C.length);
  console.log('Claudevan index in c:', c.findIndex(p => p.fullName.includes('Claudevan')));
  console.log('Claudevan index in capital C:', C.findIndex(p => p.fullName.includes('Claudevan')));
  await prisma.$disconnect();
}
run();
