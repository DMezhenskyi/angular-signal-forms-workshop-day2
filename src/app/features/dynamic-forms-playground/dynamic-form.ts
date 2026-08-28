import { Component, inject, input, OnInit, output, signal, Injector, runInInjectionContext } from "@angular/core";
import { FieldConfig } from "./form-config";
import { FieldTree, form, FormField, FormRoot } from "@angular/forms/signals";
import { buildModel, DynamicModel } from "./model-builder";
import { buildSchema } from "./schema-builder";
import { FieldErrorTracker } from "@shared/error-handling/error-tracker";
import { inspectFormState } from "@features/form-inspector/form-connector";

@Component({
  selector: 'df-dynamic-form',
  imports: [FormRoot, FormField, FieldErrorTracker],
  styleUrls: ['./dynamic-form.scss', './dynamic-form-core.scss'],
  template: `
    <form [formRoot]="form" class="dynamic-form">
    @for (config of configs(); track config.name) {
      <!-- render inputs -->
    }
    <section class="actions">
      <button class="submit-button" [disabled]="form().submitting()" type="submit">Submit</button>
    </section>
  </form>
  `
})
export class DynamicForm implements OnInit {

  readonly configs = input.required<FieldConfig[]>();

  readonly submitted = output<unknown>();

  protected form!: FieldTree<DynamicModel>;
  #injector = inject(Injector);

  ngOnInit() {
    this.form = form(
      signal(buildModel(this.configs())),
      buildSchema(this.configs()),
      {
        submission: {
          action: async (form) => this.submitted.emit(form().value()),
        },
        injector: this.#injector,
      });
    runInInjectionContext(this.#injector, () => inspectFormState(this.form));
  }

  protected textField(name: string) {
    return this.form[name] as unknown as FieldTree<string>;
  }
}