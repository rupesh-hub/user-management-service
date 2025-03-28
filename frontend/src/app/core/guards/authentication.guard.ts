import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {JwtTokenValidatorService} from '../services/jwt-token-validator.service';
import {map, take} from 'rxjs/operators';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const tokenService = inject(JwtTokenValidatorService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      const url = state.url;
      const expectedRoles = route.data?.['roles'] as string[] || [];

      if (!isAuthenticated) {
        if (isProtectedRoute(url)) {
          return router.createUrlTree(['/login']);
        }
        return true;
      }

      const userRoles = tokenService.getAuthorities();

      // Check if user has any of the expected roles
      if (expectedRoles.length > 0 && !expectedRoles.some(role => userRoles.includes(role))) {
        return router.createUrlTree(['/unauthorized']);
      }

      // ONLY BLOCK USERS FROM ADMIN ROUTES (Admins can access both)
      if (userRoles.includes('user') && url.startsWith('/admin')) {
        return router.createUrlTree(['/users/profile']); // ✅ Blocks user from admin routes
      }

      return true;
    })
  );
};

// Helper function to check protected routes
const isProtectedRoute = (url: string): boolean => {
  const protectedRoutes = ['/admin', '/users'];
  return protectedRoutes.some(route => url.startsWith(route));
};
