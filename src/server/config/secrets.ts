/**
 * PrepInMinutes — Hybrid Secrets Resolver
 * 
 * Strategy:
 * 1. Primary: Fetches production secrets from Bitwarden (Secrets Manager / Vault)
 *    if BWS_ACCESS_TOKEN or BW_SESSION is configured.
 * 2. Fallback: Automatically and seamlessly falls back to process.env (.env file)
 *    if Bitwarden is not configured, offline, or unavailable.
 */

export interface AppSecrets {
  // Database & Cache
  DATABASE_URL: string;
  DIRECT_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;

  // Cloudflare R2 Storage
  R2_ACCOUNT_ID: string;
  R2_ENDPOINT: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;

  // Voice AI (STT & TTS)
  DEEPGRAM_PROJECT_ID: string;
  DEEPGRAM_API_KEY: string;
  CARTESIA_API_KEY: string;

  // Google Gemini AI
  GEMINI_API_KEY: string;
  GOOGLE_AI_PROJECT_ID: string;
  GOOGLE_AI_PROJECT_NUMBER: string;

  // Auth (Clerk)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
}

let cachedSecrets: AppSecrets | null = null;

/**
 * Loads secrets from Bitwarden Secrets Manager if configured.
 * Uses the local or global bws binary with BWS_ACCESS_TOKEN.
 */
function fetchBitwardenSecrets(): Partial<AppSecrets> | null {
  const bwsToken = process.env.BWS_ACCESS_TOKEN;
  if (!bwsToken) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { execSync } = require('child_process');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');

    const localBws = path.resolve(process.cwd(), 'bin/bws');
    const bwsBin = fs.existsSync(localBws) ? localBws : 'bws';

    const stdout = execSync(
      `"${bwsBin}" secret list --access-token "${bwsToken}" -o json`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 5000 }
    );

    const list = JSON.parse(stdout);
    if (!Array.isArray(list)) {
      return null;
    }

    const bitwardenMap: Record<string, string> = {};
    for (const item of list) {
      if (item.key && item.value) {
        bitwardenMap[item.key] = item.value;
      }
    }

    return bitwardenMap as Partial<AppSecrets>;
  } catch {
    console.warn('[Bitwarden] Could not retrieve secrets from Bitwarden Secrets Manager. Using .env fallback.');
    return null;
  }
}

/**
 * Loads secrets from Bitwarden CLI if BW_SESSION is present.
 */
function fetchBitwardenCliSecrets(): Partial<AppSecrets> | null {
  const session = process.env.BW_SESSION;
  if (!session) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { execSync } = require('child_process');
    const stdout = execSync(
      `npx @bitwarden/cli get item "PrepInMinutes - Production Environment (.env)" --session "${session}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    const item = JSON.parse(stdout);
    if (!item || !Array.isArray(item.fields)) {
      return null;
    }

    const bitwardenMap: Record<string, string> = {};
    for (const field of item.fields) {
      if (field.name && field.value) {
        bitwardenMap[field.name] = field.value;
      }
    }

    return bitwardenMap as Partial<AppSecrets>;
  } catch {
    console.warn('[Bitwarden] Could not retrieve item from Bitwarden CLI. Using .env fallback.');
    return null;
  }
}

/**
 * Retrieves environment secrets, prioritizing Bitwarden with local .env fallback.
 */
export async function getSecrets(): Promise<AppSecrets> {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  // 1. Attempt Bitwarden retrieval (Secrets Manager or Vault CLI)
  let bitwardenSecrets: Partial<AppSecrets> | null = null;
  if (process.env.BWS_ACCESS_TOKEN) {
    bitwardenSecrets = await fetchBitwardenSecrets();
  } else if (process.env.BW_SESSION) {
    bitwardenSecrets = fetchBitwardenCliSecrets();
  }

function loadLocalEnvFallback(): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        map[key] = val;
      }
    }
  } catch {
    // Silent ignore
  }
  return map;
}

  // 2. Resolve with .env fallback
  const localEnv = loadLocalEnvFallback();
  const resolved: AppSecrets = {
    DATABASE_URL: bitwardenSecrets?.DATABASE_URL || process.env.DATABASE_URL || localEnv.DATABASE_URL || '',
    DIRECT_URL: bitwardenSecrets?.DIRECT_URL || process.env.DIRECT_URL || localEnv.DIRECT_URL || '',
    UPSTASH_REDIS_REST_URL: bitwardenSecrets?.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || localEnv.UPSTASH_REDIS_REST_URL || '',
    UPSTASH_REDIS_REST_TOKEN: bitwardenSecrets?.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || localEnv.UPSTASH_REDIS_REST_TOKEN || '',
    R2_ACCOUNT_ID: bitwardenSecrets?.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || localEnv.R2_ACCOUNT_ID || '',
    R2_ENDPOINT: bitwardenSecrets?.R2_ENDPOINT || process.env.R2_ENDPOINT || localEnv.R2_ENDPOINT || '',
    R2_ACCESS_KEY_ID: bitwardenSecrets?.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || localEnv.R2_ACCESS_KEY_ID || '',
    R2_SECRET_ACCESS_KEY: bitwardenSecrets?.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || localEnv.R2_SECRET_ACCESS_KEY || '',
    R2_BUCKET_NAME: bitwardenSecrets?.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || localEnv.R2_BUCKET_NAME || 'prepinminutes-assets',
    DEEPGRAM_PROJECT_ID: bitwardenSecrets?.DEEPGRAM_PROJECT_ID || process.env.DEEPGRAM_PROJECT_ID || localEnv.DEEPGRAM_PROJECT_ID || '',
    DEEPGRAM_API_KEY: bitwardenSecrets?.DEEPGRAM_API_KEY || process.env.DEEPGRAM_API_KEY || localEnv.DEEPGRAM_API_KEY || '',
    CARTESIA_API_KEY: bitwardenSecrets?.CARTESIA_API_KEY || process.env.CARTESIA_API_KEY || localEnv.CARTESIA_API_KEY || '',
    GEMINI_API_KEY: bitwardenSecrets?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || localEnv.GEMINI_API_KEY || '',
    GOOGLE_AI_PROJECT_ID: bitwardenSecrets?.GOOGLE_AI_PROJECT_ID || process.env.GOOGLE_AI_PROJECT_ID || localEnv.GOOGLE_AI_PROJECT_ID || '',
    GOOGLE_AI_PROJECT_NUMBER: bitwardenSecrets?.GOOGLE_AI_PROJECT_NUMBER || process.env.GOOGLE_AI_PROJECT_NUMBER || localEnv.GOOGLE_AI_PROJECT_NUMBER || '',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: bitwardenSecrets?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || localEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
    CLERK_SECRET_KEY: bitwardenSecrets?.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY || localEnv.CLERK_SECRET_KEY || '',
  };

  if (bitwardenSecrets) {
    console.log('🔒 [SecretsResolver] Successfully hydrated credentials from Bitwarden Vault.');
  } else {
    console.log('📄 [SecretsResolver] Operating with local .env file fallback.');
  }

  cachedSecrets = resolved;
  return resolved;
}

/**
 * Synchronous accessor for process.env with fallback guarantees.
 */
export function getEnv(key: keyof AppSecrets, fallback = ''): string {
  if (cachedSecrets && cachedSecrets[key]) {
    return cachedSecrets[key];
  }
  return process.env[key] || fallback;
}
