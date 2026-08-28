import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Company } from './company';
import { TAX_ID_RULE } from './company-form-schema';
import { FieldErrorTracker } from '@shared/error-handling/error-tracker';

@Component({
  selector: 'df-company-form',
  template: `
    <fieldset>
      <legend>Company Information</legend>
      <div class="form-field">
        <label for="company-name">Company Name</label>
        <input [formField]="form().name" id="company-name" type="text" class="form-control" placeholder="E.g. Apple Inc." />
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
            <label for="tax-id">{{taxIdRule()?.label}}</label>
            <input [formField]="form().taxId" id="tax-id" type="text" class="form-control" [placeholder]="taxIdRule()?.placeholder" />
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
  imports: [FormField, FieldErrorTracker],
  styleUrls: ['../form-core.scss'],
})
export class CompanyForm {
  form = input.required<FieldTree<Company>>();
  protected readonly taxIdRule = computed(
    () => this.form().taxId().metadata(TAX_ID_RULE)?.()
  );
}
