import cardSource from '../card.md?raw';
import { climbAndFloor, matchBars, paintFloatingRow } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { goToBuildLane, paintCells } from './harness/moves';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  climbFloorVariant,
  climbFloorVariants,
  floatingRowVariant,
  floatingRowVariants,
  judge,
  judgeRung,
  matchBarsVariant,
  matchBarsVariants,
  startWorld,
  targetWorld,
  type Variant,
} from './harness/task';

type View = 'learn' | 'build' | 'card';
const VIEWS: View[] = ['learn', 'build', 'card'];
const CELL = 22;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The intro's trace: a returning recursion counting to a wall three squares
// away, then unwinding one-plus-the-rest into the answer.
function runMeasureTrace(): void {
  const log = el('measure-log');
  if (!log) return;
  const gap = 3;
  const lines: string[] = [];
  for (let square = 0; square < gap - 1; square += 1) {
    lines.push(
      `square ${square}   wall ahead? no    walk on, then 1 + (the rest)`,
    );
  }
  lines.push(`square ${gap - 1}   wall ahead? yes   return 1`);
  lines.push('');
  let running = 1;
  const steps = ['1'];
  for (let i = 1; i < gap; i += 1) {
    running += 1;
    steps.push(`1 + ${running - 1} = ${running}`);
  }
  lines.push(`unwinding:  ${steps.join('   ->   ')}`);
  lines.push(`the number handed back:  ${gap}`);
  log.textContent = lines.join('\n');
}

// A guess with the gap nailed to 3. It fits the room it was typed for and no
// other, because no number is read.
function guessThree(): void {
  goToBuildLane();
  paintCells(3);
}

function drawResult(
  canvas: HTMLCanvasElement,
  variant: Variant,
  program: () => void,
): boolean {
  drawWorld({
    canvas,
    world: runProgram(startWorld(variant), program).world,
    target: targetWorld(variant),
    cell: CELL,
  });
  return judge(variant, program).solved;
}

// The intro's why-measure demo: the fixed guess in two rooms, one right, one
// wrong.
function runWhy(): void {
  const rooms = [
    { variant: floatingRowVariants[0], canvas: 'why-a', caption: 'why-cap-a' },
    { variant: floatingRowVariants[1], canvas: 'why-b', caption: 'why-cap-b' },
  ];
  for (const room of rooms) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    if (!canvas || !room.variant) continue;
    const solved = drawResult(canvas, room.variant, guessThree);
    if (caption) {
      caption.textContent = `${room.variant.label}: ${solved ? 'PASS' : 'wrong'}`;
      caption.className = solved ? '' : 'fail';
    }
  }
}

function drawWhyGhosts(): void {
  for (const [id, variant] of [
    ['why-a', floatingRowVariants[0]],
    ['why-b', floatingRowVariants[1]],
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
  program: () => void;
  variants: Variant[];
  mystery: () => Variant;
}

function randomSize(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

const RUNGS: Rung[] = [
  {
    key: 'row',
    title: '1. Measure the gap, paint the row',
    program: paintFloatingRow,
    variants: floatingRowVariants,
    mystery: () => floatingRowVariant(randomSize(3, 4)),
  },
  {
    key: 'bars',
    title: '2. Measure the first bar, match the rest',
    program: matchBars,
    variants: matchBarsVariants,
    mystery: () => matchBarsVariant(randomSize(2, 4)),
  },
  {
    key: 'climb',
    title: '3. Count the climb, lay the floor',
    program: climbAndFloor,
    variants: climbFloorVariants,
    mystery: () => climbFloorVariant(randomSize(2, 4)),
  },
];

// A random room, redrawn each run, to prove the code reads no number. It grades
// but does not gate the rung: the fixed rooms decide PASS.
function renderMystery(rung: Rung): HTMLElement {
  const variant = rung.mystery();
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise room, a new size each run:';
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
  if (view === 'learn') drawWhyGhosts();
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

el('measure-run')?.addEventListener('click', runMeasureTrace);
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
