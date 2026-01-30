import crypto from 'crypto';

export function generatePublicToken() {
  return crypto.randomUUID().replaceAll("-", "");
}
