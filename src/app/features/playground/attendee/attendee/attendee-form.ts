import { Component, input, output } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Attendee } from '../attendee';

@Component({
  selector: 'df-attendee-form',
  template: `
    <!-- INSERT TEMPLATE HERE -->
  `,
  imports: [FormField],
  styleUrls: ['./attendee-form.scss', '../../form-core.scss'],
})
export class AttendeeForm {
  form = input.required<FieldTree<Attendee>>();
  remove = output<void>();
}
