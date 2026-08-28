import { Component } from '@angular/core';
import { input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'df-error-message',
  template: `
    @for (error of errors(); track error.kind) {
      <span class="error">{{ error.message }}</span>
    }
  `,
  styleUrls: ['./error-message.scss'],
})
export class ErrorMessage {
  errors = input<ValidationError.WithFieldTree[]>();
}
