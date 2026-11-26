import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import type { ExamSourcePreview } from '@/lib/exam-source-preview';

const decompress = promisify(gunzip);
type Collection = 'history' | 'law';
const catalogues = new Map<Collection, Promise<Record<string, ExamSourcePreview>>>();

function readCatalogue(collection: Collection) {
  const cached = catalogues.get(collection);
  if (cached) return cached;
  const archive = collection === 'history'
    ? readFile(path.join(process.cwd(), 'data', 'history-source-previews.json.gz'))
    : readFile(path.join(process.cwd(), 'data', 'exam-source-previews.json.gz'));
  const catalogue: Promise<Record<string, ExamSourcePreview>> = archive
    .then(buffer => decompress(buffer))
    .then(buffer => JSON.parse(buffer.toString('utf8')))
    .catch(error => {
      catalogues.delete(collection);
      throw error;
    });
  catalogues.set(collection, catalogue);
  return catalogue;
}

export async function GET(request: Request) {
  const keys = new URL(request.url).searchParams.getAll('key');
  if (!keys.length || keys.length > 30 || keys.some(key => !key || key.length > 180)) {
    return Response.json({ previews: {} }, { status: 400 });
  }
  try {
    const historyKeys = keys.filter(key => key.startsWith('aks:'));
    const lawKeys = keys.filter(key => !key.startsWith('aks:'));
    const collections = [
      { keys: historyKeys, collection: 'history' },
      { keys: lawKeys, collection: 'law' },
    ] as const;
    const groups = await Promise.all(collections.map(async ({ keys, collection }) => {
      if (!keys.length) return [];
      const source = await readCatalogue(collection);
      return keys.flatMap(key => Object.hasOwn(source, key) ? [[key, source[key]] as const] : []);
    }));
    const previews = Object.fromEntries(groups.flat());
    return Response.json({ previews }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
  } catch {
    return Response.json({ previews: {} }, { status: 503 });
  }
}
