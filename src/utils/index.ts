// src/utils/password.utils.ts
import * as bcrypt from 'bcrypt';

/**
 * Hash a plain text password
 * @param password plain text password
 * @returns hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify if a plain text password matches the hashed password
 * @param plain plain text password
 * @param hashed hashed password
 * @returns boolean
 */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
