import { randomInt } from 'crypto';

export function generateOTP() {
  return randomInt(100000, 1000000).toString();
}
