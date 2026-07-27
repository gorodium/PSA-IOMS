import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const users = await prisma.user.findMany({ select: { email: true, name: true } })
  console.log('Users:', users.length)
  console.log(users.slice(0, 5))
  
  const personnel = await prisma.personnel.findMany({ select: { id: true, fullName: true, email: true } })
  console.log('Personnel:', personnel.length)
  console.log(personnel.slice(0, 5))
  
  const convo = await prisma.convocationProgram.findMany({ select: { id: true, convocationDate: true } })
  console.log('Convocations:', convo.length)
  console.log(convo)
}
main().catch(console.error).finally(() => prisma.$disconnect())
