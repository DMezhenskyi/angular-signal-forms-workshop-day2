import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, switchMap, timer } from 'rxjs';
import { ERROR_ENDPOINT, ORDER_ENDPOINT } from './endpoints';
import { fail } from './fail';
import { SimulationMode } from './model';
import { SIMULATION_MODE } from './simulation-mode';

/**
 * Fakes the "save my order" service, but still performs a real HTTP request so
 * that you can watch it in the Network tab. The request is redirected to a
 * static endpoint and its response is replaced with the outcome selected
 * through the SIMULATION_MODE context token.
 */
export function fakeOrderBackendInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.method !== 'POST' || req.url !== `/order/save`) {
    return next(req);
  }

  const mode: SimulationMode = req.context.get(SIMULATION_MODE);
  const latency = 1000 + Math.random() * 2000;

  return timer(latency).pipe(switchMap(() => respond(req, next, mode)));
}

function respond(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  mode: SimulationMode,
): Observable<HttpEvent<unknown>> {
  const target = mode === 'server-error' ? ERROR_ENDPOINT : ORDER_ENDPOINT;

  return next(req.clone({ url: target })).pipe(
    switchMap((event) => (event instanceof HttpResponse ? outcome(req, mode) : of(event))),
    catchError(() => outcome(req, mode)),
  );
}

function outcome(req: HttpRequest<unknown>, mode: SimulationMode): Observable<HttpEvent<unknown>> {
  switch (mode) {
    case 'server-error':
      return fail(req, 500, 'Internal Server Error', {
        message: 'Something went wrong while saving your order.',
      });

    case 'field-error':
      return fail(req, 400, 'Bad Request', {
        message: 'Validation failed',
        fieldErrors: [
          {
            field: 'email',
            message: 'This email is already registered for the workshop.',
          },
        ],
      });

    default:
      return of(new HttpResponse({ status: 200, url: req.url, body: req.body }));
  }
}
