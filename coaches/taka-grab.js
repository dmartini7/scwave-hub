/* SC Wave — "Send to SC Wave IDP" (runs on taka.io when a coach clicks the bookmark button).
   Reads the player's TAKA Individual Development Plan that is open on screen: skill bars and statuses,
   and every game (all seasons) with opponent, result, home/away and TAKA's game rating bar.
   Nothing is sent anywhere until the coach clicks "Fill SC Wave IDP"; then the data travels in the
   address of the new tab (after the #), which is never sent to a server. */
(async () => {
  const SITE = 'https://coaches.scwaveplayerhub.com';
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = async (fn, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { try { if (fn()) return true; } catch (e) {} await sleep(250); } return false; };

  /* ── on-screen panel ── */
  document.getElementById('scw-taka-panel')?.remove();
  const panel = document.createElement('div');
  panel.id = 'scw-taka-panel';
  panel.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;width:340px;background:#0D0D0D;color:#fff;border:1px solid #333;border-top:4px solid #F5C518;border-radius:12px;padding:16px 18px;font:14px/1.5 Inter,Arial,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.6)';
  panel.innerHTML = '<div style="font:900 18px Arial;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">SC Wave · <span style="color:#F5C518">TAKA import</span></div><div id="scw-msg">Reading TAKA…</div><div id="scw-act" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"></div>';
  document.body.appendChild(panel);
  const say = html => { panel.querySelector('#scw-msg').innerHTML = html; };
  const close = () => panel.remove();
  const btn = (label, primary, fn) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = `cursor:pointer;border-radius:8px;padding:9px 14px;font:700 13px Arial;border:1px solid ${primary ? '#F5C518' : '#555'};background:${primary ? '#F5C518' : '#242424'};color:${primary ? '#0D0D0D' : '#fff'}`;
    b.onclick = fn; panel.querySelector('#scw-act').appendChild(b); return b;
  };
  const fail = html => { say(html); btn('Close', false, close); };

  if (!/(^|\.)taka\.io$/.test(location.hostname)) return fail('This button works on <b>taka.io</b>. Open the player\'s IDP in TAKA, then click it again.');
  const lists = [...document.querySelectorAll('[role=tablist][aria-label="IDP view selector"]')];
  if (!lists.length) return fail('Open a player\'s IDP first:<br>TAKA → <b>Assistant Coach</b> → <b>Individual Development Plan</b> → choose the player.<br>Then click the button again.');
  const tl = lists[lists.length - 1];                       // the most recent IDP in the chat
  let root = tl; for (let i = 0; i < 10 && root.parentElement; i++) { root = root.parentElement; if (/#\d+,\s*[A-Z]{1,4},/.test(root.innerText) && /Athlete Assessments/.test(root.innerText)) break; }
  const tab = name => [...tl.querySelectorAll('[role=tab]')].find(t => t.textContent.trim() === name);

  /* ── header ── */
  const head = root.innerText;
  const hm = head.match(/\n?([^\n]+)\n\s*#(\d+),\s*([A-Z]{1,4}),\s*(U\d+\s+\w+)/);
  const after = label => { const m = head.match(new RegExp('\\n' + label + '\\s*\\n\\s*([^\\n]+)')); return m ? m[1].trim() : ''; };
  const data = {
    v: 1, at: new Date().toISOString(),
    name: hm ? hm[1].trim() : '', num: hm ? hm[2] : '', pos: hm ? hm[3] : '', age: hm ? hm[4] : '',
    team: after('Team'), games: after('Games'), goals: after('Goals'),
    skillText: '', skills: [], seasons: [], games_list: []
  };
  if (!data.name) return fail('Could not read the player\'s name from this TAKA page. Scroll to the player\'s IDP and try again.');
  say(`Reading <b>${data.name}</b>'s skills…`);

  /* ── Skill Analysis ── */
  tab('Skill Analysis')?.click();
  await waitFor(() => /Key Strengths|Areas To Work On|What Improved|Development Opportunities/i.test(root.innerText));
  await sleep(600);
  data.skillText = root.innerText.slice(root.innerText.indexOf(data.name));
  const bars = [...root.querySelectorAll('div')].filter(d => /%$/.test(d.style.width || '') && d.getBoundingClientRect().height <= 24 && d.parentElement.getBoundingClientRect().width > 150);
  const seen = {};
  for (const b of bars) {
    let row = b.parentElement, label = '';
    for (let i = 0; i < 4 && row && !label; i++) { row = row.parentElement; label = (row.innerText || '').split('\n').map(s => s.trim()).find(s => /^[A-Za-z][A-Za-z ]{1,24}$/.test(s)) || ''; }
    if (!label) continue;
    (seen[label] = seen[label] || []).push(parseFloat(b.style.width));
  }
  data.skills = Object.entries(seen).map(([n, v]) => ({ n, pct: v[0], base: v.length > 1 ? v[1] : null }));

  /* ── Performance Monitoring (every season in the dropdown) ── */
  say(`Reading <b>${data.name}</b>'s games…`);
  tab('Performance Monitoring')?.click();
  await waitFor(() => /\b(Home|Away)\b/.test(root.innerText) || /No (games|data)/i.test(root.innerText));
  await sleep(800);
  const seasonBtn = () => [...root.querySelectorAll('button')].find(b => /^20\d\d-20\d\d$/.test(b.textContent.trim()));
  const readGames = season => {
    const start = Number(season.slice(0, 4));
    const cols = [...root.querySelectorAll('img[alt]')].filter(i => i.alt && i.alt !== data.name && i.getBoundingClientRect().width > 10);
    const out = [];
    for (const img of cols) {
      let col = img;
      for (let k = 0; k < 7 && col; k++) { col = col.parentElement; if (col && /\b(Home|Away)\b/.test(col.innerText) && /\d+\s*-\s*\d+/.test(col.innerText)) break; }
      if (!col) continue;
      const m = col.innerText.replace(/\s+/g, ' ').match(/\b([WDL])\s+(\d+)\s*-\s*(\d+)\s+(\d{1,2})\s+([A-Z][a-z]{2})\s+(Home|Away)\b/);
      if (!m) continue;
      const hts = [...col.querySelectorAll('*')].map(x => x.style && x.style.height).filter(h => /%$/.test(h || '') && h !== '100%').map(parseFloat);
      const mi = MON.indexOf(m[5]); if (mi < 0) continue;
      const d = new Date(Date.UTC(mi >= 7 ? start : start + 1, mi, Number(m[4])));
      d.setUTCDate(d.getUTCDate() + 1);                         // TAKA's IDP chart shows each date one day early
      const home = m[6] === 'Home';
      out.push({ iso: d.toISOString().slice(0, 10), res: m[1], us: home ? m[2] : m[3], them: home ? m[3] : m[2], ha: home ? 'H' : 'A', opp: img.alt.trim(), pct: hts.length ? hts[0] : null, season });
    }
    return out;
  };
  // The season control is a toggle: open it only if it is closed, then click the option.
  const pickSeason = async season => {
    const b = seasonBtn(); if (!b) return false;
    if (b.getAttribute('aria-expanded') !== 'true') { b.click(); await sleep(700); }
    const opt = [...document.querySelectorAll('[role=option]')].find(o => o.textContent.trim() === season);
    if (!opt) { if (b.getAttribute('aria-expanded') === 'true') b.click(); return false; }
    opt.click(); return true;
  };
  // TAKA can draw the season dropdown a moment after the games; wait for it, else read the season from the page.
  await waitFor(() => seasonBtn(), 6000);
  const textSeason = (root.innerText.match(/\n\s*(20\d\d-20\d\d)\s*\n/) || [])[1];
  const current = seasonBtn()?.textContent.trim() || textSeason;
  if (current && !seasonBtn()) {
    data.seasons.push(current);
    data.games_list.push(...readGames(current));
  } else if (current) {
    data.seasons.push(current);
    data.games_list.push(...readGames(current));
    const b = seasonBtn(); b.click(); await sleep(700);
    const opts = [...document.querySelectorAll('[role=option]')].map(o => o.textContent.trim()).filter(t => /^20\d\d-20\d\d$/.test(t) && t !== current);
    if (b.getAttribute('aria-expanded') === 'true') { b.click(); await sleep(400); }
    for (const season of opts) {
      say(`Reading <b>${data.name}</b>'s games — ${season}…`);
      const before = root.innerText;
      if (!(await pickSeason(season))) continue;
      await waitFor(() => root.innerText !== before, 6000); await sleep(1500);
      data.seasons.push(season);
      data.games_list.push(...readGames(season));
    }
    if (data.seasons.length > 1) await pickSeason(current); // put the season back the way the coach had it
  }
  data.games_list.sort((a, b) => a.iso.localeCompare(b.iso));
  window.__scwLast = data;                                   // handy for troubleshooting
  tab('Skill Analysis')?.click();

  /* ── result ── */
  const g = data.games_list;
  const range = g.length ? ` (${MON[Number(g[0].iso.slice(5, 7)) - 1]} ${g[0].iso.slice(0, 4)} – ${MON[Number(g[g.length - 1].iso.slice(5, 7)) - 1]} ${g[g.length - 1].iso.slice(0, 4)})` : '';
  say(`<b style="color:#4ADE80">✓ Got ${data.name}</b><br>` +
      `${data.skills.length} TAKA skills · ${g.length} games${range}<br>` +
      `<span style="color:#A0A0A0;font-size:12px">Next: open this player's SC Wave IDP and fill it in.</span>`);
  const url = `${SITE}/coaches/taka-import.html#${encodeURIComponent(JSON.stringify(data))}`;
  btn('Fill SC Wave IDP →', true, () => { window.open(url, 'scwave_idp'); close(); });
  btn('Cancel', false, close);
})();
