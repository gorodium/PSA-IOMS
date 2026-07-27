const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const db = new PrismaClient();

function createSessionToken(userId) {
  const expiresAt = Date.now() + 60 * 60 * 24 * 365 * 1000;
  const payload = JSON.stringify({ userId, expiresAt });
  const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'default_secret')
    .update(payload)
    .digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

async function main() {
  const user = await db.user.findFirst();
  if (user) {
    console.log('COOKIE:', createSessionToken(user.id));
  } else {
    console.log('No user found');
  }
}

main().finally(() => db.$disconnect());
