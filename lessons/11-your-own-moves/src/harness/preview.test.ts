// @vitest-environment happy-dom
// Drives main.ts against the shipped index.html, so a broken wire fails here
// rather than in front of the kid. Asserts wiring only: the assertions must
// hold for both the red starter and the green solution.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, test, vi } from 'vitest';
import { chartVariants } from './task';
import { beats, moveNames } from './trace';

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

test('the intro reads its room and its counts off rung 2', () => {
  const intro = chartVariants[0];
  expect(intro).toBeDefined();
  if (!intro) return;
  const script = beats(intro);
  const slots = document.querySelectorAll<HTMLElement>('[data-intro-bars]');
  expect(slots.length).toBeGreaterThan(0);
  for (const slot of slots) {
    expect(slot.textContent).toBe(intro.label);
  }
  expect(document.querySelector('[data-intro-names]')?.textContent).toBe(
    String(moveNames(script).length),
  );
  expect(document.querySelector('[data-intro-calls]')?.textContent).toBe(
    String(script.length),
  );
});

test('the intro unfolds every move into robot calls, to the last one', () => {
  expect(document.querySelector('#demo-canvas')).not.toBeNull();
  vi.useFakeTimers();
  document.querySelector<HTMLElement>('#demo-run')?.click();
  vi.advanceTimersByTime(60000);
  vi.useRealTimers();
  const log = document.querySelector('#demo-log')?.textContent ?? '';
  const intro = chartVariants[0];
  if (!intro) return;
  const script = beats(intro);
  for (const name of moveNames(script)) {
    expect(log).toContain(name);
  }
  expect(log).toContain('robot.turnLeft()');
  expect(log).toContain(`${script.length} robot calls.`);
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

test('the moves the kid writes are also graded on their own', () => {
  const checks = document.querySelectorAll('#rungs .check');
  const labels = [...checks].map((check) => check.textContent ?? '');
  expect(labels.length).toBe(3);
  expect(labels.some((line) => line.startsWith('backToRowStart'))).toBe(true);
  expect(labels.some((line) => line.startsWith('nextRow'))).toBe(true);
  expect(labels.some((line) => line.startsWith('paintBand'))).toBe(true);
});

test('the card view renders card.md, not raw markdown', () => {
  location.hash = 'card';
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('moves');
  expect(body?.querySelector('pre code')?.textContent).toContain('paintCells');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
