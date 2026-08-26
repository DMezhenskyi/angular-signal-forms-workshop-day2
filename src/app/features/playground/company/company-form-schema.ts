import { debounce, disabled, hidden, pattern, required, schema, validate, validateHttp } from '@angular/forms/signals';
import { Company, TAX_ID_RULES, VatCheckResult } from './company';
import { HttpContext } from '@angular/common/http';
import { VAT_SIMULATION_MODE } from '@core/http/simulation-mode';
import { startWithValidator } from '../start-with-validator';

export const companyFormSchema = schema<Company>((p) => {
  pattern(p.taxId, ({ valueOf }) => {
    const country = valueOf(p.country);
    const TAX_ID_KEY = ['AT', 'DE', 'CH'].includes(country) ? 'EU_VAT' : country;
    return TAX_ID_RULES[TAX_ID_KEY]?.pattern;
  }, {
    message: `Doesn't match the format`,
  });

  /*
    TODO: Task 1: Extract the prefix check into a reusable validator (~6 min)

    Problem: the `validate()` block below is generic logic, locked in this schema.

    Your job:
      - Fill the empty `validate()` in ../start-with-validator.ts: report an
        error when the value does not start with `startWith`. Ignore case.
        Skip empty values, they are the job of `required()`.
      - Call it here with a fixed prefix: replace 'TODO' with 'AT'.
      - Keep the old `validate()` block. You delete it in Task 3.

    Check: Business Purchase on, Germany, `DE123456`, click outside -> you see
    your new error. The old check stays quiet.

    Next: Task 2 in ../start-with-validator.ts

    References:
      - https://angular.dev/guide/forms/signals/validation#reusable-validation-rules
      - https://angular.dev/guide/forms/signals/validation#using-validate
  */
  startWithValidator(p.taxId, 'TODO');
  
  validate(p.taxId, (ctx) => {
    const countryPrefix = ctx.valueOf(p.country);

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
  });
  disabled(p.taxId, {
    when: ({ valueOf }) => {
      const country = valueOf(p.country);
      return country === 'OTHER' ? `B2B purchase isn't available for other countries` : false;
    }
  });
  hidden(p.taxId, {
    when: ({ valueOf }) => valueOf(p.country) === '',
  });
});

export const companyBusinessPurchaseSchema = schema<Company>((p) => {
  required(p.name, { message: `This field is required` });
  debounce(p.taxId, 'blur');
  validateHttp<string, VatCheckResult>(p.taxId, {
    request: (ctx) => {
      return ({
        url: `/company/tax/verify?country=${ctx.valueOf(p.country)}&taxId=${ctx.value()}`,
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
    when: (ctx) => !!ctx.value() && ['AT', 'DE', 'CH'].includes(ctx.valueOf(p.country))
  });
})
