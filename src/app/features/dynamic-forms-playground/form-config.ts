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
