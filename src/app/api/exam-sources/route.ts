import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import type { ExamSourcePreview } from '@/lib/exam-source-preview';

const decompress = promisify(gunzip);
const catalogues = new Map<string, Promise<Record<string, ExamSourcePreview>>>();

function readCatalogue(filename: string) {
  const cached = catalogues.get(filename);
  if (cached) return cached;
  const catalogue: Promise<Record<string, ExamSourcePreview>> = readFile(path.join(process.cwd(), 'data', filename))
    .then(buffer => decompress(buffer))
    .then(buffer => JSON.parse(buffer.toString('utf8')))
    .catch(error => {
      catalogues.delete(filename);
      throw error;
    });
  catalogues.set(filename, catalogue);
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
    const groups = await Promise.all([
      { keys: historyKeys, filename: 'history-source-previews.json.gz' },
      { keys: lawKeys, filename: 'exam-source-previews.json.gz' },
    ].map(async ({ keys, filename }) => {
      if (!keys.length) return [];
      const source = await readCatalogue(filename);
      return keys.flatMap(key => Object.hasOwn(source, key) ? [[key, source[key]]] : []);
    }));
    const previews = Object.fromEntries(groups.flat());
    return Response.json({ previews }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
  } catch {
    return Response.json({ previews: {} }, { status: 503 });
  }
}
