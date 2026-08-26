import { Component, input, linkedSignal, output } from '@angular/core';
import { PickerOption, ComputedSource } from './option';

@Component({
  selector: 'df-option-picker',
  styleUrls: ['./option-picker.scss'],
  template: `

      @for (option of options(); track option.value) {
        <button [class.selected]="selected() === option.value" (click)="select(option)" type="button" class="option">
          {{ option.label }}
        </button>
      }

  `,
})
export class OptionPicker<T> {
  readonly options = input.required<PickerOption<T>[]>();
  readonly value = input<T | null>(null);
  
  readonly valueChange = output<T | null>();
  
  protected selected = linkedSignal<ComputedSource<T>, T | null>({
    source: () => ({
      options: this.options(),
      value: this.value(),
    }),
    computation: ({ options, value }) => {
      return options.find((o) => o.value === value)?.value ?? this.options()[0]?.value;
    },
  });

  protected select(option: PickerOption<T>) {
    this.selected.set(option.value);
    this.valueChange.emit(option.value);
  }
}
