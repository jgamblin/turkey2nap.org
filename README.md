# Turkey2Nap (CVE-1621-1126)

**Live site: [turkey2nap.org](https://turkey2nap.org)**

A parody of the "X2Shell" named-vulnerability vanity sites (React2Shell, PHP2Shell,
Node2Shell, Java2Shell, and the Log4Shell family before them), just in time for
Thanksgiving.

Turkey2Nap is an unauthenticated Remote Nap Execution flaw: a stomach buffer
overflow in the Thanksgiving Dinner runtime, triggered by a second helping sent to
`/couch`. It has a logo, four CVSS scores that disagree, an EPSS score that climbs
to 0.99997 on Thanksgiving Day, a Known Exploited Vegetation listing, and an
"Am I Affected?" scanner that gives you a result to share.

This has been a tough month for people in vulnerability management. I hope this
makes you smile a little.

## Running it locally

It's a static site with no build step and no dependencies.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Tests

The scanner, scoring and EPSS logic live in `js/logic.js` and are tested with
Node's built-in test runner (Node 20+):

```bash
npm test
```

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | All page copy and styles |
| `js/logic.js` | Scanner questions, scoring, verdicts, EPSS by date, share links |
| `js/app.js` | Wires the logic to the page |
| `tests/logic.test.js` | Tests for `js/logic.js` |
| `og.png`, `og/card.html` | Social preview image and the template it was rendered from |
| `favicon.svg` | The sleeping turkey |
| `CNAME` | Custom domain for GitHub Pages |
| `docs/` | Design notes and build plan |

## Deploying

GitHub Pages serves `main` from the repository root, with the custom domain
`turkey2nap.org` (see `CNAME`).

## Disclaimer

This is a parody. CVE-1621-1126 is not a real CVE, so please don't file it.
Every vendor, agency, researcher and AI model named on the site is made up.
No turkeys were harmed.

## License

[Apache License 2.0](LICENSE)
