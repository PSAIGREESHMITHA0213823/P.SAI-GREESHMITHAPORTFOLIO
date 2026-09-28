import type { Achievement } from './types';

export const achievements: Achievement[] = [
  { title: 'College Topper', years: [2022, 2023, 2024], detail: null, kind: 'academic' },
  {
    title: 'Winner — Tech Fest',
    years: [],
    detail: 'Elocution, Extempore Speech, Turncoat Debate & Press Meet',
    kind: 'competition',
  },
  { title: 'Winner — Essay Writing & Drawing competitions', years: [], detail: null, kind: 'competition' },
  {
    title: 'TechTalk',
    years: [],
    detail: 'Thimmayya Institute, KGF — 2nd in Extempore, 3rd in Debate',
    kind: 'talk',
  },
  { title: 'Paper presentation — 2nd Prize', years: [], detail: 'Kuppam Engineering College', kind: 'paper' },
  { title: 'Paper presentation', years: [], detail: 'Bargur Engineering College', kind: 'paper' },
];
