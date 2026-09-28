import type { SkillGroup } from './types';

/**
 * Technology ecosystem. Add TypeScript to Languages only once confirmed.
 * A technology appearing in several groups (e.g. Java) is one node in the map.
 */
export const skillGroups: SkillGroup[] = [
  { id: 'languages', label: 'Languages', items: ['Java', 'Python', 'JavaScript'] },
  { id: 'frontend', label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React.js'] },
  { id: 'backend', label: 'Backend', items: ['Node.js', 'FastAPI', 'Django', 'Java'] },
  { id: 'databases', label: 'Databases', items: ['MySQL', 'PostgreSQL', 'Supabase'] },
  {
    id: 'ai',
    label: 'AI',
    items: ['Gemini', 'AI APIs', 'Speech technologies', 'AI-powered application development'],
  },
  { id: 'tools', label: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'Railway', 'VS Code'] },
];

export const allSkills = [...new Set(skillGroups.flatMap((g) => g.items))];
