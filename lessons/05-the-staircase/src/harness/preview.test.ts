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

test('the preview opens on the syntax, with the staircase still hidden', () => {
  expect(document.querySelector<HTMLElement>('#learn')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#room-part')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#card')?.hidden).toBe(true);
});

test('the counter climbs when the kid bumps it', () => {
  const log = document.querySelector('#count-log');
  expect(log?.textContent).toContain('1');
  document.querySelector<HTMLElement>('#bump')?.click();
  expect(log?.textContent).toContain('2');
  document.querySelector<HTMLElement>('#reset')?.click();
  expect(log?.textContent).toContain('1');
});

test('typed-in heights pass one room and miss the other', () => {
  document.querySelector<HTMLElement>('#to-room')?.click();
  expect(document.querySelector<HTMLElement>('#room-part')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#ask-it')?.hidden).toBe(true);
  document.querySelector<HTMLElement>('#run-same')?.click();
  expect(document.querySelector<HTMLElement>('#ask-it')?.hidden).toBe(false);
  const a = document.querySelector('#cap-a')?.textContent ?? '';
  const b = document.querySelector('#cap-b')?.textContent ?? '';
  expect(a).toContain('PASS');
  expect(b).toContain('wrong');
});

test('the sensor answers 2 in one room and 3 in the other', () => {
  document.querySelector<HTMLElement>('#ask')?.click();
  const log = document.querySelector('#ask-log')?.textContent ?? '';
  expect(log).toContain('first bar 2\nrobot.startHeight();  ->  2');
  expect(log).toContain('first bar 3\nrobot.startHeight();  ->  3');
  expect(document.querySelector<HTMLElement>('#branch')?.hidden).toBe(false);
});

test('the build view reports both rooms, whichever one it picks', () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(false);
  document.querySelector<HTMLElement>('#build')?.click();
  const tiles = document.querySelectorAll('#both figcaption');
  expect(tiles.length).toBe(2);
  expect(tiles[0]?.textContent).toContain('first bar 2');
  expect(tiles[1]?.textContent).toContain('first bar 3');
});

test('the build view replays the picked room and reaches a verdict', async () => {
  const verdict = document.querySelector<HTMLElement>('#lesson-verdict');
  expect(verdict?.textContent).toBe('running...');
  await new Promise((resolve) => setTimeout(resolve, 6000));
  expect(verdict?.textContent).not.toBe('running...');
  expect(verdict?.textContent).toContain('first bar');
}, 20000);

test('the card view renders card.md, not raw markdown', () => {
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain(
    'value that changes',
  );
  expect(body?.querySelector('pre code')?.textContent).toContain('let');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
