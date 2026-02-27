import bcrypt from 'bcrypt';
import crypto from 'crypto';
const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generatePassword(length = 14) {
  const CHARSET =
    'ABCDEFGHIJKLMNOPQURSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()';

  let password = '';
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += CHARSET[bytes[i] % CHARSET.length];
  }

  return password;
}
