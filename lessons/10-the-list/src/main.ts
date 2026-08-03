import cardSource from '../card.md?raw';
import kitSource from '../kit.md?raw';
import wordbookSource from '../wordbook.md?raw';
import { paintChart, paintTallBars, paintTallest } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  chartVariants,
  judge,
  judgeRung,
  randomChartVariant,
  randomTallestVariant,
  randomTallVariant,
  startWorld,
  tallestVariants,
  tallVariants,
  targetWorld,
  toRoom,
  type Variant,
} from './harness/task';
import { applyBeat, beatLine, beats } from './harness/trace';
import type { Room } from './harness/types';

type View = 'learn' | 'build' | 'card' | 'kit';
const VIEWS: View[] = ['learn', 'build', 'card', 'kit'];
const CELL = 26;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The one source for the intro's numbers: the two rooms rung 1 is graded in.
// The same beats run against both lists, and two charts come out.
const [FIRST_ROOM, SECOND_ROOM] = chartVariants;
if (!FIRST_ROOM || !SECOND_ROOM) {
  throw new Error('lesson 10: two chart rooms are required');
}
const INTRO_A: Variant = FIRST_ROOM;
const INTRO_B: Variant = SECOND_ROOM;

const TRACE_MS = 700;
const COLUMN = 18;

let cancelDemo: (() => void) | null = null;

function column(text: string): string {
  return text.padEnd(COLUMN);
}

// The intro animation feeds one loop two different lists, a number at a time,
// and draws both charts side by side. Nothing about the loop changes.
function runDemoAnim(): void {
  const canvasA = el<HTMLCanvasElement>('demo-canvas-a');
  const canvasB = el<HTMLCanvasElement>('demo-canvas-b');
  const log = el('demo-log');
  if (!canvasA || !canvasB || !log) return;
  cancelDemo?.();

  const scriptA = beats(INTRO_A);
  const scriptB = beats(INTRO_B);
  let worldA = startWorld(INTRO_A);
  let worldB = startWorld(INTRO_B);
  const lines = [`${column(INTRO_A.label)}${INTRO_B.label}`, ''];
  let index = 0;
  let timer = 0;

  const draw = (): void => {
    drawWorld({
      canvas: canvasA,
      world: worldA,
      target: targetWorld(INTRO_A),
      cell: CELL,
    });
    drawWorld({
      canvas: canvasB,
      world: worldB,
      target: targetWorld(INTRO_B),
      cell: CELL,
    });
  };

  draw();
  log.textContent = lines.join('\n');

  const tick = (): void => {
    const beatA = scriptA[index];
    const beatB = scriptB[index];
    if (!beatA && !beatB) {
      lines.push('');
      lines.push('both lists ran out. Same loop, two charts.');
      log.textContent = lines.join('\n');
      return;
    }
    if (beatA) worldA = applyBeat(worldA, beatA);
    if (beatB) worldB = applyBeat(worldB, beatB);
    lines.push(
      `${column(beatA ? beatLine(beatA) : 'list done')}${
        beatB ? beatLine(beatB) : 'list done'
      }`,
    );
    log.textContent = lines.join('\n');
    draw();
    index += 1;
    timer = window.setTimeout(tick, TRACE_MS);
  };
  timer = window.setTimeout(tick, TRACE_MS);
  cancelDemo = () => window.clearTimeout(timer);
}

function drawDemoRest(): void {
  const canvasA = el<HTMLCanvasElement>('demo-canvas-a');
  const canvasB = el<HTMLCanvasElement>('demo-canvas-b');
  if (canvasA) {
    drawWorld({
      canvas: canvasA,
      world: startWorld(INTRO_A),
      target: targetWorld(INTRO_A),
      cell: CELL,
    });
  }
  if (canvasB) {
    drawWorld({
      canvas: canvasB,
      world: startWorld(INTRO_B),
      target: targetWorld(INTRO_B),
      cell: CELL,
    });
  }
  const log = el('demo-log');
  if (log) {
    log.textContent =
      'Press the button: one loop, two lists, a number at a time.';
  }
}

function setIntroText(): void {
  const slots: [string, string][] = [
    ['data-intro-bars-a', INTRO_A.label],
    ['data-intro-bars-b', INTRO_B.label],
    ['data-intro-count-a', String(INTRO_A.bars.length)],
  ];
  for (const [attribute, text] of slots) {
    for (const slot of document.querySelectorAll<HTMLElement>(
      `[${attribute}]`,
    )) {
      slot.textContent = text;
    }
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

const RUNGS: Rung[] = [
  {
    key: 'chart',
    title: '1. Draw the bar chart',
    program: paintChart,
    variants: chartVariants,
    mystery: randomChartVariant,
  },
  {
    key: 'tall',
    title: '2. Skip the short bars',
    program: paintTallBars,
    variants: tallVariants,
    mystery: randomTallVariant,
  },
  {
    key: 'tallest',
    title: '3. Draw the tallest bar',
    program: paintTallest,
    variants: tallestVariants,
    mystery: randomTallestVariant,
  },
];

// A surprise list, new every run, to prove the loop reads room.bars instead of
// numbers typed in. It grades but does not gate: the two fixed rooms decide.
function renderMystery(rung: Rung): HTMLElement {
  const variant = rung.mystery();
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise list, a new one each run:';
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
