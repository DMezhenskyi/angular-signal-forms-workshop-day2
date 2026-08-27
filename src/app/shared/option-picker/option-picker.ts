import { Component, input, linkedSignal, model } from '@angular/core';
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
  /*
    TODO: Task 1: Make the picker a form control (~6 min)

    Problem: clicking an option changes nothing in the form. The Form Inspector
    still shows location: "online".

    Your job:
      - Decide which contract fits this component: FormValueControl or
        FormCheckboxControl. Add it to the class and implement it.
      - Bind the picker to the `location` field in `order-form.html`.

    Check: click "Offline". The Form Inspector shows location: "offline".

    References:
      - https://angular.dev/guide/forms/signals/custom-controls#understanding-control-interfaces
      - https://angular.dev/guide/forms/signals/custom-controls#formvaluecontrol
      - https://angular.dev/guide/forms/signals/custom-controls#how-the-formfield-directive-works
  */
  readonly options = input.required<PickerOption<T>[]>();
  readonly selectedOption = model<T | null>(null);

  /*
    TODO: Task 2: Add keyboard focus and the touched state (~3 min)

    Problem: you cannot reach the picker with the Tab key, and the field never
    becomes touched. Rules that wait for a blur, like `debounce('blur')`, would
    never run.

    Your job:
      - Make the host element reachable with the Tab key.
      - Tell the form when the user leaves the control, so the field becomes
        touched.

    Check: press Tab until the picker has the focus ring, then press Tab again.
    The Form Inspector shows touched: true for location.

    References:
      - https://angular.dev/guide/forms/signals/custom-controls#interaction-state
      - https://angular.dev/guide/forms/signals/field-state-management#touched-state
  */

  /*
    TODO: Task 3: Add the readonly state (~5 min)

    Problem: Go to order-form.ts and uncommend a readonly rule for the the 'location' model.
    The rule there sets the field to readonly state if the amount of attendees is less than 5, 
    but UI does not reflect that.

    Your job:
      - Implement the support of the readonly state that will be always in sync with the form model.

    Check: uncommend the readonly rule in order-form.ts. The picker gets a dashed border and
    clicking an option changes nothing. Type 5 and the picker works again.

    References:
      - https://angular.dev/guide/forms/signals/custom-controls#availability-state
      - https://angular.dev/guide/forms/signals/form-logic#display-uneditable-fields-with-readonly
  */

  /*
    TODO: Task 4*: Keep the value inside the list of options (stretch)

    Problem: tick "Business Purchase", pick "On-site", then untick the checkbox.
    "On-site" is gone from the list and nothing looks selected, but the Form
    Inspector still shows location: "onsite". The form would submit a location
    the user cannot see.

    Your job:
      - Find a way to keep the model and the view in sync.

    TIP: there is no an ideal solution for this problem.

    Check: repeat the steps above. The Form Inspector shows a location that is
    still in the list, for example "online".

    References:
      - https://angular.dev/guide/forms/signals/custom-controls#design-considerations
      - https://angular.dev/guide/forms/signals/field-state-management#programmatic-state-changes
  */
  protected selected = linkedSignal<ComputedSource<T>, T | null>({
    source: () => ({
      options: this.options(),
      value: this.selectedOption(),
    }),
    computation: ({ options, value }) => {
      return options.find((o) => o.value === value)?.value ?? this.options()[0]?.value;
    },
  });

  protected select(option: PickerOption<T>) {
    this.selectedOption.set(option.value);
  }
}
