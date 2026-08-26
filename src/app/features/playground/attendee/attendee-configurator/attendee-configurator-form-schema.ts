import { schema, required, min, max, applyEach, maxLength, validateTree } from '@angular/forms/signals';
import { Attendees } from '../attendee';
import { findDuplicateEmails } from '../attendee-utils';
import { attendeeFormSchema } from '../attendee/attendee-form-schema';

export const attendeeConfiguratorFormSchema = schema<Attendees>((p) => {
  required(p.count, { message: `This field is required` });
  min(p.count, 1, { message: (ctx) => `Minimum ${ctx.state.min?.()} attendee` });
  max(p.count, 10, {
    message: ({ value, state }) => `${value()} attendees? We only have ${state.max?.()} seats`,
  });
  applyEach(p.list, attendeeFormSchema);
  maxLength(p.list,
    ({ valueOf }) => valueOf(p.count) ?? undefined,
    {
      message: ({ state }) => `You can only add ${state.maxLength?.()} attendees`,
    }
  );
  validateTree(p.list, (ctx) => {
    const duplicatedEmailIndexes = findDuplicateEmails(ctx.value());

    // No duplicates found, exit validation with success
    if (duplicatedEmailIndexes.length === 0) {
      return;
    }

    const duplicatedEmailErrors = duplicatedEmailIndexes
      .map((index) => ({
        kind: 'duplicated-attendee',
        message: `This attendee is already added`,
        fieldTree: ctx.fieldTree[index]?.email,
      }));

    return [
      ...duplicatedEmailErrors,
      {
        kind: 'duplicates-in-list',
        message: `The list contains duplicated emails`,
        fieldTree: ctx.fieldTree,
      }
    ];
  });
});
