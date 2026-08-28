import { FieldConfig, FieldValue } from './form-config';

export interface DynamicModel {
  [key: string]: FieldValue;
}

export function buildModel(configs: FieldConfig[]): DynamicModel {
  const model: DynamicModel = {};
  // build the model based on the provided field configurations
  for (const config of configs) {
    model[config.name] = config?.default ?? '';
  }
  return model;
}