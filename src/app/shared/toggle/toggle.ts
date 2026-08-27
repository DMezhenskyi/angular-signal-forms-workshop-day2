import { Component, input, model, output } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'df-toggle',
  styleUrls: ['./toggle.scss'],
  host: {
    '(click)': 'toggle()',
    '(blur)': 'touch.emit()',
    '[attr.tabindex]': '0',
    '[class.disabled]': 'disabled()',
  },
  template: `
    <span class="track" [class.on]="checked()">
      <span class="knob"></span>
    </span>
  `,
})
export class Toggle implements FormCheckboxControl {
  readonly checked = model<boolean>(false);
  readonly disabled = input(false);
  readonly touch = output<void>();

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.checked.update((checked) => !checked);
  }
}
