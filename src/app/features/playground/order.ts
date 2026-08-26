import { Attendees } from "./attendee/attendee";
import { Company } from "./company/company";
import { Customer } from "./customer/customer";
import { WorkshopLocation, PickerOption } from "@shared/option-picker/option";

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

export const BASE_LOCATIONS: PickerOption<WorkshopLocation>[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const BUSINESS_LOCATIONS: PickerOption<WorkshopLocation>[] = [
  { value: 'onsite', label: 'On-site' },
];