import cardSource from '../card.md?raw';
import kitSource from '../kit.md?raw';
import wordbookSource from '../wordbook.md?raw';
import {
  backToRowStart,
  nextRow,
  paintBand,
  paintBands,
  paintChart,
  paintRun,
} from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld } from './harness/render';
import { runProgram } from './harness/robot';
import {
  bandsVariants,
  chartVariants,
  checkBackToRowStart,
  checkNextRow,
  checkPaintBand,
  judge,
  judgeRung,
  randomBandsVariant,
  randomChartVariant,
  randomRunVariant,
  runVariants,
  startWorld,
  targetWorld,
  toRoom,
  type Variant,
  type Verdict,
} from './harness/task';
import { applyBeat, beats, moveNames } from './harness/trace';
import type { Room } from './harness/types';

type View = 'learn' | 'build' | 'card' | 'kit';
const VIEWS: View[] = ['learn', 'build', 'card', 'kit'];
const CELL = 26;

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The intro runs on the first room rung 2 is graded in, so the picture the kid
// watches unfold is the picture their own moves have to draw.
const FIRST_ROOM = chartVariants[0];
if (!FIRST_ROOM) throw new Error('lesson 11: a chart room is required');
const INTRO: Variant = FIRST_ROOM;

const TRACE_MS = 260;
const COLUMN = 16;

let cancelDemo: (() => void) | null = null;

function column(text: string): string {
  return text.padEnd(COLUMN);
}

// The intro animation unfolds the named moves into the robot calls underneath.
// The left column only speaks when the name changes; the right column speaks
// every beat. Four names, twenty-odd calls.
function runDemoAnim(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const log = el('demo-log');
  if (!canvas || !log) return;
  cancelDemo?.();

  const script = beats(INTRO);
  let world = startWorld(INTRO);
  const lines = [`${column('your move')}what the robot does`, ''];
  let index = 0;
  let spoken = '';
  let timer = 0;

  const draw = (): void => {
    drawWorld({ canvas, world, target: targetWorld(INTRO), cell: CELL });
  };

  draw();
  log.textContent = lines.join('\n');

  const tick = (): void => {
    const beat = script[index];
    if (!beat) {
      lines.push('');
      lines.push(
        `${moveNames(script).length} names. ${script.length} robot calls.`,
      );
      log.textContent = lines.join('\n');
      return;
    }
    world = applyBeat(world, beat);
    lines.push(`${column(beat.move === spoken ? '' : beat.move)}${beat.call}`);
    spoken = beat.move;
    log.textContent = lines.join('\n');
    draw();
    index += 1;
    timer = window.setTimeout(tick, TRACE_MS);
  };
  timer = window.setTimeout(tick, TRACE_MS);
  cancelDemo = () => window.clearTimeout(timer);
}

function drawDemoRest(): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  if (canvas) {
    drawWorld({
      canvas,
      world: startWorld(INTRO),
      target: targetWorld(INTRO),
      cell: CELL,
    });
  }
  const log = el('demo-log');
  if (log) {
    log.textContent = 'Press the button: your moves, one robot call at a time.';
  }
}

function setIntroText(): void {
  const script = beats(INTRO);
  const slots: [string, string][] = [
    ['data-intro-bars', INTRO.label],
    ['data-intro-names', String(moveNames(script).length)],
    ['data-intro-calls', String(script.length)],
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

const RUNGS: Rung[] = [
  {
    key: 'run',
    title: '1. Write paintCells',
    program: paintRun,
    variants: runVariants,
    mystery: randomRunVariant,
    checks: [],
  },
  {
    key: 'chart',
    title: '2. Write nextRow, and draw the chart',
    program: paintChart,
    variants: chartVariants,
    mystery: randomChartVariant,
    checks: [
      {
        label: 'backToRowStart',
        run: () => checkBackToRowStart(backToRowStart),
      },
      { label: 'nextRow', run: () => checkNextRow(nextRow) },
    ],
  },
  {
    key: 'bands',
    title: '3. Cut the mess into a move',
    program: paintBands,
    variants: bandsVariants,
    mystery: randomBandsVariant,
    checks: [{ label: 'paintBand', run: () => checkPaintBand(paintBand) }],
  },
];

// A move has to work when it is called on its own, or it is not a move. These
// checks call the kid's moves by themselves, away from any picture.
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

// A surprise room, new every run, to prove the code reads the room. It grades
// but does not gate: the two fixed rooms decide.
function renderMystery(rung: Rung): HTMLElement {
  const variant = rung.mystery();
  const box = document.createElement('div');
  const label = document.createElement('p');
  label.textContent = 'A surprise room, a new one each run:';
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

function rungSolved(rung: Rung): boolean {
  if (!judgeRung(rung.variants, rung.program).solved) return false;
  return rung.checks.every((check) => check.run().solved);
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
  const result = judgeRung(rung.variants, rung.program);
  const solved = rungSolved(rung);
  verdict.textContent = solved ? 'PASS' : `Not yet: ${result.message}`;
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
