// lib/config.js
// Require API base URL from environment (no hardcoded fallback)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_API_URL) in environment"
  );
}

// Site URL and Name from environment (used for metadata and links)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
