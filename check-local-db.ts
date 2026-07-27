import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Prisoner201131460@localhost:5432/ioms"
    }
  }
})
async function main() {
  const users = await prisma.user.findMany({ select: { email: true, name: true } })
  console.log('Local Users:', users.length)
  console.log(users.slice(0, 5))
  
  const convo = await prisma.convocationProgram.findMany({ select: { id: true, convocationDate: true } })
  console.log('Local Convocations:', convo.length)
}
main().catch(console.error).finally(() => prisma.$disconnect())
