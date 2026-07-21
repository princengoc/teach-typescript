// @vitest-environment happy-dom
// Drives main.ts against the shipped index.html, so a broken wire fails here
// rather than in front of the kid. Asserts wiring only: the assertions must
// hold for both the red starter and the green solution.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, expect, test } from 'vitest';

function bodyOf(html: string): string {
  return html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
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

test('the for-loop trace climbs the counter and stops', () => {
  document.querySelector<HTMLElement>('#for-run')?.click();
  const log = document.querySelector('#for-log')?.textContent ?? '';
  expect(log).toContain('i = 0');
  expect(log).toContain('i = 3');
  expect(log).toContain('i < 4 ? no');
});

test('the recursion trace counts down to the base case', () => {
  document.querySelector<HTMLElement>('#rec-run')?.click();
  const log = document.querySelector('#rec-log')?.textContent ?? '';
  expect(log).toContain('countDown(4)');
  expect(log).toContain('base case');
});

test('the fixed move fits one room and misses the other', () => {
  document.querySelector<HTMLElement>('#why-run')?.click();
  const a = document.querySelector('#why-cap-a')?.textContent ?? '';
  const b = document.querySelector('#why-cap-b')?.textContent ?? '';
  expect(a).toContain('PASS');
  expect(b).toContain('wrong');
});

test('the build view lists five rungs, each graded in two rooms', () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#build')?.hidden).toBe(false);
  const rungs = document.querySelectorAll('#rungs .rung');
  expect(rungs.length).toBe(5);
  const captions = document.querySelectorAll('#rungs figcaption');
  expect(captions.length).toBe(10);
});

test('the blind rung adds a surprise room labelled with a hidden side', () => {
  const blind = document.querySelectorAll('#rungs .rung')[4];
  expect(blind?.textContent).toContain('A surprise room');
  expect(blind?.textContent).toContain('side ?');
});

test('the card view renders card.md, not raw markdown', () => {
  location.hash = 'card';
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('loop');
  expect(body?.querySelector('pre code')?.textContent).toContain('for');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
