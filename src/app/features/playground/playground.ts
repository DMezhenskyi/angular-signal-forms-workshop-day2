import { Component } from '@angular/core';

import { OrderForm } from './order-form';
import { Order } from './order';

@Component({
  selector: 'df-playground',
  imports: [OrderForm],
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
      }
    `,
  ],
  template: `
    <df-order-form (submitted)="orderSubmitted($event)" />
  `,
})
export class Playground {
  protected orderSubmitted(order: Order) {
    // Action to be performed when the order is successfully submitted.
    // For example, redirecting to a specific page, etc.
    console.log(`Order submitted:`, order);
  }
}
