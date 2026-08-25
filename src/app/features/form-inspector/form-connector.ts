import { assertInInjectionContext, DestroyRef, inject, Service, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Service()
export class FormConnector {
  readonly #field = signal<FieldTree<unknown> | undefined>(undefined);

  readonly field = this.#field.asReadonly();

  register(field: FieldTree<unknown>) {
    this.#field.set(field);
  }

  unregister(field: FieldTree<unknown>) {
    if (this.#field() === field) {
      this.#field.set(undefined);
    }
  }
}

export function inspectFormState(form: FieldTree<unknown>) {
  assertInInjectionContext(inspectFormState);

  const connector = inject(FormConnector);

  connector.register(form);

  inject(DestroyRef).onDestroy(() => connector.unregister(form));
}
