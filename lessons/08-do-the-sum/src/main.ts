import cardSource from '../card.md?raw';
import kitSource from '../kit.md?raw';
import wordbookSource from '../wordbook.md?raw';
import {
  backHalf,
  bandRow,
  paintBackHalf,
  paintBandRows,
  paintStripes,
  stripe,
} from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  backHalfVariant,
  backHalfVariants,
  bandRowsVariant,
  bandRowsVariants,
  checkBackHalf,
  checkBandRow,
  checkStripe,
  judge,
  judgeRung,
  startWorld,
  stripeVariant,
  stripeVariants,
  targetWorld,
  toRoom,
  type Variant,
  type Verdict,
} from './harness/task';
import type { Room } from './harness/types';
import { step } from './harness/world';

type View = 'learn' | 'build' | 'card' | 'kit';
const VIEWS: View[] = ['learn', 'build', 'card', 'kit'];
const CELL = 30;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The one source for the intro's numbers: the first room rung 1 is graded in.
// The worked loop traces itself square by square in this same lane.
const ROOM_A = backHalfVariants[0];
if (!ROOM_A) throw new Error('lesson 08: no back-half rooms defined');

const TRACE_MS = 750;

// The rule the worked loop runs, spelled out for the trace: is this square at
// least halfway along?
function decisionLine(i: number, len: number): string {
  const yes = i >= len / 2;
  const pad = i < 10 ? ' ' : '';
  return `i = ${i}${pad}:  is ${i} >= ${len} / 2 ?  ${yes ? 'yes -> paint' : 'no  -> skip '}`;
}

let cancelDemo: (() => void) | null = null;

// The intro animation runs the loop one square at a time: the question asked,
// the answer, and the paint, all lined up with the robot's move. This is the
// shape the kid writes three times over.
function runDemoAnim(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const log = el('demo-log');
  if (!canvas || !ROOM_A || !log) return;
  cancelDemo?.();
  const len = ROOM_A.width;
  const target = targetWorld(ROOM_A);
  let world = startWorld(ROOM_A);
  const lines: string[] = [];
  let i = 0;
  let timer = 0;

  drawWorld({ canvas, world, target, cell: CELL });
  log.textContent = `the loop starts: i = 0, the first square of ${len}.`;

  const tick = (): void => {
    if (i >= len) {
      lines.push('');
      lines.push('loop done -- the back half is painted.');
      log.textContent = lines.join('\n');
      return;
    }
    if (i >= len / 2) world = step(world, { kind: 'paint' });
    lines.push(decisionLine(i, len));
    log.textContent = lines.join('\n');
    drawWorld({ canvas, world, target, cell: CELL });
    if (i < len - 1) world = step(world, { kind: 'step' });
    i += 1;
    timer = window.setTimeout(tick, TRACE_MS);
  };
  timer = window.setTimeout(tick, TRACE_MS);
  cancelDemo = () => window.clearTimeout(timer);
}

function drawDemoRest(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  if (!canvas || !ROOM_A) return;
  drawWorld({
    canvas,
    world: startWorld(ROOM_A),
    target: targetWorld(ROOM_A),
    cell: CELL,
  });
  const log = el('demo-log');
  if (log) {
    log.textContent =
      'Press the button: watch the loop run the rule, one square at a time.';
  }
}

function setIntroText(): void {
  const demoButton = el('demo-run');
  if (demoButton && ROOM_A) {
    demoButton.textContent = `run the loop (lane ${ROOM_A.width})`;
  }
}

function drawResult(
  canvas: HTMLCanvasElement,
  variant: Variant,
  program: (room: Room) => void,
): boolean {
  const room = toRoom(variant);
  drawWorld({
    canvas,
    world: runProgram(startWorld(variant), () => program(room)).world,
    target: targetWorld(variant),
    cell: CELL,
  });
  return judge(variant, program).solved;
}

interface Check {
  label: string;
  run: () => Verdict;
}

interface Rung {
  key: string;
  title: string;
  program: (room: Room) => void;
  variants: Variant[];
  mystery: () => Variant;
  checks: Check[];
}

function randomSize(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

const RUNGS: Rung[] = [
  {
    key: 'half',
    title: '1. Paint the back half',
    program: paintBackHalf,
    variants: backHalfVariants,
    mystery: () => backHalfVariant(randomSize(6, 5)),
    checks: [{ label: 'backHalf', run: () => checkBackHalf(backHalf) }],
  },
  {
    key: 'stripe',
    title: '2. Paint every other square',
    program: paintStripes,
    variants: stripeVariants,
    mystery: () => stripeVariant(randomSize(7, 5)),
    checks: [{ label: 'stripe', run: () => checkStripe(stripe) }],
  },
  {
    key: 'band',
    title: '3. Paint the rows from lo to hi',
    program: paintBandRows,
    variants: bandRowsVariants,
    mystery: () => {
      const width = randomSize(5, 4);
      const height = randomSize(4, 4);
      const lo = randomSize(1, 2);
      const hi = Math.min(lo + randomSize(1, 3), height - 1);
      return bandRowsVariant(width, height, lo, hi);
    },
    checks: [{ label: 'bandRow', run: () => checkBandRow(bandRow) }],
  },
];

// A rule is an answer about one square. These ask it about every square of the
// room, away from the picture, so a rule that is right reads PASS even while
// the loop around it is still wrong -- and a picture painted some other way
// cannot stand in for the rule.
function renderChecks(rung: Rung): HTMLElement | null {
  if (rung.checks.length === 0) return null;
  const box = document.createElement('div');
  for (const check of rung.checks) {
    const verdict = check.run();
    const line = document.createElement('p');
    line.className = 'check';
    line.textContent = `${check.label} on its own: ${
      verdict.solved ? 'PASS' : verdict.message
    }`;
    line.style.color = verdict.solved ? '#2e7d32' : '#c62828';
    box.append(line);
  }
  return box;
}

function rungSolved(rung: Rung): boolean {
  if (!judgeRung(rung.variants, rung.program).solved) return false;
  return rung.checks.every((check) => check.run().solved);
}

// What to tell the kid when a rung is not done: the picture, or the rule when
// the picture came out right some other way.
function rungMessage(rung: Rung): string {
  const picture = judgeRung(rung.variants, rung.program);
  if (!picture.solved) return picture.message;
  const check = rung.checks.map((entry) => entry.run()).find((v) => !v.solved);
  return check ? check.message : picture.message;
}

// A random room, redrawn each run, to prove the rule reads the numbers and does
// not hardcode them. It grades but does not gate the rung: the fixed rooms
// decide PASS.
function renderMystery(rung: Rung): HTMLElement {
  const variant = rung.mystery();
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise lane, a new size each run:';
  label.style.margin = '0.4rem 0 0.2rem';
  const figs = document.createElement('div');
  figs.className = 'figs';
  const figure = document.createElement('figure');
  const canvas = document.createElement('canvas');
  const caption = document.createElement('p');
  const solved = drawResult(canvas, variant, rung.program);
  caption.textContent = `${variant.label}: ${solved ? 'PASS' : 'FAIL'}`;
  caption.className = solved ? 'verdict' : 'verdict fail';
  caption.style.textAlign = 'center';
  caption.style.color = solved ? '#2e7d32' : '#c62828';
  figure.append(canvas, caption);
  figs.append(figure);
  box.append(label, figs);
  return box;
}

function renderRung(rung: Rung): HTMLElement {
  const block = document.createElement('div');
  block.className = 'rung';

  const title = document.createElement('h3');
  title.textContent = rung.title;
  block.append(title);

  const checks = renderChecks(rung);
  if (checks) block.append(checks);

  const figs = document.createElement('div');
  figs.className = 'figs';
  for (const variant of rung.variants) {
    const figure = document.createElement('figure');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('figcaption');
    const solved = drawResult(canvas, variant, rung.program);
    caption.textContent = `${variant.label}: ${solved ? 'PASS' : 'FAIL'}`;
    if (!solved) caption.className = 'fail';
    figure.append(canvas, caption);
    figs.append(figure);
  }
  block.append(figs);
  block.append(renderMystery(rung));

  const verdict = document.createElement('p');
  verdict.className = 'verdict';
  const solved = rungSolved(rung);
  verdict.textContent = solved ? 'PASS' : `Not yet: ${rungMessage(rung)}`;
  verdict.style.color = solved ? '#2e7d32' : '#c62828';
  block.append(verdict);

  return block;
}

function renderBuild(): void {
  const host = el('rungs');
  if (!host) return;
  host.replaceChildren();
  let allSolved = true;
  for (const rung of RUNGS) {
    host.append(renderRung(rung));
    if (!rungSolved(rung)) allSolved = false;
  }
  const done = el('build-done');
  if (done) done.hidden = !allSolved;
}

let lastView: View = 'learn';

// The kit and the wordbook are the two pages the kid looks things up in. Both
// are files in the lesson, so this puts them on screen without a second copy.
function renderKit(): void {
  const body = el('kit-body');
  if (body) {
    body.innerHTML = renderMarkdown(`${kitSource}\n\n${wordbookSource}`);
  }
}

function renderCard(): void {
  const body = el('card-body');
  if (body) body.innerHTML = renderMarkdown(cardSource);
}

function show(view: View): void {
  for (const id of VIEWS) {
    const section = el(id);
    if (section) section.hidden = id !== view;
  }
  if (view === 'learn') {
    setIntroText();
    drawDemoRest();
  }
  if (view === 'build') renderBuild();
  if (view === 'card') renderCard();
  if (view === 'kit') renderKit();
}

function currentView(): View {
  const hash = location.hash.replace('#', '') as View;
  return VIEWS.includes(hash) ? hash : 'learn';
}

function go(view: View): void {
  location.hash = view;
}

window.addEventListener('hashchange', () => show(currentView()));

el('demo-run')?.addEventListener('click', runDemoAnim);
el('to-build')?.addEventListener('click', () => go('build'));
el('run-build')?.addEventListener('click', renderBuild);
el('to-card')?.addEventListener('click', () => go('card'));
for (const link of document.querySelectorAll<HTMLElement>(
  '[data-back-learn]',
)) {
  link.addEventListener('click', () => go('learn'));
}
for (const link of document.querySelectorAll<HTMLElement>(
  '[data-back-build]',
)) {
  link.addEventListener('click', () => go('build'));
}

el('kit-open')?.addEventListener('click', () => {
  const now = currentView();
  if (now !== 'kit') lastView = now;
  go('kit');
});
el('kit-back')?.addEventListener('click', () => go(lastView));

show(currentView());
