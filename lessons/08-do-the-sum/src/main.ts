import cardSource from '../card.md?raw';
import { paintBackHalf, paintBand, paintStripes } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { next, paint } from './harness/moves';
import { drawWorld, replay } from './harness/render';
import { runProgram } from './harness/robot';
import {
  backHalfVariant,
  backHalfVariants,
  bandVariant,
  bandVariants,
  judge,
  judgeRung,
  startWorld,
  stripeVariant,
  stripeVariants,
  targetWorld,
  toRoom,
  type Variant,
} from './harness/task';
import type { Room } from './harness/types';

type View = 'learn' | 'build' | 'card';
const VIEWS: View[] = ['learn', 'build', 'card'];
const CELL = 30;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The one source for the intro's numbers: the two rooms rung 1 is graded in.
// The worked demo runs in the first; the why-a-rule demo runs in both.
const ROOM_A = backHalfVariants[0];
const ROOM_B = backHalfVariants[1];
if (!ROOM_A || !ROOM_B)
  throw new Error('lesson 08: no back-half rooms defined');
const GUESS = 3;

// The worked rule: paint a square when it is in the back half of the lane.
function backHalfDemo(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (i >= room.len / 2) paint();
    next();
  }
}

// The hardcoded guess: paint from square GUESS on. It fits the lane it was
// typed for and no other, because it reads no length.
function guessDemo(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (i >= GUESS) paint();
    next();
  }
}

let cancelDemo: (() => void) | null = null;

function ruleText(len: number, done: boolean): string {
  const line = `the rule:  paint square i when  i >= ${len} / 2`;
  if (done)
    return `${line}\nlane done: every square in the back half is painted.`;
  return line;
}

// The intro animation: the robot walks the lane while the rule is tested at
// each square, so the painted squares are the ones the rule said yes to.
function runDemoAnim(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const log = el('demo-log');
  if (!canvas || !ROOM_A || !log) return;
  cancelDemo?.();
  const start = startWorld(ROOM_A);
  const room = toRoom(ROOM_A);
  const { commands } = runProgram(start, () => backHalfDemo(room));
  const len = ROOM_A.len;
  log.textContent = ruleText(len, false);
  cancelDemo = replay({
    canvas,
    start: startWorld(ROOM_A),
    commands,
    target: targetWorld(ROOM_A),
    frameMs: 480,
    onFinish: () => {
      log.textContent = ruleText(len, true);
    },
  });
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
  if (log)
    log.textContent = 'Press the button: watch the rule paint the back half.';
}

// Every number the intro names comes from the rooms, so the words match the
// pictures.
function setIntroText(): void {
  const demoButton = el('demo-run');
  if (demoButton && ROOM_A) {
    demoButton.textContent = `run the rule (lane ${ROOM_A.len})`;
  }
  const whyButton = el('why-run');
  if (whyButton) whyButton.textContent = `Run the guess-${GUESS} in both`;
  for (const [id, variant] of [
    ['why-cap-a', ROOM_A],
    ['why-cap-b', ROOM_B],
  ] as const) {
    const caption = el(id);
    if (caption && variant) caption.textContent = variant.label;
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

// The why-a-rule demo: the fixed guess in two lanes, one right, one wrong.
function runWhy(): void {
  const rooms = [
    { variant: ROOM_A, canvas: 'why-a', caption: 'why-cap-a' },
    { variant: ROOM_B, canvas: 'why-b', caption: 'why-cap-b' },
  ];
  for (const room of rooms) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    if (!canvas || !room.variant) continue;
    const solved = drawResult(canvas, room.variant, guessDemo);
    if (caption) {
      caption.textContent = `${room.variant.label}: ${solved ? 'PASS' : 'wrong'}`;
      caption.className = solved ? '' : 'fail';
    }
  }
}

function drawWhyGhosts(): void {
  for (const [id, variant] of [
    ['why-a', ROOM_A],
    ['why-b', ROOM_B],
  ] as const) {
    const canvas = el<HTMLCanvasElement>(id);
    if (!canvas || !variant) continue;
    drawWorld({
      canvas,
      world: startWorld(variant),
      target: targetWorld(variant),
      cell: CELL,
    });
  }
}

interface Rung {
  key: string;
  title: string;
  program: (room: Room) => void;
  variants: Variant[];
  mystery: () => Variant;
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
  },
  {
    key: 'stripe',
    title: '2. Paint every other square',
    program: paintStripes,
    variants: stripeVariants,
    mystery: () => stripeVariant(randomSize(7, 5)),
  },
  {
    key: 'band',
    title: '3. Paint the band, lo to hi',
    program: paintBand,
    variants: bandVariants,
    mystery: () => {
      const len = randomSize(10, 4);
      const lo = randomSize(2, 3);
      const hi = lo + randomSize(2, 3);
      return bandVariant(len, lo, Math.min(hi, len - 1));
    },
  },
];

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
  const result = judgeRung(rung.variants, rung.program);
  verdict.textContent = result.solved ? 'PASS' : `Not yet: ${result.message}`;
  verdict.style.color = result.solved ? '#2e7d32' : '#c62828';
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
    if (!judgeRung(rung.variants, rung.program).solved) allSolved = false;
  }
  const done = el('build-done');
  if (done) done.hidden = !allSolved;
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
    drawWhyGhosts();
  }
  if (view === 'build') renderBuild();
  if (view === 'card') renderCard();
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
el('why-run')?.addEventListener('click', runWhy);
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

show(currentView());
