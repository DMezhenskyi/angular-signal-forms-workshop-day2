import { schema } from "@angular/forms/signals";

export const companyFormSchema = schema((p) => {
  /*
    TODO: Task 2: Move the company rules into this schema (~10 min)

    Problem: the company rules are ~60 lines in the root schema, but almost all
    of them read only company fields.

    Your job:
      - Type this schema for the Company model.
      - Move every self-contained company rule from order-form.ts here and
        shorten the paths: `path.company.taxId` -> `p.taxId`.
      - Apply this schema to `path.company` in order-form.ts.

    NOTE: `required(path.company.name)` read
    `businessPurchase`, which is not owned by this schema. Leave it for now in the root
    schema. The next lab comes back to them.

    References:
      - https://angular.dev/guide/forms/signals/schemas#create-reusable-schemas-with-schema
      - https://angular.dev/guide/forms/signals/schemas#using-the-schema-with-apply
      - https://angular.dev/guide/forms/signals/cross-field-logic#understanding-the-field-context
  */
});
