// lib/config.js
// Environment variables are optional; sensible defaults are provided for local dev.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://127.0.0.1:8000';

// Site URL and Name from environment (used for metadata and links)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Insurance';
