import { InjectionToken } from "@angular/core";
import { FormField } from "@angular/forms/signals";

export interface ErrorDisplayConfig { 
  displayWhen: (state: FormField<unknown>) => boolean
}

export const ERROR_DISPLAY_CONFIG = new InjectionToken<ErrorDisplayConfig>('ErrorDisplayConfig', {
  factory: () => ({
    displayWhen: ({ state }) => state().invalid()
  })
});

export function provideErrorDisplayConfig(config: ErrorDisplayConfig) {
  return {
    provide: ERROR_DISPLAY_CONFIG,
    useValue: config,
  };
}