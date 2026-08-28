import { required, SchemaFn, SchemaPath } from '@angular/forms/signals';
import { FieldConfig } from './form-config';
import { DynamicModel } from './model-builder';

export function buildSchema(configs: FieldConfig[]): SchemaFn<DynamicModel> {
  return (rootPath) => {
    for (const config of configs) {
      const fieldPath = rootPath[config.name];

      if (config.required) {
        required(fieldPath, { message: `This field is required` });
      }

      switch (config.kind) {
        case 'text': {
          const textPath = fieldPath as SchemaPath<string>;
          /*
            TODO: Task 1: Apply the text rules from the config (~6 min)

            Problem: form.json already says the Email field has "email": true,
            but you can type "abc" and the form stays VALID. The builder reads
            only "required". Every other rule in the config is ignored.

            Your job:
              - Add `email?: boolean` to TextFieldConfig and apply the rule here.
              - Apply minLength and maxLength. They are already in the config type.
              - Add `pattern?: string` to TextFieldConfig and apply it too.
              - Only apply a rule when the config has it.

            NOTE: JSON has no RegExp. The config carries the pattern as a string,
            so you have to build the RegExp yourself.

            References:
              - https://angular.dev/guide/forms/signals/validation#built-in-validation-rules
              - https://angular.dev/guide/forms/signals/validation#minlength-and-maxlength
              - https://angular.dev/guide/forms/signals/validation#pattern
              - https://angular.dev/guide/forms/signals/dynamic-forms-with-json#building-the-schema-from-config
          */
          break;
        }
      }
    }
  };
}
