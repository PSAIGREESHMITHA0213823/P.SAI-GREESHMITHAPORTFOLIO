import type { Certification } from './types';

/** credentialUrl stays null unless the owner provides a real verification link. */
export const certifications: Certification[] = [
  { name: 'Java', organization: 'Great Learning', year: null, credentialUrl: null },
  { name: 'Python', organization: 'edX', year: null, credentialUrl: null },
  { name: 'Java', organization: 'Udemy', year: null, credentialUrl: null },
  { name: 'Workshop on Python Programming', organization: 'APSSE', year: null, credentialUrl: null },
  { name: 'Data Analysis & Decision Making', organization: 'NPTEL', year: null, credentialUrl: null },
];
