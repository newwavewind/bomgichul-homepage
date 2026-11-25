import 'server-only';
import realEstateBooks from '../../../data/pc-pro-textbooks/real-estate.json';
import policeBooks from '../../../data/pc-pro-textbooks/police.json';
import firefighterBooks from '../../../data/pc-pro-textbooks/firefighter.json';
import { pcSite, type PcSubject } from './catalog';

const textbooks: Record<string, { books: Record<string, { sha256: string; path: string }> }> = {
  'real-estate': realEstateBooks, police: policeBooks, firefighter: firefighterBooks,
};
const origin = 'https://pub-018addf460ef45fcad17018a675217b0.r2.dev';

export function proTextbookUrl(subject: PcSubject, lecture: string) {
  const site = pcSite(subject);
  if (!site) return null;
  const { books } = textbooks[site];
  if (!Object.hasOwn(books, lecture)) return null;
  const book = books[lecture];
  const url = new URL(book.path, origin);
  if (url.origin !== origin || !url.pathname.startsWith('/textbooks/') ||
      !url.pathname.includes('/' + book.sha256 + '/') || !url.pathname.endsWith('.pdf')) return null;
  return url;
}
