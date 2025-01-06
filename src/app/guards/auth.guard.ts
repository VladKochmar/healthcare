import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isTokenValid();

  if (!isLoggedIn) {
    router.navigate(['/log-in']);
    return false;
  }

  return true;
};
