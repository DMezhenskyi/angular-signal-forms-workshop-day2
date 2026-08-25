import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Customer } from './customer';

@Component({
  selector: 'df-customer-form',
  template: `
    <!-- INSERT TEMPLATE HERE -->
  `,
  imports: [FormField],
  styleUrls: ['../form-core.scss'],
})
export class CustomerForm {
  form = input.required<FieldTree<Customer>>();
}
