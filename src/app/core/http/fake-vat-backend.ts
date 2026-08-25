import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { ERROR_ENDPOINT, VAT_ENDPOINT } from './endpoints';
import { fail } from './fail';
import { VatSimulationMode, VatVerification } from './model';
import { VAT_SIMULATION_MODE } from './simulation-mode';

/**
 * Fakes the VAT verification service, but still performs a real HTTP request so
 * that you can watch it in the Network tab. The request is redirected to a
 * static endpoint and its response body is replaced with the outcome selected
 * through the VAT_SIMULATION_MODE context token.
 */
export function fakeVatBackendInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.method !== 'GET' || req.url.split('?')[0] !== `/company/tax/verify`) {
    return next(req);
  }

  const mode: VatSimulationMode = req.context.get(VAT_SIMULATION_MODE);
  const latency = 400 + Math.random() * 600;

  return timer(latency).pipe(switchMap(() => respond(req, next, mode)));
}

function respond(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  mode: VatSimulationMode,
): Observable<HttpEvent<unknown>> {
  const target = mode === 'server-error' ? ERROR_ENDPOINT : VAT_ENDPOINT;

  return next(req.clone({ url: withQueryOf(req, target) })).pipe(
    map((event) => (event instanceof HttpResponse ? event.clone({ body: bodyFor(mode) }) : event)),
    catchError(() => {
      if (mode === 'server-error') {
        return fail(req, 500, 'Internal Server Error', {
          message: 'VAT verification service is temporarily unavailable.',
        });
      }

      // Offline or expired endpoint: keep the workshop going with a fake response.
      return of(new HttpResponse({ status: 200, url: req.url, body: bodyFor(mode) }));
    }),
  );
}

function bodyFor(mode: VatSimulationMode): VatVerification {
  return mode === 'invalid'
    ? { valid: false, reason: 'VAT ID not found in the VIES registry.' }
    : { valid: true, companyName: 'Acme GmbH' };
}

/** Keeps the caller's query string visible on the redirected request. */
function withQueryOf(req: HttpRequest<unknown>, target: string): string {
  const [, query] = req.url.split('?');
  return query ? `${target}?${query}` : target;
}
