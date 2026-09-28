/**
 * Shared content schema. Every section of the site is rendered from these types.
 * `null` always means "not supplied by the owner" and renders as a visible [ PLACEHOLDER ].
 */

export type Domain = 'AI' | 'Healthcare' | 'Education' | 'Business' | 'SaaS' | 'Web';

export type Category =
  | 'ai'
  | 'fullstack'
  | 'saas'
  | 'business'
  | 'healthcare'
  | 'education'
  | 'web';

/** Where a project lives in the site's story. */
export type Track = 'product' | 'client' | 'experiment';

export interface ResponsiveImage {
  /** Fallback src (jpg/png). */
  src: string;
  avif?: string;
  webp?: string;
  /** Small WebP for cards and thumbnails. */
  thumb?: string;
  width: number;
  height: number;
  alt: string;
}

export interface Screenshot {
  image: ResponsiveImage | null;
  caption: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  /** Short monospace annotation under the label, e.g. the layer name. */
  meta: string;
  /** Grid position in the diagram: [column, row], zero-based. */
  pos: [number, number];
}

export interface ArchitectureStep {
  /** Node ids revealed at this step. */
  nodes: string[];
  title: string;
  body: string;
}

export interface Architecture {
  nodes: ArchitectureNode[];
  edges: [from: string, to: string][];
  steps: ArchitectureStep[];
  /** False when the diagram is a role-level sketch that the owner has not yet confirmed. */
  confirmed: boolean;
}

export interface CaseStudy {
  overview: string | null;
  problem: string | null;
  solution: string | null;
  features: { label: string; confirmed: boolean }[];
  contribution: string | null;
  outcome: string | null;
  architecture: Architecture | null;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: Category[];
  type: 'client' | 'personal';
  track: Track;
  domain: Domain;
  description: string | null;
  /** Only owner-confirmed technologies. Empty means "not yet confirmed". */
  technologies: string[];
  image: ResponsiveImage | null;
  screenshots: Screenshot[];
  caseStudy: CaseStudy;
  documentUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  visibility: 'public' | 'private';
  year: number | null;
  status: string | null;
  /** Studio or team the project was delivered with, shown as "Built with …". */
  builtWith: string | null;
  /** Where to see the project when there is no live or source link: the LinkedIn profile. */
  linkedinUrl: string | null;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  year: number;
  mode: string;
  duration: string;
  technologies: string[];
  /** Owner-supplied bullet points. Empty renders [ ADD DETAILS ]. */
  details: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface Certification {
  name: string;
  organization: string;
  year: number | null;
  credentialUrl: string | null;
}

export interface Achievement {
  title: string;
  /** Years the achievement applies to; empty when the owner has not supplied one. */
  years: number[];
  detail: string | null;
  kind: 'academic' | 'competition' | 'talk' | 'paper';
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  /** Explorer filter query this service links to (without leading "?"). */
  filter: string;
}
