import cardSource from '../card.md?raw';
import {
  paintRectangle,
  paintSquare,
  paintSquareBlind,
  paintStaircaseLoop,
  paintStaircaseRec,
} from './exercise';
import { renderMarkdown } from './harness/markdown';
import { paintSide } from './harness/moves';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  blindSquareVariant,
  blindVariants,
  judge,
  judgeRung,
  rectVariants,
  squareVariants,
  stairVariants,
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

// The intro's for-loop trace: the counter climbing while i < n.
function runForTrace(): void {
  const log = el('for-log');
  if (!log) return;
  const n = 4;
  const lines: string[] = [];
  for (let i = 0; i < n; i += 1) {
    lines.push(`i = ${i}    i < ${n} ? yes  ->  run the block`);
  }
  lines.push(`i = ${n}    i < ${n} ? no   ->  stop`);
  log.textContent = lines.join('\n');
}

// The intro's recursion trace: each call one smaller, until the base case.
function runRecTrace(): void {
  const log = el('rec-log');
  if (!log) return;
  const lines: string[] = [];
  for (let n = 4; n > 0; n -= 1) {
    lines.push(
      `countDown(${n})   ${n} === 0 ? no   ->  step, then countDown(${n - 1})`,
    );
  }
  lines.push('countDown(0)   0 === 0 ? yes  ->  stop (base case)');
  log.textContent = lines.join('\n');
}

// A rectangle with its size nailed to 4 by 2. It fits one room, misses the other.
function fixedRect(): void {
  for (let i = 0; i < 2; i += 1) {
    paintSide(4);
    paintSide(2);
  }
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

// The intro's why-a-loop demo: the fixed move in two rooms, one right, one wrong.
function runWhy(): void {
  const rooms = [
    { variant: rectVariants[0], canvas: 'why-a', caption: 'why-cap-a' },
    { variant: rectVariants[1], canvas: 'why-b', caption: 'why-cap-b' },
  ];
  for (const room of rooms) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    if (!canvas || !room.variant) continue;
    const solved = drawResult(canvas, room.variant, fixedRect);
    if (caption) {
      caption.textContent = `${room.variant.label}: ${solved ? 'PASS' : 'wrong'}`;
      caption.className = solved ? '' : 'fail';
    }
  }
}

function drawWhyGhosts(): void {
  for (const [id, variant] of [
    ['why-a', rectVariants[0]],
    ['why-b', rectVariants[1]],
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
}

const RUNGS: Rung[] = [
  {
    key: 'square',
    title: '1. Square',
    program: paintSquare,
    variants: squareVariants,
  },
  {
    key: 'rect',
    title: '2. Rectangle',
    program: paintRectangle,
    variants: rectVariants,
  },
  {
    key: 'stair-loop',
    title: '3. Staircase, a for loop',
    program: paintStaircaseLoop,
    variants: stairVariants,
  },
  {
    key: 'stair-rec',
    title: '4. Staircase, recursion',
    program: paintStaircaseRec,
    variants: stairVariants,
  },
  {
    key: 'blind',
    title: '5. Blind square, side hidden',
    program: paintSquareBlind,
    variants: blindVariants,
  },
];

// A random room, redrawn each run, to prove the code reads no number. It grades
// but does not gate the rung: the fixed rooms above decide PASS.
function renderMystery(program: () => void): HTMLElement {
  const side = 3 + Math.floor(Math.random() * 4);
  const variant = blindSquareVariant(side);
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise room, a new size each run:';
  label.style.margin = '0.4rem 0 0.2rem';
  const figs = document.createElement('div');
  figs.className = 'figs';
  const figure = document.createElement('figure');
  const canvas = document.createElement('canvas');
  const caption = document.createElement('p');
  const solved = drawResult(canvas, variant, program);
  caption.textContent = `side ?: ${solved ? 'PASS' : 'FAIL'}`;
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

  if (rung.key === 'blind') block.append(renderMystery(rung.program));

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

el('for-run')?.addEventListener('click', runForTrace);
el('rec-run')?.addEventListener('click', runRecTrace);
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
