import { InjectionToken, Provider } from '@angular/core';

export const API_URL_TOKEN: InjectionToken<string> = new InjectionToken<string>('API_URL');

export function provideApiUrl(): Provider {
  return { provide: API_URL_TOKEN, useValue: 'https://swapi.tech/api/' };
}
