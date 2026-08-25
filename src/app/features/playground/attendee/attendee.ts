export type AttendeeLevel = 'junior' | 'middle' | 'senior';

export interface Attendee {
  email: string;
  level: AttendeeLevel;
}

export interface Attendees {
  list: Attendee[];
  count: number | null;
}