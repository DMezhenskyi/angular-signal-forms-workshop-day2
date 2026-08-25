import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Attendees } from '../attendee';

@Component({
  selector: 'df-attendee-configurator-form',
  template: `
    <!-- INSERT TEMPLATE HERE -->
  `,
  imports: [FormField],
  styleUrls: ['./attendee-configurator-form.scss', '../../form-core.scss'],
})
export class AttendeeConfiguratorForm {
  form = input.required<FieldTree<Attendees>>();
}
