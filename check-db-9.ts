import { PrismaClient, ConvocationProgramStatus } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.rcekngtqkiwibdejtkcu:Prisoner201131460@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&sslmode=require"
    }
  }
})
async function main() {
  // Exact same query as the Recent Programs table
  const programs = await prisma.convocationProgram.findMany({
    where: {
      status: { not: ConvocationProgramStatus.ARCHIVED }
    },
    include: { group: true },
    orderBy: { convocationDate: 'desc' },
    take: 12
  })
  console.log('Recent Programs found:', programs.length)
  programs.forEach(p => console.log(' -', p.convocationDate, p.status, p.group.name))
}
main().catch(console.error).finally(() => prisma.$disconnect())
