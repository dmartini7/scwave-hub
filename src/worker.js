// SC Wave Training Hub worker.
// Public pages are served straight from static assets.
// /coaches/* and /api/* are coaches-only. A coach signs in at /coaches/login.html with their own
// email (must be listed in src/coaches.js) plus the club coach code, stored as the Worker secret
// COACH_CODE (never in this repo). The worker then sets a signed, HttpOnly session cookie for 30 days.
import { COACHES, findCoach, nameFor } from './coaches.js';

const STATUSES = ['draft', 'review', 'approved'];
const MAX_BODY = 300 * 1024;
const MAX_FILE = 1200 * 1024; // one compressed screenshot (base64)
const FILE_KINDS = ['skill', 'performance'];
const SNAPSHOT_EVERY_MS = 30 * 60 * 1000;
const SESSION_DAYS = 30;
const COOKIE = 'scw_coach';
const MAX_FAILS = 10, FAIL_WINDOW_MS = 15 * 60 * 1000;
const PUBLIC_COACH_FILES = ['/coaches/login.html', '/coaches/login', '/coaches/coaches.css', '/coaches/idp-lib.js'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    // coaches.scwaveplayerhub.com opens straight into the coaches area.
    if (url.hostname.startsWith('coaches.') && (path === '/' || path === '/index.html')) {
      return Response.redirect(`${url.origin}/coaches/`, 302);
    }
    const gated = path === '/coaches' || path.startsWith('/coaches/') || path.startsWith('/api/');
    if (!gated) return env.ASSETS.fetch(request);
    if (PUBLIC_COACH_FILES.includes(path)) return noStore(await env.ASSETS.fetch(request));
    if (path === '/api/login' && request.method === 'POST') return login(request, env, url);
    if (path === '/api/logout') return logout(url);

    const email = await sessionEmail(request, env);
    const coach = email ? findCoach(email) : null;
    if (!coach) {
      if (path.startsWith('/api/')) return json({ error: 'not_signed_in' }, 401);
      const next = encodeURIComponent(path + url.search);
      return Response.redirect(`${url.origin}/coaches/login.html?next=${next}`, 302);
    }
    const user = { email: email.toLowerCase(), name: coach.name, role: coach.role };

    if (path.startsWith('/api/')) {
      try { return await api(request, env, url, user); }
      catch (err) { console.error(err); return json({ error: 'server_error' }, 500); }
    }
    return noStore(await env.ASSETS.fetch(request));
  }
};

function noStore(res) {
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  out.headers.set('X-Robots-Tag', 'noindex');
  return out;
}

/* ── Sign-in: coach email + club code → signed session cookie ───────── */
async function login(request, env, url) {
  if (!env.COACH_CODE) return json({ error: 'not_configured', message: 'The coach code has not been set up yet.' }, 503);
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const now = Date.now();
  const rec = await env.DB.prepare('SELECT fails, first_at FROM login_attempts WHERE ip = ?').bind(ip).first();
  const inWindow = rec && now - rec.first_at < FAIL_WINDOW_MS;
  if (inWindow && rec.fails >= MAX_FAILS) {
    const mins = Math.ceil((FAIL_WINDOW_MS - (now - rec.first_at)) / 60000);
    return json({ error: 'too_many', message: `Too many attempts. Try again in ${mins} min.` }, 429);
  }
  const body = await readJson(request) || {};
  const email = String(body.email || '').trim().toLowerCase();
  const code = String(body.code || '').trim();
  const coach = findCoach(email);
  const codeOk = await sameText(code.toUpperCase(), String(env.COACH_CODE).trim().toUpperCase());
  if (!coach || !codeOk) {
    if (inWindow) await env.DB.prepare('UPDATE login_attempts SET fails = fails + 1 WHERE ip = ?').bind(ip).run();
    else await env.DB.prepare('INSERT OR REPLACE INTO login_attempts (ip, fails, first_at) VALUES (?, 1, ?)').bind(ip, now).run();
    return json({ error: 'bad_login', message: 'That email and code combination is not valid.' }, 401);
  }
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
  const exp = now + SESSION_DAYS * 86400000;
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ e: email, x: exp })));
  const sig = await sign(payload, env);
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true, name: coach.name }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
      'Set-Cookie': `${COOKIE}=${payload}.${sig}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; SameSite=Lax${secure}`
    }
  });
}

function logout(url) {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return new Response(null, {
    status: 302,
    headers: { Location: `${url.origin}/coaches/login.html?out=1`, 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}` }
  });
}

async function sessionEmail(request, env) {
  if (!env.COACH_CODE) return null; // fail closed until the code secret exists
  const raw = cookie(request, COOKIE);
  if (!raw || !raw.includes('.')) return null;
  const [payload, sig] = raw.split('.');
  if (!(await sameText(sig, await sign(payload, env)))) return null;
  try {
    const { e, x } = JSON.parse(new TextDecoder().decode(b64urlBytes(payload)));
    return x > Date.now() ? e : null;
  } catch (err) { return null; }
}

// Session signature key comes from the coach code: changing the code signs everyone out.
async function sign(text, env) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('scwave-session:' + env.COACH_CODE),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text))));
}

async function sameText(a, b) {
  const enc = t => crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  const [x, y] = await Promise.all([enc(a), enc(b)]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < u.length; i++) diff |= u[i] ^ v[i];
  return diff === 0;
}

function b64url(bytes) {
  let s = ''; bytes.forEach(c => { s += String.fromCharCode(c); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlBytes(s) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, c => c.charCodeAt(0));
}
function cookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

/* ── API ────────────────────────────────────────────────────────────── */
async function api(request, env, url, user) {
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const method = request.method;

  if (parts[0] === 'me' && method === 'GET') {
    return json({ ...user, coaches: COACHES.map(c => ({ name: c.name, role: c.role })) });
  }
  if (parts[0] === 'roster' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT id, team, name, num, birth_year, position, pos_key FROM roster ORDER BY team, name').all();
    return json(results);
  }
  if (parts[0] === 'files' && parts[1]) return fileRoute(request, env, user, parts[1]);
  if (parts[0] !== 'idps') return json({ error: 'not_found' }, 404);
  const id = parts[1];

  if (!id && method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, roster_id, player, team, position, status, created_by, created_at, updated_by, updated_at FROM idps ORDER BY team, player'
    ).all();
    return json(results.map(r => ({ ...r, created_by_name: nameFor(r.created_by), updated_by_name: nameFor(r.updated_by) })));
  }

  if (!id && method === 'POST') {
    const body = await readJson(request);
    if (!body || typeof body.data !== 'object') return json({ error: 'bad_request' }, 400);
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();
    const cols = columnsFrom(body.data);
    await env.DB.prepare(
      'INSERT INTO idps (id, roster_id, player, team, position, status, data, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(newId, body.roster_id ? String(body.roster_id).slice(0, 40) : null, cols.player, cols.team, cols.position, 'draft', JSON.stringify(body.data), user.email, now, user.email, now).run();
    return json({ id: newId, updated_at: now }, 201);
  }

  if (!id) return json({ error: 'not_found' }, 404);
  const row = await env.DB.prepare('SELECT * FROM idps WHERE id = ?').bind(id).first();
  if (!row) return json({ error: 'not_found' }, 404);
  const isDirector = user.role === 'director';

  if (parts[2] === 'files') {
    if (method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, kind, created_by, created_at FROM idp_files WHERE idp_id = ? ORDER BY created_at').bind(id).all();
      return json(results.map(f => ({ ...f, created_by_name: nameFor(f.created_by) })));
    }
    if (method === 'POST') {
      if (row.status === 'approved' && !isDirector) return json({ error: 'locked', message: 'Approved IDPs can only be changed by a director.' }, 403);
      const body = await readJson(request, MAX_FILE + 4096);
      if (!body || !FILE_KINDS.includes(body.kind)) return json({ error: 'bad_request' }, 400);
      const data = String(body.data || '');
      if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data)) return json({ error: 'bad_image' }, 400);
      if (data.length > MAX_FILE) return json({ error: 'too_large', message: 'That image is too large.' }, 413);
      const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM idp_files WHERE idp_id = ?').bind(id).first();
      if (count.n >= 6) return json({ error: 'too_many', message: 'An IDP can hold up to 6 screenshots.' }, 400);
      const fid = crypto.randomUUID(), now = new Date().toISOString();
      await env.DB.prepare('INSERT INTO idp_files (id, idp_id, kind, data, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(fid, id, body.kind, data, user.email, now).run();
      return json({ id: fid, kind: body.kind, created_by_name: user.name, created_at: now }, 201);
    }
    return json({ error: 'method_not_allowed' }, 405);
  }

  if (method === 'GET') {
    return json({
      id: row.id, status: row.status, data: JSON.parse(row.data),
      created_by: row.created_by, created_by_name: nameFor(row.created_by), created_at: row.created_at,
      updated_by: row.updated_by, updated_by_name: nameFor(row.updated_by), updated_at: row.updated_at,
      can_edit: row.status !== 'approved' || isDirector, can_approve: isDirector, can_delete: isDirector
    });
  }

  if (method === 'PUT') {
    const body = await readJson(request);
    if (!body) return json({ error: 'bad_request' }, 400);
    if (row.status === 'approved' && !isDirector) return json({ error: 'locked', message: 'Approved IDPs can only be changed by a director.' }, 403);
    if (body.base && body.base !== row.updated_at && !body.force) {
      return json({ error: 'conflict', updated_by_name: nameFor(row.updated_by), updated_at: row.updated_at }, 409);
    }
    let status = row.status;
    if (body.status && body.status !== row.status) {
      if (!STATUSES.includes(body.status)) return json({ error: 'bad_status' }, 400);
      if (body.status === 'approved' && !isDirector) return json({ error: 'forbidden', message: 'Only a director can approve an IDP.' }, 403);
      status = body.status;
    }
    const dataText = body.data ? JSON.stringify(body.data) : row.data;
    if (dataText.length > MAX_BODY) return json({ error: 'too_large' }, 413);
    const cols = columnsFrom(JSON.parse(dataText));
    const now = new Date().toISOString();
    await env.DB.prepare(
      'UPDATE idps SET player = ?, team = ?, position = ?, status = ?, data = ?, updated_by = ?, updated_at = ? WHERE id = ?'
    ).bind(cols.player, cols.team, cols.position, status, dataText, user.email, now, id).run();

    const last = await env.DB.prepare('SELECT saved_at FROM idp_versions WHERE idp_id = ? ORDER BY saved_at DESC LIMIT 1').bind(id).first();
    if (status !== row.status || !last || Date.now() - Date.parse(last.saved_at) > SNAPSHOT_EVERY_MS) {
      await env.DB.prepare('INSERT INTO idp_versions (idp_id, status, data, saved_by, saved_at) VALUES (?, ?, ?, ?, ?)')
        .bind(id, status, dataText, user.email, now).run();
    }
    return json({ updated_at: now, status, updated_by_name: user.name });
  }

  if (method === 'DELETE') {
    if (!isDirector) return json({ error: 'forbidden', message: 'Only a director can delete an IDP.' }, 403);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM idp_versions WHERE idp_id = ?').bind(id),
      env.DB.prepare('DELETE FROM idp_files WHERE idp_id = ?').bind(id),
      env.DB.prepare('DELETE FROM idps WHERE id = ?').bind(id)
    ]);
    return json({ ok: true });
  }
  return json({ error: 'method_not_allowed' }, 405);
}

async function fileRoute(request, env, user, fid) {
  const f = await env.DB.prepare('SELECT f.*, i.status FROM idp_files f JOIN idps i ON i.id = f.idp_id WHERE f.id = ?').bind(fid).first();
  if (!f) return json({ error: 'not_found' }, 404);
  if (request.method === 'GET') {
    const m = f.data.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    return new Response(bytes, { headers: { 'Content-Type': m[1], 'Cache-Control': 'private, max-age=86400' } });
  }
  if (request.method === 'DELETE') {
    const isDirector = user.role === 'director';
    if (f.status === 'approved' && !isDirector) return json({ error: 'locked', message: 'Approved IDPs can only be changed by a director.' }, 403);
    await env.DB.prepare('DELETE FROM idp_files WHERE id = ?').bind(fid).run();
    return json({ ok: true });
  }
  return json({ error: 'method_not_allowed' }, 405);
}

function columnsFrom(data) {
  const p = (data && data.p) || {};
  const clip = v => String(v || '').slice(0, 200);
  return { player: clip(p.name), team: clip(p.team), position: clip(p.pos) };
}

async function readJson(request, limit = MAX_BODY) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > limit) return null;
  try { return await request.json(); } catch (e) { return null; }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' }
  });
}
