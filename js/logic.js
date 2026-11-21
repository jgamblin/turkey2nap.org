// Turkey2Nap (CVE-1621-1126) — pure logic. No DOM in here.

export const CVE = 'CVE-1621-1126';
export const SITE = 'https://turkey2nap.org';

const EPSS_BASE = { score: 0.00042, percentile: 4 };
const EPSS_EVE = { score: 0.31337, percentile: 88 };
const EPSS_PEAK = { score: 0.99997, percentile: 100 };
const KICKOFF_HOUR = 15;

/** Thanksgiving (US): the 4th Thursday of November, local midnight. */
export function thanksgiving(year) {
  const nov1 = new Date(year, 10, 1);
  const firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7);
  return new Date(year, 10, firstThursday + 21);
}

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** EPSS is recalculated daily. Thursday is not a normal day. */
export function epssFor(now) {
  const tg = thanksgiving(now.getFullYear());
  const eve = new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() - 1);
  if (sameDay(now, eve)) return { ...EPSS_EVE };
  if (!sameDay(now, tg)) return { ...EPSS_BASE };
  const hours = now.getHours() + now.getMinutes() / 60;
  if (hours >= KICKOFF_HOUR) return { ...EPSS_PEAK };
  const t = hours / KICKOFF_HOUR;
  return {
    score: Math.round((EPSS_BASE.score + t * (EPSS_PEAK.score - EPSS_BASE.score)) * 1e5) / 1e5,
    percentile: Math.round(EPSS_BASE.percentile + t * (EPSS_PEAK.percentile - EPSS_BASE.percentile)),
  };
}

export const QUESTIONS = [
  {
    id: 'plates',
    text: 'How many plates have you processed?',
    options: [
      { label: 'Zero. I am here for the conversation.', points: 0 },
      { label: 'One. Reasonable.', points: 1 },
      { label: 'Two (a second helping)', points: 2 },
      { label: 'I stopped counting at the rolls', points: 3 },
    ],
  },
  {
    id: 'pie',
    text: 'Pie slices ingested:',
    options: [
      { label: 'None. I am waiting until later.', points: 0 },
      { label: 'One sliver, to be polite', points: 1 },
      { label: 'One of each kind', points: 2 },
      { label: 'I am holding the pie tin', points: 3 },
    ],
  },
  {
    id: 'couch',
    text: 'Network distance to /couch:',
    options: [
      { label: 'Air-gapped (outside, on a walk)', points: 0 },
      { label: 'Same building, different room', points: 1 },
      { label: 'Within arm’s reach', points: 2 },
      { label: 'I am already on the recliner', points: 3 },
    ],
  },
  {
    id: 'football',
    text: 'Football status:',
    options: [
      { label: 'TV is off', points: 0 },
      { label: 'On, muted, nobody is watching', points: 1 },
      { label: 'On, and I have opinions', points: 2 },
      { label: 'Third quarter of the second game', points: 3 },
    ],
  },
  {
    id: 'gravy',
    text: 'Gravy-to-food ratio:',
    options: [
      { label: 'No gravy', points: 0 },
      { label: 'A responsible drizzle', points: 1 },
      { label: 'Gravy-forward', points: 2 },
      { label: 'Gravy is the entrée', points: 3 },
    ],
  },
  {
    id: 'waistband',
    text: 'Waistband posture:',
    options: [
      { label: 'Stretchy Pants 8.5.12 (patched)', points: 0 },
      { label: 'Belt, holding', points: 1 },
      { label: 'Belt loosened one notch', points: 2 },
      { label: 'Top button undone (known IOC)', points: 3 },
    ],
  },
];

/** answers: { [questionId]: optionIndex }. Missing or invalid answers count 0. */
export function score(answers) {
  return QUESTIONS.reduce((sum, q) => {
    const opt = q.options[answers?.[q.id]];
    return sum + (opt ? opt.points : 0);
  }, 0);
}

const TIERS = [
  { min: 16, tier: 'ALREADY EXPLOITED' },
  { min: 12, tier: 'CRITICAL' },
  { min: 8, tier: 'HIGH' },
  { min: 3, tier: 'LOW' },
  { min: 0, tier: 'NOT AFFECTED' },
];

export function verdict(s) {
  const { tier } = TIERS.find((t) => s >= t.min);
  let minutesToNap = null;
  if (tier === 'ALREADY EXPLOITED') minutesToNap = 0;
  else if (tier !== 'NOT AFFECTED') minutesToNap = Math.max(1, Math.round(126 - s * 7.5));
  return { tier, minutesToNap, score: s };
}

export function encodeResult(answers) {
  return 'r=' + QUESTIONS.map((q) => answers?.[q.id] ?? 0).join('-');
}

/** Returns answers, or null for anything malformed or out of range. */
export function decodeResult(hash) {
  const m = /^r=(\d(?:-\d){5})$/.exec(hash ?? '');
  if (!m) return null;
  const parts = m[1].split('-').map(Number);
  if (parts.length !== QUESTIONS.length) return null;
  const answers = {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (parts[i] >= QUESTIONS[i].options.length) return null;
    answers[QUESTIONS[i].id] = parts[i];
  }
  return answers;
}

export function shareText(v, url = SITE) {
  const eta =
    v.minutesToNap === null ? 'No nap detected.'
    : v.minutesToNap === 0 ? 'Nap in progress.'
    : `Estimated time to nap: ${v.minutesToNap} min.`;
  return `I scanned myself for Turkey2Nap (${CVE}): ${v.tier}. ${eta} Are you affected? ${url}`;
}
