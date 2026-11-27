/* SC Wave coaches area — shared data and helpers for the IDP dashboard and editor. */

const IDP_TEAMS = [
  'MLS NEXT U13 Homegrown (2014)', 'MLS NEXT U14 Homegrown (2013)', 'MLS NEXT U15 Homegrown (2012)',
  'MLS NEXT U16 Homegrown (2011)', 'MLS NEXT U17 Homegrown (2010)', 'MLS NEXT U18-U19 Homegrown (2008-2009)',
  'MLS NEXT U13 Academy', 'MLS NEXT U14 Academy', 'MLS NEXT U15 Academy',
  'MLS NEXT U16 Academy', 'MLS NEXT U17 Academy', 'MLS NEXT U18/U19 Academy'
];

const IDP_STATUS = {
  draft: { label: 'Draft', color: '#6B6B6B' },
  review: { label: 'Ready for review', color: '#C49A10' },
  approved: { label: 'Approved', color: '#16A34A' }
};

/* Roles & responsibilities from the SC Wave Positional Profile and Key Qualities deck (2025-26),
   condensed to one line per DNA phase. */
const IDP_POSITIONS = {
  GK: { label: 'Goalkeeper (#1)',
    quals: 'Confident · Athletic · Decisive · Coach on the field · Accurate, confident passing (short & long)',
    att: 'Support the back pass; pass forward or wide to spread the team and start the build-up; vary and trust the distribution.',
    atod: 'Stay connected to the back line; organize teammates to be balanced and compact.',
    def: 'Organize the switch from zonal to player tracking; anticipate crosses and shots; cover balls played behind the line.',
    dtoa: 'Play long and forward quickly to create a 1v1; keep the ball if forward is not on; push the line up.' },
  CB: { label: 'Center Back (#4 / #5)',
    quals: 'Positionally dominant · Vocal leader · Technically skilled · Athletic · Aerially dominant',
    att: 'Spread out to give the GK an option; play accurate forward and diagonal passes between and behind lines; step in with the ball to create a 2v1.',
    atod: 'If closest, press the ball immediately; otherwise decide to pressure, delay or drop.',
    def: 'Win 1v1s in the air and on the ground; first to every cross; lead and organize the line with the other CB; intercept long and through balls.',
    dtoa: 'Support quickly in space; pass or dribble forward; push the defensive line up as a unit.' },
  FB: { label: 'Full Back (#2 / #3)',
    quals: 'High endurance · Proficient dribbler · Concentration & anticipation · Crossing & long passing · Defending 1v1',
    att: 'Position wide and high; play forward or hold; overlap to create 1v1/2v1; play the early cross when space is behind the line.',
    atod: 'If closest, press immediately; if farthest, drop quickly and rejoin the line.',
    def: 'Pressure the ball to win it or delay; deny penetration and crosses in 1v1; tuck in to cover when the ball is on the far side.',
    dtoa: 'Give quick support forward and wide; pass or dribble forward fast when the opponent is disorganized.' },
  DM: { label: 'Defensive Midfielder (#6)',
    quals: 'Strong tackler · Athletic · Positionally dominant · Accurate, efficient distribution · Controls the tempo',
    att: 'Support centrally between the lines; rotate and triangulate with the midfield; play diagonal passes to unbalance the opponent.',
    atod: 'If closest, press immediately; otherwise pressure, delay or drop to protect the middle.',
    def: 'Screen the space and passing lanes in front of the CBs; decide zone vs. player tracking; keep the team compact; win 1v1s.',
    dtoa: 'Support quickly in space; keep the ball when forward is not on and manage the pace of the game.' },
  CM: { label: 'Central / Attacking Midfielder (#8 / #10)',
    quals: 'High endurance · Proficient dribbler · Calm under pressure · Accurate, efficient passing · Finishing from 18–30 yds',
    att: 'Find space between the lines and in the half space; combine in triangles; dribble or pass forward to break lines; arrive in the box.',
    atod: 'If closest, press the ball immediately; otherwise delay or drop to protect the middle.',
    def: 'Stop forward passes and dribbles in our mid/high block; recover to help the #6; organize the press.',
    dtoa: 'Support quickly in space; play forward if it is on, keep the ball and set the tempo if not.' },
  WF: { label: 'Wide Forward (#7 / #11)',
    quals: 'Dynamic 1v1 dribbler · Creative · Accurate, dynamic crossing · High endurance & speed · Finishing inside and outside the box',
    att: 'Start high and wide to stretch the opponent; attack 1v1 outside to cross or inside to score; attack the back post.',
    atod: 'If closest, press immediately; otherwise pressure, delay or drop on teammates’ direction.',
    def: 'Track back to help the full back; tuck in for balance when the ball is on the far side; stop forward dribbles and passes.',
    dtoa: 'Support quickly in space to exploit the opponent and create chances; keep the ball if forward is not on.' },
  FWD: { label: 'Forward (#9)',
    quals: 'Dynamic dribbler · Creative · Good touch · Positionally & aerially dominant · Athletic · Finishing inside and outside the box',
    att: 'Pin the center backs as a target; receive, hold and lay off; make varied runs behind the line; time runs in the box to finish.',
    atod: 'If closest, press immediately; force play to one side and stop the switch.',
    def: 'Lead the press with the team; decide to pressure, stay in zone or track the center back.',
    dtoa: 'Hold and protect the ball while teammates join; move quickly (onside) to support high up the field.' }
};

function idpBlank() {
  return {
    p: { name: '', num: '', posKey: '', pos: '', age: '', team: '', season: '2026–27', coach: '', date: '',
         games: '', goals: '', mins: '', before: '', now: '', review: '', takaUrl: '' },
    role: { quals: '', att: '', atod: '', def: '', dtoa: '' },
    corners: [
      { t: 'Technical', items: [
        { n: 'Passing — accuracy & range', ph: 'Attacking', tk: 'Passing', b: '', c: '' },
        { n: 'Dribbling & 1v1 to progress', ph: 'Attacking', tk: 'Creativity', b: '', c: '' },
        { n: 'Finishing / final action', ph: 'Attacking', tk: 'Finishing', b: '', c: '' } ] },
      { t: 'Tactical', items: [
        { n: 'Positioning in our attacking shape', ph: 'Attacking', tk: 'Off Ball', b: '', c: '' },
        { n: 'Transition decisions', ph: 'Transitions', tk: '', b: '', c: '' },
        { n: 'Defensive shape & recovery runs', ph: 'Defending', tk: 'Defending', b: '', c: '' } ] },
      { t: 'Physical', items: [
        { n: 'Endurance — 90 min intensity', ph: 'All phases', tk: '', b: '', c: '' },
        { n: 'Speed & acceleration', ph: 'Transitions', tk: 'Physical', b: '', c: '' },
        { n: 'Strength in duels', ph: 'Defending', tk: 'Physical', b: '', c: '' } ] },
      { t: 'Mental', items: [
        { n: 'Composure under pressure', ph: 'All phases', tk: '', b: '', c: '' },
        { n: 'Initiative & bravery on the ball', ph: 'Attacking', tk: '', b: '', c: '' },
        { n: 'Communication & leadership', ph: 'Defending', tk: '', b: '', c: '' } ] }
    ],
    strengths: '', workon: '',
    taka: { note: '', skills: [] },
    goals: [{ g: '', a: '', m: '', by: '' }, { g: '', a: '', m: '', by: '' }],
    games: [], coach: '', player: ''
  };
}

/* New IDP for a player, pre-filled from the team and the positional profile. */
function idpBuild(name, team, posKey, coachName) {
  const data = idpBlank(), pre = IDP_POSITIONS[posKey];
  data.p.name = name; data.p.team = team;
  const age = String(team || '').match(/U\d+(?:[-\/]U\d+)?/); data.p.age = age ? age[0] + ' Boys' : '';
  data.p.coach = coachName || '';
  data.p.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  data.p.before = 'Dec 2025';
  data.p.now = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  data.p.takaUrl = takaSearchUrl(name);
  if (pre) { data.p.posKey = posKey; data.p.pos = pre.label; data.role = { quals: pre.quals, att: pre.att, atod: pre.atod, def: pre.def, dtoa: pre.dtoa }; }
  return data;
}

/* TAKA draws its "Top 20%" line at about 81% of the bar scale (measured on the TAKA IDP, Nov 2026). */
const TAKA_TOP20 = 81;
/* Suggested 1–4 game rating from TAKA's game bar (coaches can change it). */
function takaSuggestRating(pct) {
  if (pct == null) return '';
  const r = pct / TAKA_TOP20;
  return r >= 1.1 ? '4' : r >= 1.0 ? '3.5' : r >= 0.9 ? '3' : r >= 0.83 ? '2.5' : r >= 0.75 ? '2' : '1.5';
}
/* Draft development goals for a TAKA development area, written for the SC Wave Game Model and training week. */
const TAKA_GOALS = {
  Passing: { g: 'Pass forward with quality: scan before receiving and play more diagonal and through passes to break lines (Phase 1 · Attacking).',
    a: 'Monday technical: 2-touch rondos and passing patterns with scanning cues. Tue/Wed positional games that reward line-breaking passes. Review TAKA passing clips every two weeks.' },
  Defending: { g: 'Defend the middle: block forward passes, win interceptions and recover quickly to support the #6 (Phases 2–3 · Transition & Defending).',
    a: 'Tue/Wed 4v4+2 and 6v6 transition games with press / delay / drop cues. Recovery-run reps from the attacking third. Review TAKA defending clips every two weeks.' },
  Creativity: { g: 'Create more in the final third: beat a player 1v1 and play forward through the lines (Phase 1 · Attacking).',
    a: '1v1 / 2v1 attacking circuits. Positional games that reward line-breaking dribbles and passes. Winter futsal 1× per week.' },
  Finishing: { g: 'Finish with composure: more shots on target from the edge of the box and on late runs (Chance creation / Scoring).',
    a: 'Weekly finishing block: first-time and 18–30 yd shots, late-arrival patterns into the box. 50 extra shots per week on your own.' },
  Physical: { g: 'Be stronger and repeat high-intensity actions for the full game (all phases).',
    a: 'Winter speed / agility / strength program at MOSH 2× per week. Shielding and 50/50 duel work in training. Repeated-sprint conditioning.' },
  'Off Ball': { g: 'Better positioning off the ball: find the half space between the lines and time forward runs (Phase 1 · Attacking).',
    a: 'Positional play games with zones and third-man runs. Video on scanning and body shape. Run-timing patterns in Thursday sessions.' },
  Duels: { g: 'Win more duels on the ground: body position, timing and aggression (Phases 2–3).',
    a: '1v1 defending and shielding duels every session. Small-sided games scored on duels won. Strength program 2× per week.' },
  Possession: { g: 'Keep the ball under pressure: receive on the half-turn and play out of tight spaces (Phase 4 · Defend → Attack).',
    a: 'Rondos and tight-space positional games. Futsal 1× per week. Receiving-on-the-turn patterns.' },
  Aerial: { g: 'Win more aerial duels in both boxes: timing, approach and body (Defending & set pieces).',
    a: 'Heading technique and jumping/timing reps 2× per week. Crossing-and-defending small-sided games.' }
};
function takaGoal(skill, v) {
  const t = TAKA_GOALS[skill] || { g: `Raise ${skill} toward the Top 20% level in MLS NEXT.`, a: `Position-specific ${skill.toLowerCase()} work in Tue/Wed sessions. Review TAKA clips every two weeks.` };
  const target = v ? Math.min(100, Number(v) + 7) : 90;
  return { g: t.g, a: t.a, m: `TAKA ${skill}: from ${v ? v + '%' : 'current level'} to ${target}%+ of the Top 20% level (re-check with the TAKA button). Coach rating 3 or higher.` };
}

/* "SC Wave MLS NEXT U17 AD" → "MLS NEXT U17 Academy"; "… HD" → Homegrown */
function takaTeamHint(team) {
  const m = String(team || '').match(/U(\d+)/); if (!m) return '';
  return /\bAD\b|Academy/i.test(team) ? `U${m[1]} Academy` : /\bHD\b|Homegrown/i.test(team) ? `U${m[1]} Homegrown` : `U${m[1]}`;
}

/* Link to the player's search in TAKA (opens in the coach's own TAKA login). */
function takaSearchUrl(name) {
  const first = String(name || '').trim().split(/\s+/)[0] || '';
  return 'https://taka.io/soccer/athletes?playerName=' + encodeURIComponent(first);
}

/* ── Paste from TAKA ────────────────────────────────────────────────────
   Reads the text a coach copies (Cmd+A, Cmd+C) from TAKA → Assistant Coach → IDP,
   on either the Skill Analysis or the Performance Monitoring tab. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Skill names TAKA uses across positions (used when a coach copies only part of the page).
const TAKA_SKILLS = ['Creativity', 'Finishing', 'Physical', 'Off Ball', 'Passing', 'Defending', 'Duels', 'Possession',
  'Aerial', 'Crossing', 'Dribbling', 'Shot Stopping', 'Distribution', 'Handling', 'Sweeping', 'Positioning', 'Pressing'];

function parseTaka(text, opts = {}) {
  const t = String(text || '').replace(/\r/g, '');
  const lines = t.split('\n').map(s => s.trim()).filter(Boolean);
  const out = { header: {}, skills: [], benchmark: '', season: '', games: [], warnings: [] };

  const hm = t.match(/#(\d+),\s*([A-Z]{1,4}),\s*(U\d+\s+\w+)/);
  if (hm) { out.header.num = hm[1]; out.header.posCode = hm[2]; out.header.age = hm[3]; }
  const nameIdx = lines.findIndex(l => /^#\d+,/.test(l));
  if (nameIdx > 0) out.header.name = lines[nameIdx - 1];
  const after = label => { const i = lines.indexOf(label); return i >= 0 ? lines[i + 1] : ''; };
  if (after('Team')) out.header.team = after('Team');
  if (/^\d+$/.test(after('Games'))) out.header.games = after('Games');
  if (/^\d+$/.test(after('Goals'))) out.header.goals = after('Goals');
  const sm = t.match(/\b(20\d\d)-(20\d\d)\b/);
  if (sm) out.season = `${sm[1]}–${sm[2].slice(2)}`;
  const bm = t.match(/Top 20% (U\d+ [A-Z]{1,4}s?)/);
  if (bm) out.benchmark = `Top 20% of ${bm[1]}`;

  // "5 games played as CM between December 2025 and July 2026." (comparison view)
  const gp = t.match(/(\d+)\s+games? played as\s+([A-Z]{1,4})\s+between\s+([A-Z][a-z]+ \d{4})\s+and\s+([A-Z][a-z]+ \d{4})/);
  if (gp) out.period = { games: gp[1], pos: gp[2], from: gp[3], to: gp[4] };

  // Skill Analysis. TAKA has two layouts:
  //   single season  → "Key Strengths" / "Development Opportunities"
  //   baseline vs. compared-to → "What Improved" / "Areas To Work On"
  const find = re => lines.findIndex(l => re.test(l));
  const bi = find(/^Top 20%/);
  const ki = find(/^Key Strengths$/i), di = find(/^Development Opportunities$/i);
  const wi = find(/^What Improved$/i), ai = find(/^Areas To Work On$/i);
  const firstHead = [ki, di, wi, ai].filter(i => i >= 0).sort((a, b) => a - b)[0];
  let names = [];
  if (bi >= 0 && firstHead > bi) names = lines.slice(bi + 1, firstHead).filter(l => /^[A-Za-z][A-Za-z ]{1,24}$/.test(l) && !/^Top 20%/.test(l));
  if (!names.length) names = TAKA_SKILLS.filter(n => lines.includes(n)); // partial copy: fall back to TAKA's skill names
  const section = (start, ends) => {
    if (start < 0) return new Set();
    const stop = ends.filter(i => i > start).sort((a, b) => a - b)[0];
    return new Set(lines.slice(start + 1, stop).filter(l => names.includes(l)));
  };
  const heads = [ki, di, wi, ai];
  const strengths = section(ki, heads), devs = section(di, heads), improved = section(wi, heads), workOn = section(ai, heads);
  // TAKA's one-line description under each skill in the strength / development lists
  out.desc = {};
  [ki, di, wi, ai].filter(i => i >= 0).forEach(start => {
    for (let i = start + 1; i < lines.length - 1; i++) {
      if (heads.includes(i)) break;
      if (names.includes(lines[i]) && !names.includes(lines[i + 1]) && !/^(Key Strengths|Development Opportunities|What Improved|Areas To Work On)$/i.test(lines[i + 1])) out.desc[lines[i]] = lines[i + 1];
    }
  });
  if (names.length && firstHead !== undefined) {
    out.compare = wi >= 0 || ai >= 0;
    out.skills = names.map(n => ({ n, s:
      strengths.has(n) ? 'Key Strength' : improved.has(n) ? 'Improved' :
      devs.has(n) || workOn.has(n) ? 'Dev. Opportunity' : 'On Par' }));
  }

  // Performance Monitoring: blocks of  W|D|L / "a - b" / "15 Nov" / Home|Away  (score is home – away).
  const startYear = sm ? Number(sm[1]) : null;
  const fixDate = opts.fixDate !== false; // TAKA's IDP chart shows each date one day early
  const re = /(?:^|\n)\s*(W|D|L)\s*\n\s*(\d+)\s*-\s*(\d+)\s*\n\s*(\d{1,2})\s+([A-Z][a-z]{2})\s*\n\s*(Home|Away)/g;
  let m;
  while ((m = re.exec(t))) {
    const [, res, a, b, dd, mon, ha] = m;
    const mi = MONTHS.indexOf(mon);
    if (mi < 0) continue;
    let year = startYear ? (mi >= 7 ? startYear : startYear + 1) : new Date().getFullYear();
    const d = new Date(Date.UTC(year, mi, Number(dd)));
    if (fixDate) d.setUTCDate(d.getUTCDate() + 1);
    const home = ha === 'Home';
    const us = home ? a : b, them = home ? b : a;
    out.games.push({
      iso: d.toISOString().slice(0, 10),
      d: `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`,
      o: '', ha: home ? 'H' : 'A', r: `${res} ${us}–${them}`, mins: '', rt: '', n: ''
    });
  }
  if (!out.skills.length && !out.games.length) out.warnings.push('No TAKA skills or games found in the pasted text.');
  return out;
}

const idpEsc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function idpWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso), now = new Date();
  const mins = Math.round((now - d) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24 && d.getDate() === now.getDate()) return `today ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
}

async function idpApi(path, opts = {}) {
  const res = await fetch('/api/' + path, {
    method: opts.method || 'GET', credentials: 'same-origin',
    headers: opts.body ? { 'Content-Type': 'application/json' } : {},
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  let body = null;
  try { body = await res.json(); } catch (e) { /* non-JSON (e.g. sign-in redirect) */ }
  if (res.status === 401) { location.href = '/coaches/login.html?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('signed out'); }
  return { status: res.status, ok: res.ok, body };
}
