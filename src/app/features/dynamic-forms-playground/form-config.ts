export type FieldValue = string | number | boolean | null;

interface BaseFieldConfig {
  name: string;
  label: string;
  default?: FieldValue;
  required?: boolean;
}

export interface TextFieldConfig extends BaseFieldConfig {
  kind: 'text';
  placeholder?: string;
  type: 'text' | 'email' | 'password';
  minLength?: number;
  maxLength?: number;
}

export type FieldConfig = TextFieldConfig;

/*
  TODO: Task 2: Support number fields (~10 min)

  Problem: the config can only describe text. A form that asks for a quantity
  or a price cannot be built from JSON today.

  Your job:
    - form-config.ts: add a NumberFieldConfig (kind: 'number', min?, max?) and
      add it to the FieldConfig union.
    - model-builder.ts: give each kind its own empty value. A number field
      starts as null, not as an empty string.
    - schema-builder.ts: add a `case 'number'` and apply min and max.
    - dynamic-form.ts: uncomment the Task 2 scaffold and fill the blanks.
    - public/form.json: add a number field to try it out, for example
      { "kind": "number", "name": "seats", "label": "Seats", "required": true,
        "min": 1, "max": 10 }

  NOTE: an empty <input type="number"> gives you null, not "". That is why the
  value type is `number | null`.

  References:
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#defining-a-typed-field-config
    - https://angular.dev/guide/forms/signals/validation#min-and-max
    - https://angular.dev/guide/forms/signals/model-design#match-data-types-to-ui-controls
*/

/*
  TODO: Task 3: Support checkbox fields (~5 min)

  Problem: almost every form has an "I accept the terms" box. The config still
  cannot describe one.

  Your job:
    - Repeat the five steps of Task 2 for a CheckboxFieldConfig
      (kind: 'checkbox').
    - dynamic-form.ts: uncomment the Task 3 scaffold and fill the blanks.
    - public/form.json: add
      { "kind": "checkbox", "name": "terms", "label": "I accept the terms",
        "required": true }

  NOTE: a checkbox starts as false. Signal Forms treats false as empty, so
  `required` on a checkbox means "must be checked". You get that for free.

  Check: reload the page. The checkbox is there and the form is INVALID. Tick
  the box: the form becomes VALID and the Form Inspector shows terms: true.

  Next: Task 4, right below.

  References:
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#rendering-the-form-dynamically
    - https://angular.dev/guide/forms/signals/validation#required
*/

/*
  TODO: Task 4: Make a single rule conditional (~8 min)

  Problem: every rule in the config is unconditional. A real config says "ask
  for the VAT number only when the customer is a company" — but it still wants
  that field's other rules, like minLength, to apply at all times.

  Your job:
    - form-config.ts: let each validator carry its own condition. A validator
      value becomes either the plain value or the value plus a `when`:

        type WhenCondition = { field: string; equals: FieldValue };
        type ValidatorConfig<T> = T | { value: T; when: WhenCondition };

      Use it for required, email, minLength, maxLength, pattern, min and max.
    - schema-builder.ts: write one helper that unwraps a ValidatorConfig<T> into
      its value and optional condition. Pass the condition to each validator.
    - public/form.json: add a checkbox "hasCompany" and a text field "vatNumber"
      with an always-on "minLength": 8 and a conditional
      "required": { "value": true,
                    "when": { "field": "hasCompany", "equals": true } }

  TIP (read only if stuck): every built-in validator takes a `when` in its
  config object. It receives a context with valueOf(), which reads another path.

  NOTE: putting `when` on the field would switch all its rules together. Put it
  on one validator so the other validators stay active.

  Check: reload the page. VAT Number is empty and the Form Inspector shows the
  form VALID. Tick "hasCompany": the form turns INVALID and VAT Number shows
  "This field is required". Untick it: the form is VALID again. Type "DE12":
  the minLength error still shows because that validator is not conditional.

  Next: Task 5, right below.

  References:
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#expressing-conditional-rules-in-config
    - https://angular.dev/guide/forms/signals/validation#conditional-validation
    - https://angular.dev/guide/forms/signals/schemas#conditional-schemas-with-applywhen
*/

/*
  TODO: Task 5: Support nested field groups (~10 min)

  Problem: the config is a flat list, so the model is flat too. A backend that
  sends an address wants { address: { street, city } }, not street and city
  next to email.

  Your job:
    - form-config.ts: add a GroupFieldConfig (kind: 'group', fields:
      FieldConfig[]) and add it to the union.
    - model-builder.ts: a group builds a nested object. Widen DynamicModel so a
      value can also be a DynamicModel.
    - schema-builder.ts: apply the rules of the children on the sub-path of the
      group, not on the root path.
    - dynamic-form.ts: uncomment the Task 5 scaffold and fill the blanks.
    - public/form.json: add a group, for example "address" with a "street" and a
      "city" text field.

  TIP (read only if stuck): rootPath[config.name] is the sub-path of the group.
  Cast it to SchemaPath<DynamicModel> and run the same per-field logic on it.
  Move that logic into its own function first, so both levels can call it.

  NOTE: one level of nesting is enough. Do not make it recursive.

  Check: the group is rendered inside a <fieldset> with its label. The Form
  Inspector shows address: { street: "", city: "" }. Leave a required child
  empty: the whole form is INVALID.

  Next: Task 6*, right below. It is optional — the main lab is done. 🎉

  References:
    - https://angular.dev/guide/forms/signals/models#working-with-nested-objects
    - https://angular.dev/guide/forms/signals/schemas#create-reusable-schemas-with-schema
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#building-the-model-from-config
*/

/*
  TODO: Task 6*: Support repeating fields (stretch)

  Problem: some fields repeat. A config that describes a list of attendees
  cannot be rendered, because a group always builds exactly one object.

  Your job:
    - form-config.ts: add an ArrayFieldConfig (kind: 'array', fields:
      FieldConfig[]) and add it to the union.
    - model-builder.ts: an array field starts as an array with one empty item.
    - schema-builder.ts: apply the rules of the children to every item.
    - dynamic-form.ts: render every item, plus an "Add" and a "Remove" button.
    - public/form.json: add an array field with two text children.

  TIP (read only if stuck): applyEach() applies a schema to every item of an
  array path. To add or remove items, write the new array into the form value.

  Check: press "Add". A second row appears and the Form Inspector shows two
  items. An empty required field in row 2 makes the whole form INVALID.

  Next: done. 🎉

  References:
    - https://angular.dev/guide/forms/signals/schemas#array-items-with-applyeach
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#expressing-repeating-fields-in-config
    - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#tracking-item-identity
*/
