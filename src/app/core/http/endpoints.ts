/**
 * Real endpoints the fake backends proxy to, so that every simulated call is
 * still a genuine request you can inspect in the browser's Network tab.
 *
 * They return static payloads — the interceptors override the response body to
 * simulate the different outcomes.
 *
 * Heads up: dummyjson custom endpoints expire 90 days after creation
 * (these ones on 2026-11-16). Re-create them and swap the URLs here.
 */
export const VAT_ENDPOINT = 'https://dummyjson.com/c/174e-5a7b-4131-bed2';

export const EMAIL_ENDPOINT = 'https://dummyjson.com/c/e8f6-2a9b-4d44-a6b3';

/** Always answers with a real 200, used for calls without a static payload. */
export const ORDER_ENDPOINT = 'https://dummyjson.com/http/200';

/** Always answers with a real 500, used to simulate a broken service. */
export const ERROR_ENDPOINT = 'https://dummyjson.com/http/500';
