import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Attendees } from '../attendee';
import { AttendeeForm } from "../attendee/attendee-form";

@Component({
  selector: 'df-attendee-configurator-form',
  template: `
    <div class="form-field">
      <label for="attendee-count">Attendee Count</label>
      <input [formField]="form().count" id="attendee-count" type="number" class="form-control" />
      @if (form().count().touched()) {
        @for (error of form().count().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
      }
    </div>
    <section class="attendees">
      <button type="button" (click)="addAttendee()" [disabled]="form().count().invalid()">+</button>

      <div class="attendees-container">
        @for (attendee of form().list; track attendee) {
          <df-attendee-form [form]="attendee" (remove)="removeAttendee($index)" />
        } @empty {
          <div class="no-data">No attendees yet...</div> 
        }      
      </div>
        @for (error of form().list().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
    </section>
  `,
  imports: [FormField, AttendeeForm],
  styleUrls: ['./attendee-configurator-form.scss', '../../form-core.scss'],
})
export class AttendeeConfiguratorForm {
  form = input.required<FieldTree<Attendees>>();

  protected addAttendee() {
    this.form().list().value.update(
      (list) => [...list, { email: '', level: 'junior' }]
    );
  }
  
  protected removeAttendee(index: number) {
    this.form().list().value.update(
      (list) => list.filter((_, i) => i !== index)
    );
  }
}
