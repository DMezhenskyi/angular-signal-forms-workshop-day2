# Advanced Angular Signal Forms — Module 2: Architecture & Patterns

One checkout/order form, grown over seven labs. You start with a single
component holding a 130-line template and a 140-line schema, and end with a
form assembled at runtime from JSON — without ever changing how Signal Forms
itself works.

**Prerequisites:** Angular v22+, signals (`signal`, `computed`, `linkedSignal`),
and basic Signal Forms (`form()`, `schema()`, built-in validators).

## What you learn

| Lab | Topic | The idea you leave with |
| --- | --- | --- |
| 1 | Splitting the form view | Splitting the view does not split the form. A child takes a *branch* of the same `FieldTree`; validation, `touched`, `hidden`, async state and submission cross component boundaries untouched. |
| 2 | Splitting the form schema | A rule belongs to the group whose fields it reads. `schema<T>()` composes logic the way `FieldTree<T>` composes views; `apply()` / `applyEach()` add rules to a branch instead of taking it over. |
| 3 | Reusable validators | A `validate()` block is generic logic locked in one schema. Lift it into a configurable validator — value-or-function options, `when` for conditional rules, `message` vs. `error` — and it works like a built-in. |
| 4 | Field metadata | A field carries values, not just a value. `metadata()` attaches computed knowledge to a field; rules, sibling schemas and templates read it back instead of re-deriving it. |
| 5 | Custom form controls | `FormValueControl` / `FormCheckboxControl` is all a component needs to become a field. Then wire the rest of the contract: focus and `touched`, `readonly`, `disabled` — state stays owned by the schema. |
| 6 | Error management | Error display is infrastructure, not template code. A directive that *finds* its field (`FORM_FIELD`, `{ self: true }`), a component that *renders* errors, and a DI token that decides *when* — templates go back to being markup. |
| 7 | Dynamic forms from JSON | A dynamic form is three builders over one config: model, schema, template. Signal Forms needs no special "dynamic" API — `form()` still takes a model and a schema, you just produce both from data. |

## Along the way

- `FieldTree<T>` and `schema<T>()` as the two units of composition.
- Reading other fields: `valueOf()`, and why it decides whether a rule can move.
- Conditional logic on the rule (`when`) rather than on the field.
- Metadata as the mechanism behind `required()`, `min()`, `pattern()`.
- Imperative rendering with `ViewContainerRef.createComponent()` +
  `inputBinding()`, and `effect` + `untracked` as the bridge to it.
- Strategy-as-DI-token (`InjectionToken` + a `provide…()` helper).
- Discriminated-union configs, per-type empty values (`''`, `null`, `false`),
  and `applyEach()` with item identity.

## Running it

```bash
pnpm install
git checkout lab-1   # branches: lab-N (tasks) → lab-N-solution (reference)
pnpm start           # http://localhost:4200
```

Tasks live as `TODO: Task N` comments in the code — your IDE's TODO panel is the
lab navigation. The app ships a **Form Inspector** panel and fake HTTP backends
(order, VAT, email), so everything runs offline.

Lab design docs: `docs/labs/lab-N.md`. Full plan: `docs/workshop-learning-plan.md`.

---

<details>
<summary>Angular CLI commands</summary>

```bash
ng serve      # dev server on http://localhost:4200
ng build      # production build into dist/
ng test       # unit tests (Vitest)
ng generate --help
```

Generated with [Angular CLI](https://github.com/angular/angular-cli) v22.1.2.
</details>
