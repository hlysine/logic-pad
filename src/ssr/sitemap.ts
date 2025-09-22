import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';
import { SitemapEntry } from '../client/online/data';
import { api, axios } from '../client/online/api';

axios.defaults.baseURL = process.env.VITE_API_ENDPOINT as string;

export const isr = { expiration: 60 * 60 * 12 };

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Content-Type', 'text/xml');
  response.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  response.setHeader('X-Robots-Tag', 'index, follow');

  const smStream = new SitemapStream({ hostname: 'https://example.com/' });
  const pipeline = smStream.pipe(createGzip());

  // pipe your entries or directly write them.
  smStream.write({ url: '/', changefreq: 'hourly', priority: 1 });
  smStream.write({ url: '/create', changefreq: 'monthly', priority: 0.4 });
  smStream.write({ url: '/search/puzzles', changefreq: 'hourly', priority: 1 });
  smStream.write({ url: '/uploader', changefreq: 'monthly', priority: 0.3 });
  smStream.write({ url: '/rules', changefreq: 'monthly', priority: 0.2 });
  smStream.write({
    url: '/privacy-policy',
    changefreq: 'monthly',
    priority: 0.2,
  });
  smStream.write({ url: '/auth', changefreq: 'monthly', priority: 0.5 });

  let puzzles: SitemapEntry[] | null = null;
  let puzzleCount = 0;
  puzzlesLoop: while (puzzles === null || puzzles.length > 0) {
    puzzles = await api.listSitemap('puzzles', undefined, puzzles?.at(-1)?.id);
    for (const puzzle of puzzles) {
      smStream.write({
        url: `/solve/${puzzle.id}`,
        lastmod: puzzle.updatedAt,
        changefreq: 'monthly',
        priority: 0.6,
      });
      puzzleCount++;
      if (puzzleCount >= 25000) break puzzlesLoop;
    }
  }

  let collections: SitemapEntry[] | null = null;
  let collectionCount = 0;
  collectionsLoop: while (collections === null || collections.length > 0) {
    collections = await api.listSitemap(
      'collections',
      undefined,
      collections?.at(-1)?.id
    );
    for (const collection of collections) {
      smStream.write({
        url: `/collection/${collection.id}`,
        lastmod: collection.updatedAt,
        changefreq: 'monthly',
        priority: 0.5,
      });
      collectionCount++;
      if (collectionCount >= 10000) break collectionsLoop;
    }
  }

  let users: SitemapEntry[] | null = null;
  let userCount = 0;
  usersLoop: while (users === null || users.length > 0) {
    users = await api.listSitemap('users', undefined, users?.at(-1)?.id);
    for (const user of users) {
      smStream.write({
        url: `/user/${user.id}`,
        lastmod: user.updatedAt,
        changefreq: 'monthly',
        priority: 0.4,
      });
      userCount++;
      if (userCount >= 10000) break usersLoop;
    }
  }

  // make sure to attach a write stream such as streamToPromise before ending
  smStream.end();
  // stream write the response
  return pipeline.pipe(response);
}
