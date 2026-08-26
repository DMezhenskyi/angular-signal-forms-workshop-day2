export type WorkshopLocation = 'online' | 'offline' | 'hybrid' | 'onsite';

export interface PickerOption<T> {
  value: T;
  label: string;
}

export type ComputedSource<T> = {
  options: PickerOption<T>[];
  value: T | null;
};