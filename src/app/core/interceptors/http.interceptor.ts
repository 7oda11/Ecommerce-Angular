import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject, Injectable } from '@angular/core';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and set withCredentials to true
    const modifiedRequest = request.clone({
      withCredentials: true
    });

    // Only modify fetch in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const originalFetch = window.fetch;
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.startsWith('https://localhost')) {
          // For localhost requests, we'll use the original fetch
          return originalFetch(input, {
            ...init,
            // @ts-ignore
            rejectUnauthorized: false
          });
        }
        return originalFetch(input, init);
      };
    }

    return next.handle(modifiedRequest);
  }
}
