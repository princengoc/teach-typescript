// @vitest-environment happy-dom
// Drives main.ts against the shipped index.html, so a broken wire fails here
// rather than in front of the kid. Asserts wiring only: the assertions must
// hold for both the red starter and the green solution.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, test, vi } from 'vitest';
import { chartVariants } from './task';

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

test('the intro reads its lists off the rooms rung 1 is graded in', () => {
  const [first, second] = chartVariants;
  const slots = document.querySelectorAll<HTMLElement>('[data-intro-bars-a]');
  expect(slots.length).toBeGreaterThan(0);
  for (const slot of slots) {
    expect(slot.textContent).toBe(first?.label);
  }
  for (const slot of document.querySelectorAll<HTMLElement>(
    '[data-intro-bars-b]',
  )) {
    expect(slot.textContent).toBe(second?.label);
  }
  expect(document.querySelector('[data-intro-count-a]')?.textContent).toBe(
    String(first?.bars.length),
  );
});

test('the intro animates one loop against two lists, to the end of both', () => {
  expect(document.querySelector('#demo-canvas-a')).not.toBeNull();
  expect(document.querySelector('#demo-canvas-b')).not.toBeNull();
  vi.useFakeTimers();
  document.querySelector<HTMLElement>('#demo-run')?.click();
  vi.advanceTimersByTime(20000);
  vi.useRealTimers();
  const log = document.querySelector('#demo-log')?.textContent ?? '';
  const [first, second] = chartVariants;
  expect(log).toContain(first?.label ?? '');
  expect(log).toContain(second?.label ?? '');
  for (const n of first?.bars ?? []) {
    expect(log).toContain(`n = ${n}`);
  }
  expect(log).toContain('both lists ran out');
});

test('the build view lists three rungs, each graded in two fixed rooms', () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#build')?.hidden).toBe(false);
  expect(document.querySelectorAll('#rungs .rung').length).toBe(3);
  expect(document.querySelectorAll('#rungs figcaption').length).toBe(6);
});

test('every rung adds a surprise list that grades but does not gate', () => {
  const rungs = document.querySelectorAll('#rungs .rung');
  expect(rungs.length).toBe(3);
  for (const rung of rungs) {
    expect(rung.textContent).toContain('A surprise list');
  }
});

test('the card view renders card.md, not raw markdown', () => {
  location.hash = 'card';
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('list');
  expect(body?.querySelector('pre code')?.textContent).toContain('number[]');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
