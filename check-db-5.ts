import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const convo = await prisma.convocationProgram.findMany({ 
    select: { id: true, convocationDate: true, status: true },
    orderBy: { convocationDate: 'asc' }
  })
  console.log('Convocations in Supabase:')
  convo.forEach(c => console.log(' -', c.convocationDate))
}
main().catch(console.error).finally(() => prisma.$disconnect())
