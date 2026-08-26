import { schema } from "@angular/forms/signals";

export const attendeeFormSchema = schema((p) => {
  /*
    TODO: Task 4: Move the rules of one attendee into this schema (~5 min)

    Problem: after Task 3 the rules of a single attendee still sit inline, in the
    `applyEach()` callback of the configurator schema. One row is a unit of its
    own, like the company or the customer.

    Your job:
      - Type this schema for the Attendee model.
      - Move the two rules from the `applyEach()` callback in
        ../attendee-configurator/attendee-configurator-form-schema.ts here.
      - Pass this schema to `applyEach()` instead of the callback.

    TIP: `applyEach()` takes a schema or a function. Both work the same way, so
    you only swap the second argument.

    References:
      - https://angular.dev/guide/forms/signals/schemas#array-items-with-applyeach
      - https://angular.dev/guide/forms/signals/validation#required
      - https://angular.dev/guide/forms/signals/validation#email
  */
});
