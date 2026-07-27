import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const personnel = await prisma.personnel.findMany({ 
    where: { email: { not: null } },
    select: { id: true, fullName: true, email: true } 
  })
  console.log('Personnel with emails:', personnel.length)
  console.log(personnel.slice(0, 5))
}
main().catch(console.error).finally(() => prisma.$disconnect())
