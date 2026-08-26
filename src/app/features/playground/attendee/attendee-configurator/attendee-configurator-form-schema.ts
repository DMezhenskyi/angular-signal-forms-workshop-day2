import { schema } from "@angular/forms/signals";

export const attendeeConfiguratorFormSchema = schema((p) => {
  /*
    TODO: Task 3: Move the attendee rules into this schema (~10 min)

    Problem: the attendee rules are the biggest block left in the root schema:
    count limits, per-attendee rules, list length and the duplicate check.

    Your job:
      - Type this schema for the Attendees model.
      - Move every `path.attendees.*` rule from order-form.ts here.
      - Move `findDuplicateEmails()` from order-form.ts to ../attendee-utils.ts
        and import it here.
      - Apply this schema to `path.attendees` in order-form.ts.

    NOTE: `maxLength()` reads `count`. `count` and `list` are both attendee
    fields, so this rule is self-contained here.

    References:
      - https://angular.dev/guide/forms/signals/schemas#using-the-schema-with-apply
      - https://angular.dev/guide/forms/signals/cross-field-logic#using-validatetree
      - https://angular.dev/guide/forms/signals/validation#minlength-and-maxlength
  */
});
