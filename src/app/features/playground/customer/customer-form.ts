import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Customer } from './customer';

@Component({
  selector: 'df-customer-form',
  template: `
    <div class="form-field">
      <label for="first-name">First Name</label>
      <input [formField]="form().firstName" id="first-name" type="text" class="form-control" placeholder="E.g. Albert" />
      @if (form().firstName().touched()) {
        @for (error of form().firstName().errors(); track error.kind) {
          <span class="error-message">{{ error.message }}</span>
        }
      }
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
  imports: [FormField],
  styleUrls: ['../form-core.scss'],
})
export class CustomerForm {
  form = input.required<FieldTree<Customer>>();
}
