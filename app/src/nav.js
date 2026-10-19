// One-shot hints passed between pages (e.g. Dashboard -> Focus with a subject preselected).
export const intent = {}

// Primary sections and their pages. Page ids are the URL hash (#/days).
export const NAV = [
  { id: 'home', label: 'Home', subs: [['today', 'Today'], ['mission', 'Mission']] },
  { id: 'plan', label: 'Plan', subs: [['days', 'Days'], ['topics', 'Topics'], ['syllabus', 'Syllabus']] },
  { id: 'learn', label: 'Learn', subs: [['tricks', 'Tricks'], ['notes', 'Notes'], ['pyq', 'Papers'], ['library', 'Library'], ['resources', 'Links'], ['exam', 'Pattern']] },
  { id: 'practice', label: 'Practice', subs: [['quiz', 'Quiz'], ['speed', 'Speed Maths'], ['cards', 'Cards'], ['focus', 'Focus']] },
  { id: 'track', label: 'Track', subs: [['mocks', 'Mocks'], ['errors', 'Errors'], ['rewards', 'Rewards'], ['community', 'Group'], ['settings', 'Settings']] },
]
export const groupOf = (page) => NAV.find((g) => g.subs.some((s) => s[0] === page)) || NAV[0]
