/**
 * URLs for the hero scene's static assets.
 *
 * The `v` query is the cache-busting version. The Cloudflare worker caches any
 * /hero/ file that carries it for a year (immutable), so after replacing an
 * image or regenerating the character frames, bump HERO_ASSET_VERSION.
 */
export const HERO_ASSET_VERSION = "1";

export const HERO_BG_URL = `/hero/bg.webp?v=${HERO_ASSET_VERSION}`;

export const heroFrameUrl = (i: number) =>
  `/hero/char/c${String(i).padStart(3, "0")}.avif?v=${HERO_ASSET_VERSION}`;
