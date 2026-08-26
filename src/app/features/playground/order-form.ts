import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { disabled, email, form, FormField, max, min, required, provideSignalFormsConfig, applyEach, maxLength, hidden, pattern, validate, validateTree, validateHttp, validateAsync, debounce, FormRoot, apply } from '@angular/forms/signals';
import { inspectFormState } from '@features/form-inspector/form-connector';

import { INITIAL_ORDER_VALUES, Order } from './order';
import { OrderApi } from './order-api';
import { EMAIL_SIMULATION_MODE, VAT_SIMULATION_MODE } from '@core/http/simulation-mode';
import { ApiError } from '@core/http/model';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Attendee } from './attendee/attendee';
import { TAX_ID_RULES, VatCheckResult } from './company/company';
import { EmailCheckResult } from './customer/customer';
import { CustomerForm } from './customer/customer-form';
import { CompanyForm } from './company/company-form';
import { AttendeeConfiguratorForm } from './attendee/attendee-configurator/attendee-configurator-form';
import { customerFormSchema } from './customer/customer-form-schema';

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
      required(path.attendees.count, { message: `This field is required` });
      min(path.attendees.count, 1, { message: (ctx) => `Minimum ${ctx.state.min?.()} attendee` });
      max(path.attendees.count, 10, {
        message: ({ value, state }) => `${value()} attendees? We only have ${state.max?.()} seats`,
      });
      applyEach(path.attendees.list, (attendeePath) => {
        required(attendeePath.email, { message: `Attendee email is required` });
        email(attendeePath.email, { message: `Enter a valid email address` });
      })
      maxLength(path.attendees.list,
        ({ valueOf }) => valueOf(path.attendees.count) ?? undefined,
        {
          message: ({ state }) => `You can only add ${state.maxLength?.()} attendees`,
        }
      ),
      validateTree(path.attendees.list, (ctx) => {
        const duplicatedEmailIndexes = findDuplicateEmails(ctx.value());
        
        // No duplicates found, exit validation with success
        if (duplicatedEmailIndexes.length === 0) {
          return;
        }

        const duplicatedEmailErrors = duplicatedEmailIndexes
          .map((index) => ({
            kind: 'duplicated-attendee',
            message: `This attendee is already added`,
            fieldTree: ctx.fieldTree[index]?.email,
        }));
        
        return [
          ...duplicatedEmailErrors,
          {
            kind: 'duplicates-in-list',
            message: `The list contains duplicated emails`,
            fieldTree: ctx.fieldTree,
          }
        ];
      }),
      hidden(path.company, {
        when: ({ valueOf }) => !valueOf(path.businessPurchase),
      });
      required(path.company.name,
        {
          when: ({ valueOf }) => valueOf(path.businessPurchase),
          message: `This field is required`
        }
      );
      pattern(path.company.taxId, ({valueOf}) => {
        const country = valueOf(path.company.country);
        const TAX_ID_KEY = ['AT', 'DE', 'CH'].includes(country) ? 'EU_VAT' : country;
        return TAX_ID_RULES[TAX_ID_KEY]?.pattern;
      }, {
        message: `Doesn't match the format`,
      }),
      validate(path.company.taxId, (ctx) => {
        const countryPrefix = ctx.valueOf(path.company.country);

        // Not an EU/VAT country, no need to validate
        if (!['AT', 'DE', 'CH'].includes(countryPrefix)) {
          return;
        }
        // Empty value is the job of required(), not of this validator
        if (!ctx.value()) {
          return;
        }
        // VAT starts with a proper country ISO code -> exit validation with success
        if (ctx.value().toUpperCase().startsWith(countryPrefix)) {
          return;
        }
        
        return {
          kind: 'vat-starts-with',
          message: `VAT should start with country ISO code ${countryPrefix}`,
        }
      }),
      disabled(path.company.taxId, {
        when: ({ valueOf }) => {
          const country = valueOf(path.company.country);
          return country === 'OTHER' ? `B2B purchase isn't available for other countries` : false;
        }
      });
      hidden(path.company.taxId, {
        when: ({ valueOf }) => valueOf(path.company.country) === '',
      });
      debounce(path.company.taxId, 'blur'),
      validateHttp<string, VatCheckResult>(path.company.taxId, {
        request: (ctx) => {
          return ({
            url: `/company/tax/verify?country=${ctx.valueOf(path.company.country)}&taxId=${ctx.value()}`,
            context: new HttpContext().set(VAT_SIMULATION_MODE, 'valid')
          })
        },
        onSuccess: (result) => {
          if (!result.valid) {
            return ({
              kind: 'tax-registry-not-found',
              message: result.reason ?? `No such Tax ID in the registry`,
            });
          }
          return;
        },
        onError: () => {
          return ({
            kind: 'tax-registry-network-error',
            message: `Network error while checking the Tax ID registry`,
          })
        },
        when: (ctx) => !!ctx.value() && ['AT', 'DE', 'CH'].includes(ctx.valueOf(path.company.country))
      })
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

export function findDuplicateEmails(attendees: Attendee[]): number[] {
  const emails = attendees.map((a) => a.email.toLowerCase());
  const duplicates: number[] = [];

  emails.forEach((email, index) => {
    if (email && emails.indexOf(email) !== index) {
      duplicates.push(index);
    }
  });

  return duplicates;
}