import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Company } from './company';

@Component({
  selector: 'df-company-form',
  template: `
    <!-- INSERT TEMPLATE HERE -->
  `,
  imports: [FormField],
  styleUrls: ['../form-core.scss'],
})
export class CompanyForm {
  form = input.required<FieldTree<Company>>();
}
