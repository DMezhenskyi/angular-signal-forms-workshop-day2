import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { fakeCompanyTaxInfoBackendInterceptor } from '@core/http/fake-company-tax-info-backend';
import { fakeEmailBackendInterceptor } from '@core/http/fake-email-backend';
import { fakeOrderBackendInterceptor } from '@core/http/fake-order-backend';
import { fakeVatBackendInterceptor } from '@core/http/fake-vat-backend';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        fakeOrderBackendInterceptor,
        fakeVatBackendInterceptor,
        fakeEmailBackendInterceptor,
        fakeCompanyTaxInfoBackendInterceptor,
      ]),
    ),
  ],
};
