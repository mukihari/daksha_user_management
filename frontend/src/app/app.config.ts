import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next(cloned);
        }
        return next(req);
      }
    ]))
  ]
};
