/**
 * SITE CONFIG — the single place the owner edits personal details.
 *
 * Rule: anything left as `null` renders on the site as a visible [ PLACEHOLDER ].
 * Never replace a null with a guess. Only fill in values you can verify.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  roleLine: string;
  headline: string;
  supporting: string;
  availability: string;

  email: string | null;
  phone: string | null;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  resumeUrl: string | null;
  /** Shown as the avatar on the home page. Swap in a higher-resolution photo in public/. */
  portraitUrl: string | null;

  /** Deployed origin, used for canonical URLs, Open Graph and the sitemap. No trailing slash. */
  siteUrl: string | null;

  /** IANA time zone for the footer clock. */
  timeZone: string;

  /**
   * Where the contact form POSTs JSON (e.g. a Formspree / Getform / serverless endpoint).
   * When null the form falls back to opening a pre-filled email, and if email is also null
   * it tells the visitor the form isn't connected yet.
   */
  formEndpoint: string | null;

  /**
   * Netlify Forms name. When set, the deployed site sends inquiries to Netlify, which emails them
   * to you (Netlify → Forms → Form notifications). Must match the hidden form in index.html.
   */
  netlifyForm: string | null;

  /**
   * Owner-verified numbers only. `null` renders [ SET IN CONFIG ] and never animates.
   */
  stats: {
    projects: number | null;
    clientProjects: number | null;
    internships: number | null;
  };

  /** Fill only if there is a current job. When null the Current Role block is not rendered. */
  currentRole: { title: string; organization: string; since: string } | null;
}

export const config: SiteConfig = {
  name: 'P.SAI GREESHMITHA',
  shortName: 'P.SAI GREESHMITHA',
  roleLine: 'Software Engineer | Full Stack Developer | Project Manager',
  headline: 'I build real-world software, AI-powered applications, and scalable digital products.',
  supporting:
    'From an AI interview platform and a hyperlocal community platform to hospital, education and business software built for clients — designed and developed end to end.',
  availability: 'Available for Software Projects',

  email: 'greeshmithagowd@gmail.com',
  phone: '+91 70137 14327',
  location: 'Kuppam, Chittoor District, Andhra Pradesh',
  linkedinUrl: 'https://www.linkedin.com/in/p-saigreeshmitha-gowd',
  githubUrl: 'https://github.com/PSAIGREESHMITHA0213823',
  resumeUrl: 'https://go.fliplink.me/view/73757DCB-88C3-432E-BAAF-8ACC749A3D9E',
  portraitUrl: '/portrait.jpg', // WebP version at /portrait.webp, face crop at /avatar.webp

  siteUrl: null,

  // Assumed from education in Kuppam, India. Change if the owner is elsewhere.
  timeZone: 'Asia/Kolkata',

  formEndpoint: null,
  netlifyForm: 'project-inquiry',

  stats: {
    projects: null,
    clientProjects: null,
    internships: 3,
  },

  currentRole: null,
};

/** Label used wherever a config value is missing. */
export const PLACEHOLDER = {
  config: 'SET IN CONFIG',
  details: 'ADD DETAILS',
  confirm: 'CONFIRM',
  outcome: 'ADD OUTCOME',
  year: 'ADD YEAR',
  description: 'ADD DESCRIPTION',
  stack: 'CONFIRM STACK',
} as const;
