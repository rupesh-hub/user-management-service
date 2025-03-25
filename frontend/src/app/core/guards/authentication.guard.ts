import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { JwtTokenValidatorService } from '../services/jwt-token-validator.service';
import { map, take } from 'rxjs/operators';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const tokenService = inject(JwtTokenValidatorService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1), // Ensure the guard completes after one emission
    map((isAuthenticated) => {
      const url = state.url;
      const expectedRoles = route.data['roles'] as string[] || []; // Get required roles from route data

      // 1. Handle unauthenticated users trying to access protected routes
      if (!isAuthenticated && isProtectedRoute(url)) {
        router.navigateByUrl('/login');
        return false;
      }

      // 2. Handle authenticated users
      if (isAuthenticated) {
        const userRoles = tokenService.getAuthorities();

        // 2a. Redirect users with specific roles (if needed)
        if (userRoles.includes('admin') && !url.startsWith('/admin')) {
          router.navigateByUrl('/admin/dashboard');
          return false;
        } else if (userRoles.includes('user') && !url.startsWith('/users')) {
          router.navigateByUrl('/users/profile');
          return false;
        }

        // 2b. Check route permissions (if route has required roles)
        if (expectedRoles.length > 0 && !expectedRoles.some(role => userRoles.includes(role))) {
          router.navigateByUrl('/unauthorized');
          return false;
        }
      }

      // 3. Allow access in all other cases
      return true;
    })
  );
};

// Helper function to check protected routes
const isProtectedRoute = (url: string): boolean => {
  const protectedRoutes = ['/admin', '/users'];
  return protectedRoutes.some(route => url.startsWith(route));
};
