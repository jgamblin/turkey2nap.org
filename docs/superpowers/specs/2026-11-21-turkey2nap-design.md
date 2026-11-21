# Turkey2Nap — Design

**Date:** 2026-11-21 · **Target soft launch:** before Thanksgiving, Thu 2026-11-26

## Intent

A parody vanity-disclosure site for turkey2nap.org that mocks the 2025–26 wave of
named "X2Shell / X4Shell" vulnerabilities (React2Shell, PHP2Shell, Node2Shell,
HTTP2Shell, Plex2Shell, Java2Shell/Java4Shell, and the Log4Shell lineage). The joke
lands because it looks *exactly* like a serious disclosure site: deadpan tone,
precise formatting, all the tropes.

## Goals

- One page that reads like php2shell.com / react2shell.com at a glance.
- An interactive "Am I Affected?" scanner that produces a shareable result.
- Screenshot-friendly on desktop and phone; shares nicely on social (OG card).
- Deploys to GitHub Pages as-is with the custom domain turkey2nap.org.

## Non-goals

- No backend, analytics, accounts, or stored data.
- No multi-page "disclosure circus" (vendor advisory pile-on, Wikipedia clone) for v1.
- No live countdown dashboard.

## Anti-goals (fails even if it works)

- Impersonating real orgs: no real CISA/NCSC/vendor names or logos, no real
  researchers, no real CVE IDs. All vendors/agencies are fictional.
- Looking like a meme page. If it isn't deadpan, it isn't funny.
- Anything that reads as mocking real maintainers or victims.

## Approaches considered

1. **Vanity site only** — fastest, very shareable, but no reason to come back.
2. **Vanity site + interactive checker** — *chosen.* Same page plus a scanner
   that gives people a personal, postable result. Still pure static.
3. **Disclosure circus (multi-page)** — funniest for insiders, too much writing
   to do well by Thursday. Parked as a possible v2.

## The bit (canonical facts — keep consistent everywhere)

- **Name:** Turkey2Nap · **CVE:** CVE-1621-1126 (obviously fake year)
- **Class:** Unauthenticated Remote Nap Execution (RNE) via L-Tryptophan
  deserialization in the Thanksgiving Dinner runtime.
- **CVSS:** a deliberately disagreeing row — 9.2 (CVSS 4.0, "Thanksgiving Dinner
  maintainers"), 10.0 (fictional "watchTurkey"), 9.8 (3.1), 11.0 ("Grandma").
- **EPSS:** shown next to CVSS, and it depends on the day. Low on any normal
  day (e.g. 0.00042, 4th percentile). On Thanksgiving Day it climbs to 0.99997
  (100th percentile) by kickoff. The page computes the value from the visitor's
  date and time, so it really does jump on Thursday. Footnote: "EPSS is
  recalculated daily. Thursday is not a normal day."
- **Affected:** Thanksgiving Dinner 1621–2026. Stuffing ≤ 2.x is EOL, no patch.
- **Endpoint / trigger:** `/couch`; payload is "a second helping".
- **Mitigations:** Stretchy Pants 8.5.12; 10-minute walk; "take yourself offline"
  (parody of the real take-sites-offline guidance).
- **IOCs:** unbuttoned waistband, remote dropped on carpet, ~70 dB snoring at
  halftime, phrase "I'm just resting my eyes".
- **Discovery credit:** "GPT-5.6 Drumstick, part of the *Patch the Plate* initiative"
  plus a fictional researcher.
- **Timeline gags:** found in a 2024 audit and never fixed; embargo leaked by a
  PoC video Aunt Linda posted to the family group chat; exploitation observed
  in the wild four days early (leftovers testing).
- Footer: "This is a parody. No turkeys were harmed. Not affiliated with anyone."

## Page sections (top to bottom)

1. Header: logo (sleeping turkey + shell prompt), name, CVE, CVSS row, EPSS,
   severity badge, and a "CISA KEV"-style badge from a fictional catalog
   ("Known Exploited Vittles").
2. TL;DR box.
3. **Am I Affected?** scanner (see below).
4. Technical details (deadpan pseudo-writeup with a fake stack trace / payload).
5. Affected versions table.
6. Timeline.
7. Mitigations & patches.
8. Indicators of Compromise.
9. FAQ ("Is there a logo? Yes." "Why the name?" "Is my uncle vulnerable?").
10. Credits.
11. **A note from the author.** This is the one sincere part of the page, set
    apart visually and not deadpan. Text, from Jerry: "This has been a tough
    month for people in vulnerability management. I hope this makes you smile
    a little, as much as it made me smile when it came up in a meeting."
12. Footer.

## Scanner

- ~5–6 quick questions (plates eaten, pie slices, distance to recliner, football
  on, gravy-to-food ratio, stretchy pants status).
- Score → verdict tiers (e.g. NOT AFFECTED / LOW / HIGH / CRITICAL / ALREADY
  EXPLOITED) with a fake "time to exploitation" estimate.
- Terminal-style "scanning…" animation before the result.
- Result shown as a scan report; "Copy result" button copies a short postable
  text with the URL. Result is also encoded in the URL hash so a shared link
  reproduces it.

## How it gets made (builder calls)

- Single `index.html` with inline CSS and JS; plain static, no build step,
  no external scripts (a Google Font at most).
- `CNAME` file containing `turkey2nap.org` for GitHub Pages.
- Visual style: dark, minimal, monospace accents, like a serious researcher's
  disclosure site. Light/dark via `prefers-color-scheme`. Works at phone width.
- Logo as inline SVG; OG card as a static 1200×630 PNG rendered from an HTML
  template via a headless-browser screenshot.

## Left to the builder

Exact copy and jokes within the canonical facts above, scanner question wording
and scoring weights, colors and typography.
