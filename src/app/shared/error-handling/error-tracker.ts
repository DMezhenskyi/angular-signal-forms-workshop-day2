import { ComponentRef, computed, Directive, effect, inject, inputBinding, untracked, ViewContainerRef } from '@angular/core';
import { ErrorMessage } from './error-message';
import { FORM_FIELD } from '@angular/forms/signals';
import { ERROR_DISPLAY_CONFIG } from './error-display-config';

@Directive({
  selector: '[dfFieldErrorTracker], [formField]',
})
export class FieldErrorTracker {

  #field = inject(FORM_FIELD, { self: true });
  #config = inject(ERROR_DISPLAY_CONFIG);

  #errorsComponent?: ComponentRef<ErrorMessage>;
  #vcr = inject(ViewContainerRef);

  #showErrors = computed(
    () => this.#config.displayWhen(this.#field) ?? this.#field.state().invalid()
  );

  constructor() {
    effect(() => {
      const showErrors = this.#showErrors();

      untracked(() => {
        this.#errorsComponent?.destroy();
        if (showErrors) {
          this.#errorsComponent = this.#vcr.createComponent(ErrorMessage, {
            bindings: [inputBinding('errors', this.#field.errors)],
          });
        } else {
          this.#errorsComponent = undefined;
        }
      });
    });
  }
}
