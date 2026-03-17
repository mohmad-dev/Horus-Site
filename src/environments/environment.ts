export const environment = {
  production: false,
  /**
   * Base URL for the API (no trailing slash).
   * - Local dev (Angular + Express SSR same origin): leave as empty string.
   * - Separate API host: e.g. 'http://localhost:4000'
   */
  apiBaseUrl: '',
} as const;

