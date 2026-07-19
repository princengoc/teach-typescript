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

test('the preview opens on the try-the-calls view', () => {
  expect(document.querySelector<HTMLElement>('#learn')?.hidden).toBe(false);
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(true);
  expect(document.querySelector<HTMLElement>('#card')?.hidden).toBe(true);
});

test('pressing a call button logs exactly that call', () => {
  const log = document.querySelector<HTMLElement>('#try-log');
  expect(log?.textContent).toContain('your calls appear here');
  document.querySelector<HTMLElement>('[data-call="paint"]')?.click();
  document.querySelector<HTMLElement>('[data-call="step"]')?.click();
  expect(log?.textContent).toBe('robot.paint();\nrobot.step();');
  document.querySelector<HTMLElement>('#try-reset')?.click();
  expect(log?.textContent).toContain('your calls appear here');
});

test('the build view replays the script and reaches a verdict', async () => {
  document.querySelector<HTMLElement>('#to-build')?.click();
  expect(document.querySelector<HTMLElement>('#lesson')?.hidden).toBe(false);
  const verdict = document.querySelector<HTMLElement>('#lesson-verdict');
  expect(verdict?.textContent).toBe('running...');
  await new Promise((resolve) => setTimeout(resolve, 6000));
  expect(verdict?.textContent).not.toBe('running...');
  expect(verdict?.textContent?.length).toBeGreaterThan(0);
}, 20000);

test('the card view renders card.md, not raw markdown', () => {
  document.querySelector<HTMLElement>('#to-card')?.click();
  const body = document.querySelector<HTMLElement>('#card-body');
  expect(body?.querySelector('h2')?.textContent).toContain('calling functions');
  expect(body?.querySelector('table')).not.toBe(null);
});
