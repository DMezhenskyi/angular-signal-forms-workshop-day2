import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Customer } from './customer';
import { FieldErrorTracker } from '@shared/error-handling/error-tracker';

@Component({
  selector: 'df-customer-form',
  template: `
    <div class="form-field">
      <label for="first-name">First Name</label>
      <input dfFieldErrorTracker [formField]="form().firstName" id="first-name" type="text" class="form-control" placeholder="E.g. Albert" />
      <!--
        TODO Task 3: Attach everywhere, delete the copies (~8 min)

        Problem: adding dfFieldErrorTracker to every input by hand is the same
        repetition with a new name.

        Goal: make the directive attach to every [formField] host automatically.
        Then delete the manual error blocks: firstName, lastName, email (this
        file), name + taxId (company-form.ts), email (attendee-form.ts) and
        count (attendee-configurator-form.ts). Keep the pending() and
        disabledReasons() spans. Keep the list-level error block in
        attendee-configurator-form.ts. Remove the attribute from Task 1 and
        this comment.

        TIP (read only if stuck): a directive selector can list several
        selectors, separated by a comma.

        Check: every field still shows its errors, and no "error-message" span
        is left in the four components. Errors now show before you touch a
        field — this new problem is Task 4.

        Next: order-form.ts, Task 4.

        References:
          - https://angular.dev/api/core/Directive
          - https://angular.dev/guide/forms/signals/custom-controls#how-the-formfield-directive-works
      -->
    </div>
    <div class="form-field">
      <label for="last-name">Last Name</label>
      <input [formField]="form().lastName" id="last-name" type="text" class="form-control" placeholder="E.g. Einstein" />
      @if (form().lastName().touched()) {
        @for (error of form().lastName().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
      }
    </div>
    <div class="form-field">
      <label for="email">Email</label>
      <input [formField]="form().email" id="email" type="email" class="form-control" placeholder="E.g. example@example.com" />
      @if (form().email().touched()) {
        @for (error of form().email().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
      }
      @if (form().email().pending()) {
        <span class="info-message">Checking email availability...</span>
      }
    </div>
  `,
  imports: [FormField, FieldErrorTracker],
  styleUrls: ['../form-core.scss'],
})
export class CustomerForm {
  form = input.required<FieldTree<Customer>>();
}
