import { Component, input, linkedSignal, output } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'df-toggle',
  styleUrls: ['./toggle.scss'],
  host: {
    '(click)': 'toggle()',
  },
  template: `
    <span class="track" [class.on]="rawEnabled()">
      <span class="knob"></span>
    </span>
  `,
})
export class Toggle {
  readonly enabled = input<boolean>(false);
  readonly enabledChange = output<boolean>();

  protected readonly rawEnabled = linkedSignal(() => this.enabled());

  protected toggle(): void {
    this.rawEnabled.update((enabled) => !enabled);
    this.enabledChange.emit(this.rawEnabled());
  }
}
