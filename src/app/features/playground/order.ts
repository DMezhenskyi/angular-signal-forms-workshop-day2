import { Attendees } from "./attendee/attendee";
import { Company } from "./company/company";
import { Customer } from "./customer/customer";

export interface Order {
  customer: Customer;
  attendees: Attendees;
  businessPurchase: boolean;
  company: Company;
}

export const INITIAL_ORDER_VALUES: Order = {
  customer: {
    firstName: '',
    lastName: '',
    email: '',
  },
  attendees: {
    count: null,
    list: [],
  },
  businessPurchase: false,
  company: {
    name: '',
    country: '',
    taxId: '',
  },
};