/**
 * Cleans and formats the CDP API private key from environment variables
 * Removes surrounding quotes, replaces escaped newlines, and trims whitespace
 * @returns The cleaned private key string
 * @throws Error if CDP_API_KEY_PRIVATE_KEY is not set
 */
export function cleanCdpKey(): string {
  const rawKey = process.env.CDP_API_KEY_PRIVATE_KEY;

  if (!rawKey) {
    throw new Error(
      'CDP_API_KEY_PRIVATE_KEY not found in environment variables',
    );
  }

  return rawKey
    .replace(/^"|"$/g, '') // Remove surrounding quotes
    .replace(/\\n/g, '\n') // Replace escaped newlines
    .trim(); // Remove extra whitespace
}
