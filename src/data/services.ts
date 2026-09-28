import type { IconName } from '../components/Icon';
import type { Category, Service } from './types';

export interface ServiceDetail extends Service {
  icon: IconName;
  /** What the service covers — each backed by a delivered project. */
  includes: string[];
  /** Project categories that show as proof on the card. Empty = best overall. */
  proof: Category[];
}

/** `filter` is an explorer query string; services link to the projects that back them up. */
export const services: ServiceDetail[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    summary: 'Interface, API and database designed together, so the pieces fit from day one.',
    filter: 'cat=fullstack',
    icon: 'code',
    includes: ['React front end', 'Node, FastAPI or Django API', 'PostgreSQL or MySQL database'],
    proof: ['fullstack'],
  },
  {
    id: 'web',
    title: 'Web Application Development',
    summary: 'Responsive web applications built around the workflow your users actually follow.',
    filter: 'cat=web',
    icon: 'monitor',
    includes: ['Mobile-first responsive UI', 'Multi-language support', 'Deployed and live'],
    proof: ['web'],
  },
  {
    id: 'saas',
    title: 'SaaS Development',
    summary: 'Multi-user products with accounts, roles and the admin tooling to run them.',
    filter: 'cat=saas',
    icon: 'cloud',
    includes: ['Accounts and role-based access', 'Admin dashboards', 'Multi-tenant data'],
    proof: ['saas'],
  },
  {
    id: 'ai',
    title: 'AI Application Development',
    summary: 'Practical AI features such as analysis, generation and speech, wired into a usable product.',
    filter: 'cat=ai',
    icon: 'sparkle',
    includes: ['LLM features (Gemini, OpenRouter)', 'Computer vision and speech', 'AI inside real workflows'],
    proof: ['ai'],
  },
  {
    id: 'business',
    title: 'Business Management Software',
    summary: 'Booking, billing and record-keeping systems that replace spreadsheets and paperwork.',
    filter: 'cat=business',
    icon: 'briefcase',
    includes: ['Booking and billing', 'GST-ready invoices', 'Reports and Excel export'],
    proof: ['business'],
  },
  {
    id: 'education',
    title: 'Education Platforms',
    summary: 'Student management and learning platforms for institutions and educators.',
    filter: 'cat=education',
    icon: 'book',
    includes: ['Portals for every role', 'Attendance, fees and exams', 'Courses and certificates'],
    proof: ['education'],
  },
  {
    id: 'healthcare',
    title: 'Healthcare Applications',
    summary: 'Software for hospitals and clinics, shaped around how staff and patients actually work.',
    filter: 'cat=healthcare',
    icon: 'heart',
    includes: ['Online appointment booking', 'UPI payment flow', 'Patient records and admin console'],
    proof: ['healthcare'],
  },
  {
    id: 'custom',
    title: 'Custom Software',
    summary: "Something that doesn't fit a category. Describe the problem and we'll scope it together.",
    filter: '',
    icon: 'puzzle',
    includes: ['Scoped together', 'Built in working releases', 'Documented handover'],
    proof: [],
  },
];

/** How an engagement runs, start to finish. */
export const process = [
  { title: 'Understand', body: 'We talk through the problem, the people using it and what must be true on day one.' },
  { title: 'Design', body: 'Screens and flows are agreed before code, so there are no surprises later.' },
  { title: 'Build', body: 'Working releases you can click through as we go, not a big reveal at the end.' },
  { title: 'Launch', body: 'Deployed, documented and handed over, with a project document like the ones in my work.' },
];

export const projectTypes = [
  'Web application',
  'SaaS product',
  'AI application',
  'Business software',
  'Education platform',
  'Healthcare application',
  'Other / not sure yet',
];
