import cardSource from '../card.md?raw';
import kitSource from '../kit.md?raw';
import wordbookSource from '../wordbook.md?raw';
import { fillBox, paintChecker, paintStaircase } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  checkerVariant,
  checkerVariants,
  fillVariant,
  fillVariants,
  judge,
  judgeRung,
  stairVariant,
  stairVariants,
  startWorld,
  targetWorld,
  toRoom,
  type Variant,
} from './harness/task';
import { applyBeat, beatLine, beats } from './harness/trace';
import type { Room } from './harness/types';

type View = 'learn' | 'build' | 'card' | 'kit';
const VIEWS: View[] = ['learn', 'build', 'card', 'kit'];
const CELL = 30;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The one source for the intro's numbers: the first room rung 1 is graded in.
// The worked nest traces itself square by square in this same box.
const INTRO = fillVariants[0];
if (!INTRO) throw new Error('lesson 09: no fill rooms defined');

const TRACE_MS = 330;

let cancelDemo: (() => void) | null = null;

// The intro animation runs the nest one beat at a time: the outer loop starts a
// row, the inner loop walks it square by square, then the robot drops. This is
// the shape the kid writes three times over.
function runDemoAnim(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const log = el('demo-log');
  if (!canvas || !INTRO || !log) return;
  cancelDemo?.();
  const target = targetWorld(INTRO);
  let world = startWorld(INTRO);
  const script = beats(INTRO);
  const lines: string[] = [];
  let index = 0;
  let timer = 0;

  drawWorld({ canvas, world, target, cell: CELL });
  log.textContent = 'the outer loop is about to start its first row.';

  const tick = (): void => {
    const beat = script[index];
    if (!beat) {
      lines.push('');
      lines.push(`loop done -- ${INTRO.height} rows, and the box is full.`);
      log.textContent = lines.join('\n');
      return;
    }
    world = applyBeat(world, beat);
    lines.push(beatLine(beat));
    log.textContent = lines.join('\n');
    drawWorld({ canvas, world, target, cell: CELL });
    index += 1;
    timer = window.setTimeout(tick, TRACE_MS);
  };
  timer = window.setTimeout(tick, TRACE_MS);
  cancelDemo = () => window.clearTimeout(timer);
}

function drawDemoRest(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  if (!canvas || !INTRO) return;
  drawWorld({
    canvas,
    world: startWorld(INTRO),
    target: targetWorld(INTRO),
    cell: CELL,
  });
  const log = el('demo-log');
  if (log) {
    log.textContent =
      'Press the button: watch the outer loop tick once while the inner one ticks a whole row.';
  }
}

function setIntroText(): void {
  if (!INTRO) return;
  const button = el('demo-run');
  if (button) button.textContent = `run the loops (${INTRO.label})`;
  for (const slot of document.querySelectorAll<HTMLElement>(
    '[data-intro-width]',
  )) {
    slot.textContent = String(INTRO.width);
  }
  for (const slot of document.querySelectorAll<HTMLElement>(
    '[data-intro-height]',
  )) {
    slot.textContent = String(INTRO.height);
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
    key: 'fill',
    title: '1. Fill the box',
    program: fillBox,
    variants: fillVariants,
    mystery: () => fillVariant(randomSize(3, 5), randomSize(2, 4)),
  },
  {
    key: 'checker',
    title: '2. Paint the checkerboard',
    program: paintChecker,
    variants: checkerVariants,
    mystery: () => checkerVariant(randomSize(4, 5), randomSize(2, 4)),
  },
  {
    key: 'stair',
    title: '3. Paint the staircase',
    program: paintStaircase,
    variants: stairVariants,
    mystery: () => {
      const width = randomSize(4, 5);
      return stairVariant(width, randomSize(2, Math.min(width, 5) - 1));
    },
  },
];

// A random box, redrawn each run, to prove the loops read the room's numbers
// and do not hardcode them. It grades but does not gate the rung: the fixed
// rooms decide PASS.
function renderMystery(rung: Rung): HTMLElement {
  const variant = rung.mystery();
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise box, a new size each run:';
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
