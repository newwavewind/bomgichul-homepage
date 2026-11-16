import { lazy } from 'react';
export const policePlayers = {
  'police-hnU101_1': lazy(() => import('./players/hnU101_1')),
  'police-hnU101_2': lazy(() => import('./players/hnU101_2')),
  'police-hnU101_3': lazy(() => import('./players/hnU101_3')),
  'police-hsU101_1': lazy(() => import('./players/hsU101_1')),
  'police-hsU101_2': lazy(() => import('./players/hsU101_2')),
  'police-hsU101_3': lazy(() => import('./players/hsU101_3')),
  'police-gcU101_1': lazy(() => import('./players/gcU101_1')),
  'police-gcU101_2': lazy(() => import('./players/gcU101_2')),
  'police-gcU101_3': lazy(() => import('./players/gcU101_3')),
};
