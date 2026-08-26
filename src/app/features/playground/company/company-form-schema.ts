import { debounce, disabled, hidden, metadata, pattern, required, schema, validateHttp, createMetadataKey } from '@angular/forms/signals';
import { Company, TAX_ID_RULES, VatCheckResult } from './company';
import { HttpContext } from '@angular/common/http';
import { VAT_SIMULATION_MODE } from '@core/http/simulation-mode';
import { startWithValidator } from '../start-with-validator';

export const IS_EU_VAT_COUNTRY = createMetadataKey<boolean>();

export const companyFormSchema = schema<Company>((p) => {

  const EU_VAT_COUNTRIES = metadata(p.taxId, createMetadataKey<string[]>(), () => ['AT', 'DE', 'CH']);
  
  metadata(p.taxId, IS_EU_VAT_COUNTRY, ({state, valueOf}) => 
      state.metadata(EU_VAT_COUNTRIES)?.()?.includes(valueOf(p.country)) ?? false
  );

  /*
    TODO: Task 1: Let the schema name the Tax ID field (~15 min)

    Problem: pick Canada and the label still says "Tax / VAT ID", the placeholder
    still says "E.g. DE123456789". TAX_ID_RULES has carried a `label` and a
    `placeholder` per tax regime since lab 1 and nothing reads them - because the
    regime is resolved inside pattern() below, where only pattern() can see it.

    Your job:
      - Create a `TAX_ID_RULE` metadata key. It holds one entry of TAX_ID_RULES. Think if it
        should be a local or globaly exposed metadata key.
      - register a `metadata()` rule here that resolves that entry for the current
        country. Use other metadata keys we created earlier if needed.
      - Rewrite pattern() below to read the pattern rule instead of resolving it again.
      - In company-form.ts bind the label text and the placeholder of the Tax ID
        input to the rule. 

    TIP (read only if stuck): inside a rule the field state comes from the
    context - `state.metadata(KEY)?.()`. In a template it comes from the field -
    `form().taxId().metadata(KEY)?.()`. A template only sees what the class
    exposes, so the key needs a `protected readonly` field on CompanyForm.

    Check: United States -> "EIN" / "12-3456789". Canada -> "Business Number" /
    "123456789RT0001". Austria -> "VAT / UID" / "ATU12345678". `12345` still
    shows "Doesn't match the format".

    References:
      - https://angular.dev/guide/forms/signals/field-metadata#creating-a-metadata-key
      - https://angular.dev/guide/forms/signals/field-metadata#setting-values-from-a-schema
  */
  pattern(p.taxId, ({ valueOf, state }) => {
    const country = valueOf(p.country);
    const TAX_ID_KEY = state.metadata(IS_EU_VAT_COUNTRY)?.() ? 'EU_VAT' : country;    
    return TAX_ID_RULES[TAX_ID_KEY]?.pattern;
  }, {
    message: `Doesn't match the format`,
  });

  startWithValidator(p.taxId, ({ valueOf }) => valueOf(p.country), {
    when: ({ state }) =>  state.metadata(IS_EU_VAT_COUNTRY)?.() ?? false,
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
    when: (ctx) => !!ctx.value() && !!ctx.state.metadata(IS_EU_VAT_COUNTRY)?.(),
  });
})
