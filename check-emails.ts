import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const personnel = await prisma.personnel.findMany({ 
    where: { 
      fullName: { 
        in: ['Adams Christopher P. Sios-e', 'Marlon T. Galindo', 'Cindy B. Dumaloan', 'Hector B. Paylangco']
      }
    },
    select: { fullName: true, email: true } 
  })
  console.log('Personnel emails in Supabase:', personnel)
}
main().catch(console.error).finally(() => prisma.$disconnect())
