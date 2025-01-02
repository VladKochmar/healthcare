import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sing-up/sing-up.component').then(
        (m) => m.SingUpComponent
      ),
  },
  {
    path: 'log-in',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
