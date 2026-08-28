import { required, SchemaFn } from "@angular/forms/signals";
import type { FieldConfig } from "./form-config";
import type { DynamicModel } from "./model-builder";

export function buildSchema(configs: FieldConfig[]): SchemaFn<DynamicModel> {
  return (rootPath) => {
    // build the schema based on the provided field configurations
  };
}