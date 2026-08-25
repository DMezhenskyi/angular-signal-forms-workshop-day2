import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Attendees } from '../attendee';

@Component({
  selector: 'df-attendee-configurator-form',
  template: `
    <!-- Task 2: paste the attendee block from order-form.html here. -->

    <!--
      TODO: Task 3: Move the attendee row into <df-attendee-form> (~10 min)

      Problem: after Task 2 the whole row (level select, email input, errors,
      delete button) sits inside the @for loop. A row is a unit of its own, and
      this component does not need to know how it looks.

      Your job:
        - Move the content of <div class="attendee-row"> into the template of
          AttendeeForm (attendee/attendee/attendee-form.ts). Drop the wrapper
          div, attendee-form.scss already styles :host as the row.
        - In AttendeeForm, read the fields from its own "form" input.
        - A row must not delete itself. On click, emit the "remove" output that
          AttendeeForm already declares.
        - Render <df-attendee-form [form]="attendee" (remove)="removeAttendee($index)" />
          in the loop, and add the component to the imports of this component.
          
      Next: done - the lab is finished.

      References:
        - https://angular.dev/guide/components/outputs#emitting-event-data
        - https://angular.dev/guide/forms/signals/field-state-management#how-child-state-affects-parent-forms
        - https://angular.dev/guide/forms/signals/models#working-with-arrays
    -->
  `,
  imports: [FormField],
  styleUrls: ['./attendee-configurator-form.scss', '../../form-core.scss'],
})
export class AttendeeConfiguratorForm {
  form = input.required<FieldTree<Attendees>>();
}
