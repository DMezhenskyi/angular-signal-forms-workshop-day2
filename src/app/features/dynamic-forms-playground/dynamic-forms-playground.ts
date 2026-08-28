import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FieldConfig } from './form-config';
import { DynamicForm } from './dynamic-form';

@Component({
  selector: 'df-dynamic-forms-playground',
  imports: [DynamicForm],
  styles: [`:host { display: flex; width: 100%; }`],
  template: `
    @if (config.isLoading()) {
      <p class="status">Loading form definition...</p>
    } @else if (config.error(); as error) {
      <p class="error-banner">Could not load the form definition: {{ error }}</p>
    } @else if (config.value(); as fields) {
      <df-dynamic-form [configs]="fields" (submitted)="orderSubmitted($event)" />
    }
  `,
})
export class DynamicFormsPlayground {

  protected readonly config = httpResource<FieldConfig[]>(() => `/form.json`);

  protected orderSubmitted(order: unknown) {
    // Action to be performed when the order is successfully submitted.
    // For example, redirecting to a specific page, etc.
    console.log(`Order submitted:`, order);
  }
}
