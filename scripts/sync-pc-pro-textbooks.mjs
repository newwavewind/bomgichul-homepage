import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const exams = [
  { site: 'real-estate', directory: '', prefix: 'civil' },
  { site: 'police', directory: 'police', prefix: 'police' },
  { site: 'firefighter', directory: 'firefighter', prefix: 'fire' },
];
if (process.argv.length !== 5) throw new Error('Pass the current real-estate, police and firefighter source directories in that order.');
const output = 'data/pc-pro-textbooks';
await mkdir(output, { recursive: true });

for (const [index, { site, directory, prefix }] of exams.entries()) {
  const app = path.resolve(process.argv[index + 2]);
  const manifestDir = path.join('src/components/lectures', directory);
  const load = async name => JSON.parse(await readFile(path.join(manifestDir, name), 'utf8'));
  const outline = await load('outline.json');
  const publicManifest = await load('textbooks.json');
  const appBooks = (await import(pathToFileURL(path.join(app, 'src/data/concepts/lectureBooks.js')))).LECTURE_BOOKS;
  const books = {};
  const missing = [];
  for (const group of outline) for (const part of group.parts) for (const section of part.sections) for (const lesson of section.lessons) {
    if (lesson.number <= 3 || !lesson.ready) continue;
    const publicBook = publicManifest.books[lesson.id];
    const sourceId = lesson.sourceId ?? lesson.id.replace(/^(police|fire)-/, '');
    const book = appBooks[sourceId];
    if (!book) { missing.push(lesson.id); continue; }
    if (!publicBook || publicBook.url || publicBook.sha256 !== book.sha256 || publicBook.pages !== book.pages) {
      throw new Error(site + ' textbook index mismatch: ' + lesson.id);
    }
    const url = new URL(book.remotePath);
    if (url.origin !== 'https://pub-018addf460ef45fcad17018a675217b0.r2.dev' ||
        !url.pathname.startsWith('/textbooks/' + prefix + '/') ||
        !url.pathname.includes('/' + book.sha256 + '/') || !url.pathname.endsWith('.pdf')) {
      throw new Error(site + ' textbook origin or hash invalid: ' + lesson.id);
    }
    books[lesson.id] = { sha256: book.sha256, path: url.pathname };
  }
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: app, encoding: 'utf8' }).trim();
  await writeFile(path.join(output, site + '.json'), JSON.stringify({ sourceCommit, books }, null, 2) + '\n');
  console.log(site, Object.keys(books).length, 'Pro textbooks', missing.length, 'lectures have no registered PDF');
}
