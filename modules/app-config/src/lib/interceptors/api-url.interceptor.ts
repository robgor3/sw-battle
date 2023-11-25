import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '../providers/provide-api-url';

export const apiUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const apiBaseUrl: string = inject(API_URL_TOKEN);
  const endpoint: string = req.url.startsWith('/') ? req.url.substring(1) : req.url;

  const request: HttpRequest<unknown> = req.clone({
    url: `${apiBaseUrl}${endpoint}`,
  });

  return next(request);
};
