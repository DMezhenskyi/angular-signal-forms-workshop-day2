import { LogicFn, SchemaPath, validate } from "@angular/forms/signals";

export function startWithValidator(
  path: SchemaPath<string>,
  startWith: string
) {
  validate(path, (ctx) => {
    
  });
}