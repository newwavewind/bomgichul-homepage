import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import type { ExamSourcePreview } from '@/lib/exam-source-preview';

const decompress = promisify(gunzip);
let catalog: Promise<Record<string, ExamSourcePreview>> | undefined;

function readCatalog() {
  catalog ??= readFile(path.join(process.cwd(), 'data', 'exam-source-previews.json.gz'))
    .then(buffer => decompress(buffer))
    .then(buffer => JSON.parse(buffer.toString('utf8')))
    .catch(error => {
      catalog = undefined;
      throw error;
    });
  return catalog;
}

export async function GET(request: Request) {
  const keys = new URL(request.url).searchParams.getAll('key');
  if (!keys.length || keys.length > 30 || keys.some(key => !key || key.length > 180)) {
    return Response.json({ previews: {} }, { status: 400 });
  }
  try {
    const source = await readCatalog();
    const previews = Object.fromEntries(keys.flatMap(key => Object.hasOwn(source, key) ? [[key, source[key]]] : []));
    return Response.json({ previews }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
  } catch {
    return Response.json({ previews: {} }, { status: 503 });
  }
}
