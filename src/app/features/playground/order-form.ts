import { Component, computed, effect, inject, input, linkedSignal, output, signal, untracked } from '@angular/core';
import { form, FormField, provideSignalFormsConfig, hidden, FormRoot, apply, applyWhen, readonly, disabled } from '@angular/forms/signals';
import { inspectFormState } from '@features/form-inspector/form-connector';

import { Toggle } from '@shared/toggle/toggle';
import { OptionPicker } from '@shared/option-picker/option-picker';
import { BASE_LOCATIONS, BUSINESS_LOCATIONS, INITIAL_ORDER_VALUES, Order } from './order';

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
  imports: [FormField, FormRoot, CustomerForm, CompanyForm, AttendeeConfiguratorForm, Toggle, OptionPicker],
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
      readonly(path.location, {
        when: ({valueOf}) => Number(valueOf(path.attendees.count)) < 5
      });
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

  protected readonly locations = computed(() =>
    this.form.businessPurchase().value()
      ? [...BASE_LOCATIONS, ...BUSINESS_LOCATIONS]
      : BASE_LOCATIONS,
  );
  constructor() {
    inspectFormState(this.form);

    effect(() => {
      const locations = this.locations();

      untracked(() => {
        const current = this.form.location().value();
        if (!locations.some((l) => l.value === current)) {
          this.form.location().value.set(locations[0].value);
        }
      });
    })
  }
}