// @vitest-environment happy-dom
// Drives main.ts against the shipped index.html, so a broken wire fails here
// rather than in front of the kid. Asserts wiring only: the assertions must
// hold for both the red starter and the green solution.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, test, vi } from 'vitest';
import { backHalfVariants } from './task';

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

test('the intro runs the worked rule over rung 1 own lane', () => {
  const lane = backHalfVariants[0];
  expect(lane).toBeDefined();
  if (!lane) return;
  expect(document.querySelector('#demo-run')?.textContent).toContain(
    `lane ${lane.width}`,
  );
  vi.useFakeTimers();
  document.querySelector<HTMLElement>('#demo-run')?.click();
  vi.advanceTimersByTime(60000);
  vi.useRealTimers();
  const log = document.querySelector('#demo-log')?.textContent ?? '';
  for (let i = 0; i < lane.width; i += 1) {
    expect(log).toContain(`i = ${i}`);
  }
  expect(log).toContain('the back half is painted');
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
    expect(rung.textContent).toContain('A surprise lane');
  }
});

test('every rule the kid writes is also asked on its own', () => {
  const checks = document.querySelectorAll('#rungs .check');
  const lines = [...checks].map((check) => check.textContent ?? '');
  expect(lines.length).toBe(3);
  for (const name of ['backHalf', 'stripe', 'bandRow']) {
    expect(lines.some((line) => line.startsWith(`${name} on its own`))).toBe(
      true,
    );
  }
});

test('the card view renders card.md, not raw markdown', () => {
  location.hash = 'card';
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('do the sum');
  expect(body?.querySelector('pre code')?.textContent).toContain('boolean');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
