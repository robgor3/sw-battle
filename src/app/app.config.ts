import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
// TODO remove if unused
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { apiUrlInterceptor, provideApiUrl } from '@sw-battle/app-config';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideApiUrl(),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor])),
  ],
};
