import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managementGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (authService.isAuthenticated() && (user?.role === 'ADMIN' || user?.role === 'CTV')) {
        return true;
    }

    router.navigate(['/auth/login']);
    return false;
};
