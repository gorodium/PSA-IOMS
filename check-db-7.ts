import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.rcekngtqkiwibdejtkcu:Prisoner201131460@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&sslmode=require"
    }
  }
})
async function main() {
  const convo = await prisma.convocationProgram.findMany({ 
    select: { id: true, convocationDate: true, status: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  console.log('Convocations in Supabase (latest 10):')
  convo.forEach(c => console.log(' -', c.convocationDate, c.status))
}
main().catch(console.error).finally(() => prisma.$disconnect())
