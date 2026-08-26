import { Attendee } from "./attendee";

export function findDuplicateEmails(attendees: Attendee[]): number[] {
  const emails = attendees.map((a) => a.email.toLowerCase());
  const duplicates: number[] = [];

  emails.forEach((email, index) => {
    if (email && emails.indexOf(email) !== index) {
      duplicates.push(index);
    }
  });

  return duplicates;
}