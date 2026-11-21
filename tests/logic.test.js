import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  thanksgiving, epssFor, QUESTIONS, score, verdict,
  encodeResult, decodeResult, shareText,
} from '../js/logic.js';

test('thanksgiving is the 4th Thursday of November', () => {
  const a = thanksgiving(2026), b = thanksgiving(2027);
  assert.deepEqual([a.getFullYear(), a.getMonth(), a.getDate()], [2026, 10, 26]);
  assert.deepEqual([b.getFullYear(), b.getMonth(), b.getDate()], [2027, 10, 25]);
});

test('EPSS on a normal day', () => {
  assert.deepEqual(epssFor(new Date(2026, 6, 4)), { score: 0.00042, percentile: 4 });
});

test('EPSS after kickoff on Thanksgiving', () => {
  assert.deepEqual(epssFor(new Date(2026, 10, 26, 16)), { score: 0.99997, percentile: 100 });
});

test('EPSS ramps during Thanksgiving morning', () => {
  const s = epssFor(new Date(2026, 10, 26, 7)).score;
  assert.ok(s > 0.00042 && s < 0.99997, `got ${s}`);
});

test('EPSS on Thanksgiving Eve', () => {
  assert.equal(epssFor(new Date(2026, 10, 25, 12)).score, 0.31337);
});

test('no answers scores 0 and is not affected', () => {
  assert.equal(score({}), 0);
  assert.equal(verdict(0).tier, 'NOT AFFECTED');
});

test('maximum answers are already exploited', () => {
  const max = {};
  for (const q of QUESTIONS) {
    let best = 0;
    q.options.forEach((o, i) => { if (o.points > q.options[best].points) best = i; });
    max[q.id] = best;
  }
  assert.equal(verdict(score(max)).tier, 'ALREADY EXPLOITED');
});

test('there are six questions', () => {
  assert.equal(QUESTIONS.length, 6);
});

test('result encoding round-trips', () => {
  const a = {};
  QUESTIONS.forEach((q, i) => { a[q.id] = i % q.options.length; });
  assert.deepEqual(decodeResult(encodeResult(a)), a);
});

test('malformed hashes decode to null', () => {
  for (const h of ['r=9-9-9', 'garbage', '', 'r=9-9-9-9-9-9', 'r=a-b-c-d-e-f', 'r=0-0-0-0-0-0-0']) {
    assert.equal(decodeResult(h), null, h);
  }
});

test('share text has CVE and URL', () => {
  const t = shareText(verdict(0));
  assert.ok(t.includes('CVE-1621-1126'));
  assert.ok(t.includes('https://turkey2nap.org'));
  assert.ok(t.includes('NOT AFFECTED'));
});
