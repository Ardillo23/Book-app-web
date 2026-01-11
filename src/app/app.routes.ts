import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },

  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search').then(m => m.Search),
  },

  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites').then(m => m.Favorites),
  },

  { path: '**', redirectTo: 'search' },
];
