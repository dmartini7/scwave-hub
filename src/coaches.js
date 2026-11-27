// SC Wave MLS NEXT coaching staff allowed into /coaches (2026-27 Academy + Homegrown teams).
// Source: PlayMetrics staff list (Nov 2026). Cloudflare Access enforces the same list at the edge;
// this file is the second check and gives each email a display name and a role.
//   director — can approve IDPs, edit approved IDPs, and delete IDPs
//   coach    — can create and edit IDPs and mark them "Ready for review"
export const COACHES = [
  { name: 'Daniel Mattos', role: 'director', emails: ['danielmartini07@gmail.com'] },
  { name: 'Marcio Leite', role: 'director', emails: ['marcioleite7@hotmail.com'] },
  { name: 'Andre Hayne', role: 'director', emails: ['andre_hayne@hotmail.com'] },
  { name: 'Andy Kohel', role: 'coach', emails: ['akohel@carrollu.edu'] },
  { name: 'Hugo Quintanilha', role: 'coach', emails: ['coach.hugofq@gmail.com', 'coachhugofq@gmail.com'] },
  { name: 'Fernando Souza', role: 'coach', emails: ['ferhsouza88@gmail.com'] },
  { name: 'Steve Sagadin', role: 'coach', emails: ['sagadin78@hotmail.com'] },
  { name: 'Tom Torres', role: 'coach', emails: ['tftorres7@gmail.com'] },
  { name: 'Tyler Howard', role: 'coach', emails: ['tylerh@mksc.org'] },
  { name: 'Tylor Bacher', role: 'coach', emails: ['scwacademydirector@gmail.com', 'tylor.bacher09@gmail.com'] }
];

export function findCoach(email) {
  const e = String(email || '').trim().toLowerCase();
  return COACHES.find(c => c.emails.some(x => x.toLowerCase() === e)) || null;
}

export function nameFor(email) {
  const c = findCoach(email);
  return c ? c.name : (email || '');
}
