export interface ApiError {
  message: string;
  fieldErrors?: { field: string; message: string }[];
}

export type SimulationMode = 'success' | 'server-error' | 'field-error';

export interface VatVerification {
  valid: boolean;
  companyName?: string;
  reason?: string;
}

export type VatSimulationMode = 'valid' | 'invalid' | 'server-error';

export interface CompanyTaxInfo {
  name: string;
  address: string;
  postalCode: string;
}

export interface EmailCheck {
  allowed: boolean;
  reason?: string;
}

export type EmailSimulationMode = 'allowed' | 'taken' | 'server-error';
