import { afterEach, describe, expect, it, vi } from 'vitest';
import { CAT_API_URL, DOG_API_URL, fetchCatImageUrl, fetchDogImageUrl } from './animals.js';

function stubFetch(body: unknown, init: ResponseInit = { status: 200 }) {
  const fetchMock = vi.fn(async () => Response.json(body, init));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchDogImageUrl', () => {
  it('returns the image URL from dog.ceo', async () => {
    const url = 'https://images.dog.ceo/breeds/pug/n02110958_1975.jpg';
    const fetchMock = stubFetch({ message: url, status: 'success' });

    await expect(fetchDogImageUrl()).resolves.toBe(url);
    expect(fetchMock).toHaveBeenCalledWith(DOG_API_URL, expect.anything());
  });

  it('throws on an HTTP error', async () => {
    stubFetch({ message: 'Not found', status: 'error' }, { status: 500 });
    await expect(fetchDogImageUrl()).rejects.toThrow('HTTP 500');
  });

  it.each([{}, { message: 42 }, { message: 'http://insecure.example/dog.jpg' }, null, []])(
    'throws on an unexpected body: %j',
    async (body) => {
      stubFetch(body);
      await expect(fetchDogImageUrl()).rejects.toThrow('Unexpected response from dog.ceo');
    },
  );
});

describe('fetchCatImageUrl', () => {
  it('returns the first image URL from TheCatAPI', async () => {
    const url = 'https://cdn2.thecatapi.com/images/abc.jpg';
    const fetchMock = stubFetch([{ id: 'abc', url, width: 800, height: 600 }]);

    await expect(fetchCatImageUrl()).resolves.toBe(url);
    expect(fetchMock).toHaveBeenCalledWith(CAT_API_URL, expect.anything());
  });

  it('throws on an HTTP error', async () => {
    stubFetch([], { status: 429 });
    await expect(fetchCatImageUrl()).rejects.toThrow('HTTP 429');
  });

  it.each([[], [{}], [{ url: null }], { url: 'https://cdn2.thecatapi.com/images/abc.jpg' }, null])(
    'throws on an unexpected body: %j',
    async (body) => {
      stubFetch(body);
      await expect(fetchCatImageUrl()).rejects.toThrow('Unexpected response from TheCatAPI');
    },
  );
});
