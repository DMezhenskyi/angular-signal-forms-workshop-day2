export interface Company {
  name: string;
  country: 'AT' | 'DE' | 'CH' | 'CA' | 'US' | 'OTHER' | '';
  taxId: string;
}
export interface TaxIdRule {
  label: string;
  placeholder: string;
  pattern: RegExp;
}
export const TAX_ID_RULES: Record<string, TaxIdRule> = {
  EU_VAT: { pattern: /^[A-Z]{2}[A-Z0-9]{2,12}$/, label: 'VAT / UID', placeholder: 'ATU12345678' },
  US: { pattern: /^\d{2}-\d{7}$/, label: 'EIN', placeholder: '12-3456789' },
  CA: { pattern: /^\d{9}(RT\d{4})?$/, label: 'Business Number', placeholder: '123456789RT0001' },
};

export type VatCheckResult = { valid: true; } | { valid: false; reason: string };