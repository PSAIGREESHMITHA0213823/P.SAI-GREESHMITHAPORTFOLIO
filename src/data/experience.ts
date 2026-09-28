import type { Experience } from './types';

/** Newest first. `details` stays empty until the owner supplies responsibilities. */
export const experience: Experience[] = [
  {
    id: 'shnoor',
    organization: 'Shnoor International LLC',
    role: 'Full Stack Development Intern',
    year: 2026,
    mode: 'Virtual',
    duration: '3 months',
    technologies: ['React.js', 'Node.js', 'PostgreSQL'],
    details: ['Completed an international internship focused on full-stack web development using React, Node.js and PostgreSQL.'],
  },
  {
    id: 'onestop',
    organization: 'OneStop',
    role: 'Artificial Intelligence Intern',
    year: 2025,
    mode: 'Virtual',
    duration: '2 months',
    technologies: [],
    details: ['Gained hands-on experience in core AI through real-time projects.'],
  },
  {
    id: 'smartbridge',
    organization: 'SmartBridge Educational Services',
    role: 'AI & ML Intern',
    year: 2025,
    mode: 'Virtual',
    duration: '2 months',
    technologies: [],
    details: ['Completed a project-based internship focused on AI & ML workflows.'],
  },
];

export const education = {
  degree: 'B.Tech, Computer Science & Engineering',
  institution: 'Kuppam Engineering College',
  start: 2022,
  end: 2026,
  score: '90%',
};

export const schooling = [
  { level: 'SSC', institution: 'Adarsha (EM) High School', start: 2019, end: 2020, score: '93%' },
  { level: 'Intermediate', institution: 'AP Model School & Junior College', start: 2020, end: 2022, score: '76%' },
];
