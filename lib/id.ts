/**
 * Generate a cryptographically random UUID.
 *
 * Uses the Web Crypto API available in all modern runtimes
 * (Node 19+, Cloudflare Workers, Deno, browsers).
 */
export function generateId(): string {
  return crypto.randomUUID();
}
