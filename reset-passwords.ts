import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = 'changeme123'
  console.log(`Generating hash for ${newPassword}...`)
  const passwordHash = await bcrypt.hash(newPassword, 12)
  
  console.log('Updating passwords for all non-superadmin users...')
  const result = await prisma.user.updateMany({
    where: {
      role: { not: 'SUPER_ADMIN' },
      username: { not: 'superadmin' }
    },
    data: {
      passwordHash: passwordHash,
      mustChangePassword: true // Force them to change it on next login
    }
  })
  
  console.log(`Successfully updated ${result.count} users.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
