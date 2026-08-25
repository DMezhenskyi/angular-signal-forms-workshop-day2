import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { ORDER_ENDPOINT } from './endpoints';
import { fail } from './fail';
import { CompanyTaxInfo } from './model';

/**
 * Fakes the company lookup behind a VAT ID, but still performs a real HTTP
 * request so that you can watch it in the Network tab. The request is
 * redirected to a static endpoint and its response body is replaced with the
 * company registered for the VAT ID from the query string.
 */
export function fakeCompanyTaxInfoBackendInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.method !== 'GET' || req.url.split('?')[0] !== `/company/tax-info`) {
    return next(req);
  }

  const latency = 400 + Math.random() * 600;

  return timer(latency).pipe(switchMap(() => respond(req, next)));
}

/** The only VAT IDs the fake registry knows about. */
const COMPANIES: Record<string, CompanyTaxInfo> = {
  ATU11111111: {
    name: 'Acme GmbH',
    address: 'Mariahilfer Straße 12, Vienna',
    postalCode: '1070',
  },
  DE123456789: {
    name: 'Acme Deutschland GmbH',
    address: 'Torstraße 45, Berlin',
    postalCode: '10119',
  },
};

function respond(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const company = COMPANIES[vatIdOf(req)];

  if (!company) {
    return fail(req, 404, 'Not Found', {
      message: 'No company is registered for this VAT ID.',
    });
  }

  return next(req.clone({ url: withQueryOf(req, ORDER_ENDPOINT) })).pipe(
    map((event) => (event instanceof HttpResponse ? event.clone({ body: company }) : event)),
    // Offline or expired endpoint: keep the workshop going with a fake response.
    catchError(() => of(new HttpResponse({ status: 200, url: req.url, body: company }))),
  );
}

/** Reads the VAT ID from the `vat` query param, e.g. `?vat=AT1234567890`. */
function vatIdOf(req: HttpRequest<unknown>): string {
  const [, query] = req.url.split('?');
  return new URLSearchParams(query ?? '').get('vat')?.toUpperCase() ?? '';
}

/** Keeps the caller's query string visible on the redirected request. */
function withQueryOf(req: HttpRequest<unknown>, target: string): string {
  const [, query] = req.url.split('?');
  return query ? `${target}?${query}` : target;
}
