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
          // implement minLength and maxLength validation rules if they are defined in the config
          break;
        }
      }
    }
  };
}
