import { lazy } from 'react';
export const firefighterPlayers = {
  'fire-sbU101_1': lazy(() => import('./players/sbU101_1')),
  'fire-sbU101_3': lazy(() => import('./players/sbU101_3')),
  'fire-sbU101_4': lazy(() => import('./players/sbU101_4')),
  'fire-slU101_1': lazy(() => import('./players/slU101_1')),
  'fire-slU101_2': lazy(() => import('./players/slU101_2')),
  'fire-slU101_3': lazy(() => import('./players/slU101_3')),
  'fire-haU101': lazy(() => import('./players/haU101')),
  'fire-haU102': lazy(() => import('./players/haU102')),
  'fire-haU103': lazy(() => import('./players/haU103')),
};
