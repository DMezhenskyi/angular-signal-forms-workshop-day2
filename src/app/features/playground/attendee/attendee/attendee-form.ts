import { Component, input, output } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Attendee } from '../attendee';

@Component({
  selector: 'df-attendee-form',
  template: `
    <div class="form-field auto-width auto-height">
      <select [formField]="form().level">
        <option value="junior">Junior</option>
        <option value="middle">Middle</option>
        <option value="senior">Senior</option>
      </select>
    </div>
    <div class="form-field">
      <input [formField]="form().email" placeholder="Attendee's Email" type="text" class="form-control" />
      @if (form().email().touched()) {
        @for (error of form().email().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
      }
    </div>
    <button (click)="remove.emit()" type="button" class="delete">-</button>
  `,
  imports: [FormField],
  styleUrls: ['./attendee-form.scss', '../../form-core.scss'],
})
export class AttendeeForm {
  form = input.required<FieldTree<Attendee>>();
  remove = output<void>();
}
