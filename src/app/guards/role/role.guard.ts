import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isDoctorRole = authService.hasDoctorRole();

  if (!isDoctorRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
