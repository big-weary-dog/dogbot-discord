const REQUEST_TIMEOUT_MS = 5_000;

export const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
export const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`${url} responded with HTTP ${response.status}`);
  }
  return response.json();
}

function toImageUrl(value: unknown, source: string): string {
  if (typeof value !== 'string' || !value.startsWith('https://')) {
    throw new Error(`Unexpected response from ${source}: ${JSON.stringify(value)}`);
  }
  return value;
}

/** Fetches a random dog photo URL from dog.ceo, which responds with `{ "message": "<url>", "status": "success" }`. */
export async function fetchDogImageUrl(): Promise<string> {
  const body = await getJson(DOG_API_URL);
  const url = typeof body === 'object' && body !== null && 'message' in body ? body.message : undefined;
  return toImageUrl(url, 'dog.ceo');
}

/** Fetches a random cat photo URL from TheCatAPI, which responds with `[{ "id": "...", "url": "<url>", ... }]`. */
export async function fetchCatImageUrl(): Promise<string> {
  const body = await getJson(CAT_API_URL);
  const first: unknown = Array.isArray(body) ? body[0] : undefined;
  const url = typeof first === 'object' && first !== null && 'url' in first ? first.url : undefined;
  return toImageUrl(url, 'TheCatAPI');
}
