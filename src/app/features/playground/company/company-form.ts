import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Company } from './company';

@Component({
  selector: 'df-company-form',
  template: `
    <fieldset>
      <legend>Company Information</legend>
      <div class="form-field">
        <label for="company-name">Company Name</label>
        <input [formField]="form().name" id="company-name" type="text" class="form-control" placeholder="E.g. Apple Inc." />
        @if (form().name().touched()) {
          @for (error of form().name().errors(); track error.kind) {
            <span class="error-message">{{ error.message }}</span>
          }
        }
      </div>
      <div class="form-field-group">
        <div class="form-field">
          <label for="country">Country</label>
          <select [formField]="form().country" id="country" class="form-control">
            <option value="">Select country</option>
            <option value="DE">Germany</option>
            <option value="AT">Austria</option>
            <option value="CH">Switzerland</option>
            <option value="CA">Canada</option>
            <option value="US">United States</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        @if (!form().taxId().hidden()) {
          <div class="form-field">
            <label for="tax-id">Tax / VAT ID</label>
            <input [formField]="form().taxId" id="tax-id" type="text" class="form-control" placeholder="E.g. DE123456789" />
            @if (form().taxId().touched()) {
              @for (error of form().taxId().errors(); track error.kind) {
                <span class="error-message">{{ error.message }}</span>
              }
            }
            @for (reason of form().taxId().disabledReasons(); track reason) {
              <span class="info-message">{{ reason.message }}</span>
            }
            @if (form().taxId().pending()) {
              <span class="info-message">Checking the TAX ID...</span>
            }
          </div>
        }
      </div>
    </fieldset>
  `,
  imports: [FormField],
  styleUrls: ['../form-core.scss'],
})
export class CompanyForm {
  form = input.required<FieldTree<Company>>();
}
