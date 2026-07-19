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

test('the preview opens on the syntax, with the room still hidden', () => {
  expect(document.querySelector<HTMLElement>('#learn')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#room-part')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#card')?.hidden).toBe(true);
});

test('the same move passes one room and crashes the other', () => {
  document.querySelector<HTMLElement>('#to-room')?.click();
  expect(document.querySelector<HTMLElement>('#room-part')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#ask-it')?.hidden).toBe(true);
  document.querySelector<HTMLElement>('#run-same')?.click();
  expect(document.querySelector<HTMLElement>('#ask-it')?.hidden).toBe(false);
  const left = document.querySelector('#cap-left')?.textContent ?? '';
  const right = document.querySelector('#cap-right')?.textContent ?? '';
  expect(left).toContain('crash');
  expect(right).toContain('PASS');
});

test('the sensor answers false on the left and true on the right', () => {
  document.querySelector<HTMLElement>('#ask')?.click();
  const log = document.querySelector('#ask-log')?.textContent ?? '';
  expect(log).toContain('door on the left\nrobot.wallOnLeft();  ->  false');
  expect(log).toContain('door on the right\nrobot.wallOnLeft();  ->  true');
  expect(document.querySelector<HTMLElement>('#branch')?.hidden).toBe(false);
});

test('the build view reports both rooms, whichever way the coin lands', () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(false);
  document.querySelector<HTMLElement>('#flip')?.click();
  const tiles = document.querySelectorAll('#both figcaption');
  expect(tiles.length).toBe(2);
  expect(tiles[0]?.textContent).toContain('door on the left');
  expect(tiles[1]?.textContent).toContain('door on the right');
});

test('the build view replays the flipped room and reaches a verdict', async () => {
  const verdict = document.querySelector<HTMLElement>('#lesson-verdict');
  expect(verdict?.textContent).toBe('running...');
  await new Promise((resolve) => setTimeout(resolve, 4000));
  expect(verdict?.textContent).not.toBe('running...');
  expect(verdict?.textContent).toContain('door on the');
}, 20000);

test('the card view renders card.md, not raw markdown', () => {
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('coin-flip door');
  expect(body?.querySelector('pre code')?.textContent).toContain('else');
});

test('the card stays a recap: three terms, under 150 words', () => {
  const body = document.querySelector<HTMLElement>('#card-body');
  const prose = body?.textContent ?? '';
  expect(body?.querySelectorAll('p > b').length).toBeLessThanOrEqual(3);
  expect(prose.split(/\s+/).filter(Boolean).length).toBeLessThan(150);
});
