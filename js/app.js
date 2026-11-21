import {
  CVE, SITE, QUESTIONS, epssFor, score, verdict,
  encodeResult, decodeResult, shareText,
} from './logic.js';

const $ = (id) => document.getElementById(id);
const form = $('scanner-form');
const scanBtn = $('scan-btn');
const resetBtn = $('reset-btn');
const term = $('scan-terminal');
const report = $('scan-report');

const TIER_CLASS = {
  'NOT AFFECTED': 't-na',
  LOW: 't-low',
  HIGH: 't-high',
  CRITICAL: 't-crit',
  'ALREADY EXPLOITED': 't-pwned',
};

const ADVICE = {
  'NOT AFFECTED': 'No exploitable surface detected. Either you are on a walk or you are lying to the scanner.',
  LOW: 'Exposure is limited. Apply Stretchy Pants 8.5.12 as a precaution and stay away from the pie table.',
  HIGH: 'Exploitation is likely before the second game. Volunteer for dish duty now.',
  CRITICAL: 'Exploitation is imminent. If you cannot patch, take yourself offline.',
  'ALREADY EXPLOITED': 'This host is compromised. Do not attempt to wake it. Cover it with a blanket and isolate it from the group chat.',
};

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function renderEpss(now = new Date()) {
  const e = epssFor(now);
  $('epss-score').textContent = e.score.toFixed(5);
  $('epss-pct').textContent = ordinal(e.percentile);
}

function renderForm() {
  form.innerHTML = QUESTIONS.map((q, qi) => `
    <fieldset>
      <legend><span class="qn">${String(qi + 1).padStart(2, '0')}</span>${q.text}</legend>
      <div class="opts">
        ${q.options.map((o, oi) => `
          <label><input type="radio" name="${q.id}" value="${oi}"> <span>${o.label}</span></label>
        `).join('')}
      </div>
    </fieldset>`).join('');
}

function readAnswers() {
  const answers = {};
  for (const q of QUESTIONS) {
    const checked = form.querySelector(`input[name="${q.id}"]:checked`);
    answers[q.id] = checked ? Number(checked.value) : 0;
  }
  return answers;
}

function fillAnswers(answers) {
  for (const q of QUESTIONS) {
    const input = form.querySelector(`input[name="${q.id}"][value="${answers[q.id]}"]`);
    if (input) input.checked = true;
  }
}

function shareUrl(answers) {
  return `${SITE}/#${encodeResult(answers)}`;
}

function showReport(answers) {
  const s = score(answers);
  const v = verdict(s);
  const text = shareText(v, shareUrl(answers));
  const eta =
    v.minutesToNap === null ? 'n/a'
    : v.minutesToNap === 0 ? 'now (nap in progress)'
    : `${v.minutesToNap} minutes`;
  const epss = epssFor(new Date());

  report.innerHTML = `
    <div class="mono small muted">SCAN REPORT · ${CVE}</div>
    <div class="tier ${TIER_CLASS[v.tier]}">${v.tier}</div>
    <p>${ADVICE[v.tier]}</p>
    <dl>
      <dt>Exposure score</dt><dd>${s} / 18</dd>
      <dt>Est. time to nap</dt><dd>${eta}</dd>
      <dt>EPSS (today)</dt><dd>${epss.score.toFixed(5)} (${ordinal(epss.percentile)} percentile)</dd>
      <dt>Recommended fix</dt><dd>${v.tier === 'NOT AFFECTED' ? 'None. Enjoy your walk.' : 'No fix available. See mitigations.'}</dd>
      ${v.tier === 'NOT AFFECTED' ? '<dt>VEX status</dt><dd>not_affected (justification: vulnerable_code_not_in_execute_path)</dd>' : ''}
    </dl>
    <p class="share-text" id="share-text"></p>
    <div class="actions">
      <button type="button" class="btn" id="copy-btn">Copy result</button>
      <span class="copy-status" id="copy-status" role="status"></span>
    </div>`;
  $('share-text').textContent = text;
  $('copy-btn').addEventListener('click', () => copy(text));
  report.hidden = false;
  resetBtn.hidden = false;
}

async function copy(text) {
  const status = $('copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('no clipboard');
    await navigator.clipboard.writeText(text);
    status.textContent = 'Copied. Paste it somewhere your coworkers will see it.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('share-text'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* ignore */ }
    status.textContent = copied ? 'Copied.' : 'Text selected. Copy it to share.';
  }
}

const SCAN_LINES = [
  `$ turkey2nap-scan --target localhost --cve ${CVE}`,
  '[*] Resolving /couch ... 1 host up',
  '[*] Fingerprinting Thanksgiving Dinner runtime ... version 1621-2026 (vulnerable range)',
  '[*] Probing Serving-Size header handling ...',
  '[*] Measuring serotonin buffer ...',
  '[*] Checking waistband posture ...',
  '[!] Version detected via banner grab only. Confidence: vibes.',
  '[+] Scan complete.',
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let scanRun = 0;

async function runScan() {
  if (scanBtn.getAttribute('aria-disabled') === 'true') return;
  const run = ++scanRun;
  const answers = readAnswers();
  scanBtn.setAttribute('aria-disabled', 'true');
  resetBtn.hidden = true;
  report.hidden = true;
  term.hidden = false;
  term.textContent = '';
  const delay = reducedMotion() ? 0 : 300;
  for (const line of SCAN_LINES) {
    term.textContent += (term.textContent ? '\n' : '') + line;
    if (delay) await sleep(delay);
    if (run !== scanRun) return;
  }
  history.replaceState(null, '', `#${encodeResult(answers)}`);
  showReport(answers);
  scanBtn.removeAttribute('aria-disabled');
  report.focus({ preventScroll: true });
  report.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

function reset() {
  scanRun++;
  scanBtn.removeAttribute('aria-disabled');
  form.reset();
  term.hidden = true;
  report.hidden = true;
  resetBtn.hidden = true;
  history.replaceState(null, '', location.pathname + location.search);
  form.querySelector('input')?.focus();
}

renderEpss();
setInterval(renderEpss, 60_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderEpss(); });
renderForm();
scanBtn.addEventListener('click', runScan);
resetBtn.addEventListener('click', reset);

const shared = decodeResult(location.hash.slice(1));
if (shared) {
  fillAnswers(shared);
  showReport(shared);
}

// Exposed for testing the Thursday EPSS jump from the console.
window.turkey2nap = { renderEpss };
