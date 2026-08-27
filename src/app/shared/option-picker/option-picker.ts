import { Component, input, model, output } from '@angular/core';
import { PickerOption } from './option';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'df-option-picker',
  styleUrls: ['./option-picker.scss'],
  template: `
    @for (option of options(); track option.value) {
      <button [class.selected]="value() === option.value" (click)="select(option)" type="button" class="option">
        {{ option.label }}
      </button>
    }
  `,
  host: {
    '[attr.tabindex]': '0',
    '(blur)': 'touch.emit()',
    '[class.readonly]': 'readonly()',
  }
})
export class OptionPicker<T> implements FormValueControl<T | null> {
  
  readonly options = input.required<PickerOption<T>[]>();
  readonly value = model<T | null>(null);
  readonly readonly = input<boolean>(false);
  readonly touch = output<void>();

  protected select(option: PickerOption<T>) {
    this.value.set(option.value);
  }
}
