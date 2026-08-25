import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiError } from './model';

export function fail(
  req: HttpRequest<unknown>,
  status: number,
  statusText: string,
  error: ApiError,
): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status, statusText, url: req.url, error }));
}
