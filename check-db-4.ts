import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const convo = await prisma.convocationProgram.findMany({ 
    select: { id: true, convocationDate: true },
    orderBy: { convocationDate: 'asc' }
  })
  console.log('Convocations in Supabase:')
  convo.forEach(c => console.log(' -', c.convocationDate))
  
  const personnel = await prisma.personnel.findMany({ 
    where: { email: { not: null } },
    select: { fullName: true, email: true },
    take: 3,
    orderBy: { updatedAt: 'desc' }
  })
  console.log('Recently updated emails:')
  personnel.forEach(p => console.log(' -', p.fullName, ':', p.email))
}
main().catch(console.error).finally(() => prisma.$disconnect())
