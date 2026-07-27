import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.rcekngtqkiwibdejtkcu:Prisoner201131460@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&sslmode=require"
    }
  }
})
async function main() {
  const cutoff = new Date(new Date().setHours(0, 0, 0, 0));
  console.log('Cutoff Date:', cutoff);
  const convo = await prisma.convocationProgram.findFirst({ 
    where: {
      status: { not: 'ARCHIVED' },
      convocationDate: { gte: cutoff }
    },
    orderBy: { convocationDate: 'asc' }
  })
  console.log('Upcoming Convo Result:', convo)
}
main().catch(console.error).finally(() => prisma.$disconnect())
