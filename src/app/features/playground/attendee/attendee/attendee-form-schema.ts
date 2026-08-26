import { email, required, schema } from '@angular/forms/signals';

import { Attendee } from '../attendee';

export const attendeeFormSchema = schema<Attendee>((p) => {
  required(p.email, { message: `Attendee email is required` });
  email(p.email, { message: `Enter a valid email address` });
});
