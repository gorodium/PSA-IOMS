const crypto = require('crypto');

function createSessionToken(userId) {
  const expiresAt = Date.now() + 60 * 60 * 24 * 365 * 1000;
  const payload = JSON.stringify({ userId, expiresAt });
  const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'default_secret')
    .update(payload)
    .digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

console.log(createSessionToken('user-id'));
