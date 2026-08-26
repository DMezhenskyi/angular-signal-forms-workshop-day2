import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { form, FormField, provideSignalFormsConfig, hidden, FormRoot, apply, applyWhen } from '@angular/forms/signals';
import { inspectFormState } from '@features/form-inspector/form-connector';

import { INITIAL_ORDER_VALUES, Order } from './order';
import { OrderApi } from './order-api';
import { ApiError } from '@core/http/model';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerForm } from './customer/customer-form';
import { CompanyForm } from './company/company-form';
import { AttendeeConfiguratorForm } from './attendee/attendee-configurator/attendee-configurator-form';
import { customerFormSchema } from './customer/customer-form-schema';
import { attendeeConfiguratorFormSchema } from './attendee/attendee-configurator/attendee-configurator-form-schema';
import { companyBusinessPurchaseSchema, companyFormSchema } from './company/company-form-schema';

@Component({
  selector: 'df-order-form',
  styleUrls: ['./order-form.scss', './form-core.scss'],
  templateUrl: './order-form.html',
  imports: [FormField, FormRoot, CustomerForm, CompanyForm, AttendeeConfiguratorForm],
  providers: [
    provideSignalFormsConfig({
      classes: {
        'invalid': ({ state }) => state().touched() && state().invalid(), 
      },
    }),
  ],
})
export class OrderForm {
  readonly order = input<Order>();
  readonly submitted = output<Order>();

  #orderApi = inject(OrderApi);

  #model = linkedSignal(
    () => this.order() ?? structuredClone(INITIAL_ORDER_VALUES)
  );

  protected readonly form = form(
    this.#model, (path) => {
      apply(path.customer, customerFormSchema);
      apply(path.attendees, attendeeConfiguratorFormSchema);
      hidden(path.company, {
        when: ({ valueOf }) => !valueOf(path.businessPurchase),
      });
      apply(path.company, companyFormSchema);
      applyWhen(path.company, 
        ({ valueOf }) => valueOf(path.businessPurchase),
        companyBusinessPurchaseSchema
      );
    }, {
      submission: {
        action: async (form) => {
          try {
            const result = await this.#orderApi.save(form().value(), 'server-error');
            this.submitted.emit(result);
            form().reset();
            return
          } catch(error: unknown) {
            if (error instanceof HttpErrorResponse) {
              const apiError = error.error as ApiError | null;
              return {
                kind: 'server-error',
                message: apiError?.message ?? `Server Error. Try again later.`,
              };
            }
            return {
              kind: 'unknown-error',
              message: `Unknown error. Try again later.`,
            };
          }
        },
        onInvalid: (form) => {
          form().errorSummary()[0].fieldTree().focusBoundControl();
        },
      }
    }
  );

  protected readonly buttonText = computed(() => this.form().submitting() ? `Submitting...` : `Submit`);

  constructor() {
    inspectFormState(this.form);
  }
}