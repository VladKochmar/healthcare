import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role/role.guard';

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
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'your-services',
    loadComponent: () =>
      import('./pages/doctor-services/doctor-services.component').then(
        (m) => m.DoctorServicesComponent
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'service-editor/:id',
    loadComponent: () =>
      import('./pages/service-editor/service-editor.component').then(
        (m) => m.ServiceEditorComponent
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'service-editor',
    loadComponent: () =>
      import('./pages/service-editor/service-editor.component').then(
        (m) => m.ServiceEditorComponent
      ),
    canActivate: [authGuard, roleGuard],
  },
];
