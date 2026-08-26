import { debounce, disabled, hidden, pattern, required, schema, validateHttp } from '@angular/forms/signals';
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

  startWithValidator(p.taxId, ({ valueOf }) => valueOf(p.country), {

    when: ({ valueOf }) => ['AT', 'DE', 'CH'].includes(valueOf(p.country)),
    error: ({ valueOf }) => ({
      kind: 'vat-starts-with',
      message: `VAT should start with country ISO code ${valueOf(p.country)}`,
    }),
    
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
