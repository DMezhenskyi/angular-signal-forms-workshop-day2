export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}
export type EmailCheckResult = { allowed: true; } | { allowed: boolean; reason: string };