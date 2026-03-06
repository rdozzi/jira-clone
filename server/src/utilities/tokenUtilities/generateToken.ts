import crypto from 'crypto';

export function generateRawToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  return rawToken;
}

export function generateHashedToken(rawToken: string) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return hashedToken;
}
