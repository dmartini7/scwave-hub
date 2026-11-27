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
   per DNA phase and third of the field (Def ⅓ / Mid ⅓ / Final ⅓), in the deck's own wording. */
const IDP_POSITIONS = {
  GK: { label: 'Goalkeeper (#1)',
    quals: 'Confident · Athletic · Decisive · Coach on the field · Accurate, confident passing (short & long)',
    att: 'Def ⅓ — Position to support the back pass; pass forward or wide to spread out and/or begin the build-up.\nMid ⅓ — Position to support the back pass if the ball cannot be played forward.\nFinal ⅓ — Push up the defensive line and organize teammates to prevent counter-attacks.',
    atod: 'Def ⅓ — Stay connected to the back line; organize teammates.\nMid ⅓ — Organize teammates to be balanced and compact.\nFinal ⅓ — Position behind the defensive line to take preventive defensive action.',
    def: 'Def ⅓ — Organize teammates on when to switch from zonal to player tracking; anticipate crosses and shots.\nMid & Final ⅓ — Position to provide cover; anticipate and intercept long balls behind the defensive line.',
    dtoa: 'Def ⅓ — Pass forward (long) quickly to exploit the opponent and create a 1v1; keep the ball when you cannot play forward.\nMid ⅓ — Push the defensive line up; support the back pass if the ball cannot go forward.\nFinal ⅓ — Organize teammates to prevent counter-attacks.' },
  CB: { label: 'Center Back (#4 / #5)',
    quals: 'Positionally dominant · Vocal leader · Technically skilled · Athletic · Aerially dominant',
    att: 'Def ⅓ — Spread out to give the GK a passing option; play accurate forward/diagonal passes between and behind the opposition lines.\nMid ⅓ — Move forward with or without the ball to create a 2v1; support if the ball cannot be played forward.\nFinal ⅓ — Push up the defensive line and organize teammates to take preventive defensive action.',
    atod: 'Def ⅓ — If closest, pressure the ball immediately to prevent danger.\nMid ⅓ — Quick decision to pressure the ball, delay the attack, or drop back.\nFinal ⅓ — Take preventive defensive action.',
    def: 'Def ⅓ — Deny the opponent 1v1 (air and ground); be first to every cross; clear the ball from danger areas.\nMid ⅓ — Read the situation (pressure/cover, zone, man-mark); move in partnership with the other CB.\nFinal ⅓ — Lead and organize the defensive line; intercept long and through passes.',
    dtoa: 'Def ⅓ — Move quickly into position to support in space; pass or dribble forward.\nMid ⅓ — Coach the defensive line to push up as a unit.' },
  FB: { label: 'Full Back (#2 / #3)',
    quals: 'High level of endurance · Proficient dribbler · High concentration / anticipation · Proficient cross & long passing · Proficient 1v1 defending',
    att: 'Def ⅓ — Position wide and high to receive and/or create space; pass forward (diagonal or behind) or hold the ball.\nMid ⅓ — Support the attack wide and with runs behind; give balance on the opposite side.\nFinal ⅓ — Pass or dribble forward to create 1v1 or 2v1 (overlaps); play the early cross when there is space behind the line.',
    atod: 'Def & Final ⅓ — If closest, pressure the ball immediately.\nMid ⅓ — If farthest, drop back quickly to rejoin the defensive line; read the situation to press or drop.',
    def: 'Def ⅓ — Pressure the ball to regain it or delay the attack; deny penetration and crosses 1v1.\nMid ⅓ — Organize and coach fellow defenders; move centrally to cover when the ball is on the opposite side.\nFinal ⅓ — Position and reposition to intercept passes while monitoring the opponent.',
    dtoa: 'Def ⅓ — Give quick support in space (forward and wide).\nMid ⅓ — Move up with the defensive line as a unit.\nFinal ⅓ — Pass or dribble forward quickly to exploit a disorganized opponent.' },
  DM: { label: 'Defensive Midfielder (#6)',
    quals: 'Strong tackling ability · Athletic · Positionally dominant · Accurate, efficient distribution · Controls / dictates the tempo',
    att: 'Def ⅓ — Position centrally to support diagonally in spaces between the lines; play diagonal passes to unbalance the opponent.\nMid ⅓ — Align with the other midfielders, rotate positions and triangulate; dribble forward when there is no option.\nFinal ⅓ — Support the attack with forward runs and goals; stay positioned to take preventive defensive action.',
    atod: 'Def ⅓ — If closest, pressure the ball immediately.\nMid ⅓ — Quick decision to pressure, delay the attack when the team is disorganized, or drop back.\nFinal ⅓ — Position to take preventive defensive action.',
    def: 'Def & Mid ⅓ — Decide when to switch from zonal marking to player tracking.\nMid ⅓ — Defend the opponent, the passing lanes and the central space in front of the CBs; pressure the ball.\nFinal ⅓ — Organize teammates to keep the team compact; deny penetration 1v1.',
    dtoa: 'Def ⅓ — Move quickly to support in space and wide; play diagonal passes or dribble to create a 2v1.\nMid ⅓ — Keep the ball when you cannot play forward and manage the pace of the game.' },
  CM: { label: 'Central / Attacking Midfielder (#8 / #10)',
    quals: 'CM: High endurance · Proficient dribbler · Calm under pressure · Accurate, efficient passing · Accurate finishing 18–30 yds — ACM: Dynamic dribbler · Creative · Accurate finishing from all ranges · Penetrates the back line',
    att: 'Def ⅓ — Position centrally and diagonally in spaces between the lines; align with the other midfielders and triangulate.\nMid ⅓ — Dribble forward when there is no passing option; play diagonal and through passes to unbalance the opponent.\nFinal ⅓ — Support the attack with forward runs behind the defensive line; position to support in the box near goal.',
    atod: 'Def & Final ⅓ — If closest, pressure the ball immediately.\nMid ⅓ — Quick decision to pressure, delay the attack, or drop back.',
    def: 'Def ⅓ — Recover into the defensive third to help the #6 and #8; anticipate the next attacking action.\nMid ⅓ — Prevent the opponent from dribbling or passing forward.\nFinal ⅓ — Organize and coach teammates to press in identified situations; pressure, stay in zone, or track the holding mid.',
    dtoa: 'Def ⅓ — Move quickly to support in space; play diagonal passes or dribble to create a 2v1.\nMid ⅓ — Keep the ball when you cannot play forward and manage the pace of the game.\nFinal ⅓ — Support quickly in space to exploit the opponent and create chances.' },
  WF: { label: 'Wide Forward (#7 / #11)',
    quals: 'Dynamic dribbler (1v1) · Creative · Positionally dominant · Accurate, dynamic crossing · High endurance, good speed · Accurate finishing inside & outside the penalty area',
    att: 'Def ⅓ — Position high and wide as the starting point to spread the opposition and create space for teammates.\nMid ⅓ — Vary supporting movements in space between/behind the defensive line; pass or dribble forward to create 1v1 / 2v1.\nFinal ⅓ — Take on defenders 1v1: outside for crosses or inside to score; move into goal-scoring positions at the back post.',
    atod: 'Def & Final ⅓ — If closest, pressure the ball immediately.\nMid ⅓ — Quick decision to pressure, delay, or drop back; follow direction from teammates behind.',
    def: 'Def ⅓ — Recover and track into the defensive third to help the full back when needed.\nMid ⅓ — Move centrally to provide cover and balance when the ball is on the opposite side.\nFinal ⅓ — Read the situation to defend space and opponent; stop the opponent dribbling or passing forward (1v1).',
    dtoa: 'Def ⅓ — Move quickly into position to support in space.\nMid ⅓ — Keep the ball when you cannot play forward.\nFinal ⅓ — Position and support quickly in space to exploit the opponent and create chances.' },
  FWD: { label: 'Forward (#9)',
    quals: 'Dynamic dribbler · Creative · Good touch / control · Positionally dominant · Aerially dominant · Athletic · Accurate finishing inside & outside the penalty area',
    att: 'Def ⅓ — Position high and central as a target to occupy the opposition #4 and #5; receive, hold/protect and lay off the ball to create space.\nMid ⅓ — Make varied forward runs into space behind the defensive line; pass or dribble forward to create 1v1 or 2v1.\nFinal ⅓ — Make varied, well-timed runs in the box near goal to finish chances or create for teammates.',
    atod: 'Def ⅓ — Position and support on the side of the field for clearances; prevent the opponent from sustaining the attack.\nMid ⅓ — Quick decision to pressure, delay, or drop back; follow direction from teammates behind.\nFinal ⅓ — If closest, pressure the ball immediately.',
    def: 'Def ⅓ — Anticipate the next attacking action and position for it.\nMid ⅓ — Force the opponent to one side / prevent the switch; pressure the ball and help teammates outnumber the opponent.\nFinal ⅓ — Read the situation; pressure, stay in zone, or track the opposition center back.',
    dtoa: 'Def ⅓ — Move quickly into position (onside) to support high up the field.\nMid ⅓ — Keep the ball: hold and protect it while teammates support the attack.\nFinal ⅓ — Position and support quickly in space to exploit the opponent and create chances.' }
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
