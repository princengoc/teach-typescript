// @vitest-environment happy-dom
// Drives main.ts against the shipped index.html, so a broken wire fails here
// rather than in front of the kid. Asserts wiring only: the assertions must
// hold for both the red starter and the green solution.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, test, vi } from 'vitest';
import { pictureVariants } from './task';
import { beats, squaresAsked } from './trace';

// The body as shipped, minus the module tag: the test imports main.ts itself.
function bodyOf(html: string): string {
  return html
    .slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
    .replace(/<script[\s\S]*?<\/script>/g, '');
}

beforeAll(async () => {
  const html = readFileSync(
    join(import.meta.dirname, '../../index.html'),
    'utf8',
  );
  document.body.innerHTML = bodyOf(html);
  await import('../main');
});

test('the preview opens on the intro, build and card hidden', () => {
  expect(document.querySelector<HTMLElement>('#learn')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#build')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#card')?.hidden).toBe(true);
});

test('the intro reads its room and its list off rung 3', () => {
  const intro = pictureVariants[0];
  expect(intro).toBeDefined();
  if (!intro) return;
  const slots = document.querySelectorAll<HTMLElement>('[data-intro-room]');
  expect(slots.length).toBeGreaterThan(0);
  for (const slot of slots) {
    expect(slot.textContent).toBe(intro.label);
  }
  expect(document.querySelector('[data-intro-marks]')?.textContent).toBe(
    intro.room.marks.join(', '),
  );
  expect(document.querySelector('[data-intro-squares]')?.textContent).toBe(
    String(squaresAsked(beats(intro))),
  );
});

test('the intro walks every square of the box, to the last one', () => {
  expect(document.querySelector('#demo-canvas')).not.toBeNull();
  vi.useFakeTimers();
  document.querySelector<HTMLElement>('#demo-run')?.click();
  vi.advanceTimersByTime(60000);
  vi.useRealTimers();
  const log = document.querySelector('#demo-log')?.textContent ?? '';
  const intro = pictureVariants[0];
  if (!intro) return;
  const squares = squaresAsked(beats(intro));
  for (let i = 0; i < squares; i += 1) {
    expect(log).toContain(`square ${i}:`);
  }
  expect(log).toContain('robot.paint()');
  expect(log).toContain(`${squares} squares. One walk. One rule.`);
});

test('the build view lists three rungs, each graded in two fixed rooms', () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#build')?.hidden).toBe(false);
  expect(document.querySelectorAll('#rungs .rung').length).toBe(3);
  expect(document.querySelectorAll('#rungs figcaption').length).toBe(6);
});

test('every rung adds a surprise room that grades but does not gate', () => {
  const rungs = document.querySelectorAll('#rungs .rung');
  expect(rungs.length).toBe(3);
  for (const rung of rungs) {
    expect(rung.textContent).toContain('A surprise room');
  }
});

test('the rules the kid writes are also asked about every square on their own', () => {
  const checks = document.querySelectorAll('#rungs .check');
  const labels = [...checks].map((check) => check.textContent ?? '');
  expect(labels.length).toBe(4);
  for (const name of ['gap', 'near', 'cellNumber', 'wanted']) {
    expect(labels.some((line) => line.startsWith(`${name} on its own`))).toBe(
      true,
    );
  }
});

test('the card view renders card.md, not raw markdown', () => {
  location.hash = 'card';
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('finale');
  expect(body?.querySelector('pre code')?.textContent).toContain('nextRow()');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
