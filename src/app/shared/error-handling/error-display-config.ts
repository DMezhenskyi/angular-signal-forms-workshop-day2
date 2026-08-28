import { InjectionToken } from "@angular/core";
import { FormField } from "@angular/forms/signals";

export interface ErrorDisplayConfig { 
  displayWhen: (state: FormField<unknown>) => boolean
}

export const ERROR_DISPLAY_CONFIG = new InjectionToken<ErrorDisplayConfig>('ErrorDisplayConfig');

export function provideErrorDisplayConfig(config: ErrorDisplayConfig) {
 // This function is used to provide a custom configuration for error display in the application.
}