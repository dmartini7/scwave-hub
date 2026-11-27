# Coaches Area — how it works

**Address:** https://coaches.scwaveplayerhub.com (the public hub at scwaveplayerhub.com is unchanged).

## Sign-in
Coaches sign in with **their own email + the club coach code**.
- Only the emails listed in `src/coaches.js` can sign in, even with the right code.
- The code is the Worker secret **`COACH_CODE`** (Cloudflare → Workers & Pages → scwave-hub → Settings →
  Variables and secrets). It is never stored in this repo. Changing it signs everyone out.
- Sessions last 30 days. 10 wrong attempts from one connection → 15-minute pause.

## Where things live (all free tier)
| Piece | Where |
|---|---|
| Pages + sign-in check | Worker `scwave-hub` (`src/worker.js`), deployed on every push to `main` |
| IDPs, rosters, sign-in attempts | D1 database `scwave-idp` |
| Table definitions | `migrations/*.sql` (already applied; run new ones in the D1 Console) |
| 2026-27 rosters | Loaded from PlayMetrics into the `roster` table (player names are not in git) |

## Adding or removing a coach
Edit `src/coaches.js` (name, role `coach` or `director`, email) and push.

## Roles
| | Coach | Director (Daniel, Marcio, Andre) |
|---|---|---|
| Create and edit IDPs | ✓ | ✓ |
| Mark "Ready for review" | ✓ | ✓ |
| Approve | – | ✓ |
| Edit an approved IDP | – | ✓ |
| Delete an IDP | – | ✓ |

## TAKA
- **Find in TAKA ↗** opens TAKA's athlete search for the player (coach's own TAKA login).
- **TAKA screenshots**: upload or paste (Cmd+V) the Skill Analysis and Performance Monitoring screenshots; they print as a "TAKA Evidence" page.
- **Paste from TAKA**: on the player's TAKA IDP page press Cmd+A, Cmd+C and paste. Skills, goals, jersey number and
  games fill in automatically (TAKA's chart dates are one day early; the import corrects them). Opponent names are typed in.

## Updating rosters next season
Pull the new rosters from PlayMetrics and load them into the `roster` table (ask Claude), then update `IDP_TEAMS`
in `coaches/idp-lib.js` if team names change.
