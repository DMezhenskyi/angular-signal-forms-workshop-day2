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
      @switch (config.kind) {
        @case ('text') {
          <div class="form-field">
            <label [for]="config.name">{{ config.label }}</label>
            <input [formField]="textField(config.name)" [id]="config.name" [placeholder]="config.placeholder" [type]="config.type" class="form-control" />
          </div>
        }
        <!--
          Task 2 scaffold: uncomment it and fill in the placeholders.

          @case ('number') {
            <div class="form-field">
              <label [for]="config.name">{{ config.label }}</label>
              <input [formField]="__RESOLVE__THE__CONTROL__" [id]="config.name" type="number" class="form-control" />
            </div>
          }
        -->
        <!--
          Task 3 scaffold: uncomment it and fill in the placeholders.

          @case ('checkbox') {
            <div class="form-field inline auto-height reversed">
              <label [for]="config.name">{{ config.label }}</label>
              <input [formField]="__RESOLVE__THE__CONTROL__" [id]="config.name" type="checkbox" />
            </div>
          }
        -->
        <!--
          Task 5 scaffold: uncomment it and fill in the placeholders.
          It renders text children only. Every child needs the field of the
          child inside the group, not on the root of the form.

          @case ('group') {
            <fieldset>
              <legend>{{ config.label }}</legend>
              @for (child of __GROUP__; track child.name) {
                <div class="form-field">
                  <label [for]="child.name">{{ child.label }}</label>
                  <input [formField]="__RESOLVE_FIELD__" [id]="child.name" class="form-control" />
                </div>
              }
            </fieldset>
          }
        -->
      }
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
