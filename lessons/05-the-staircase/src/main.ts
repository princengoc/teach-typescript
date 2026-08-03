import cardSource from '../card.md?raw';
import kitSource from '../kit.md?raw';
import wordbookSource from '../wordbook.md?raw';
import { paintStaircase } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { nextRow, paintCells } from './harness/moves';
import { drawWorld, replay } from './harness/render';
import { runProgram } from './harness/robot';
import {
  judge,
  judgeAll,
  longRoom,
  rooms,
  shortRoom,
  startWorld,
  targetWorld,
  toRoom,
  type Variant,
} from './harness/task';

type View = 'learn' | 'lesson' | 'card' | 'kit';
const VIEWS: View[] = ['learn', 'lesson', 'card', 'kit'];

const TONE_COLOR = {
  todo: '#c62828',
  progress: '#1565c0',
  done: '#2e7d32',
};

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The taught part: a value that changes. The button bumps one variable and
// prints it, so `let` and `+= 1` are a thing the kid watched move.
let demoLen = 1;
function showDemoLen(): void {
  const log = el('count-log');
  if (log) log.textContent = `len  ->  ${demoLen}`;
}
function bumpDemoLen(): void {
  demoLen += 1;
  showDemoLen();
}
function resetDemoLen(): void {
  demoLen = 1;
  showDemoLen();
}

// The two rooms the demo contrasts: they want different first rows, so a
// staircase with the lengths nailed in cannot fit both.
const DEMO: { variant: Variant; canvas: string; caption: string }[] = [
  { variant: shortRoom, canvas: 'room-a', caption: 'cap-a' },
  { variant: longRoom, canvas: 'room-b', caption: 'cap-b' },
];

// Lengths nailed to the first room, shown in the taught part as the code that
// looks right but only fits one room.
function fixedLengths(): void {
  paintCells(shortRoom.len);
  nextRow();
  paintCells(shortRoom.len + 1);
  nextRow();
  paintCells(shortRoom.len + 2);
}

function drawDemoRooms(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    if (!canvas) continue;
    drawWorld({
      canvas,
      world: startWorld(room.variant),
      target: targetWorld(room.variant),
      cell: 26,
    });
  }
}

function runDemo(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    const verdict = judge(room.variant, fixedLengths);
    if (caption) {
      caption.textContent = `${room.variant.label}: ${
        verdict.solved ? 'PASS' : 'wrong'
      }`;
      caption.style.color = TONE_COLOR[verdict.tone];
    }
    if (!canvas) continue;
    replay({
      canvas,
      start: startWorld(room.variant),
      commands: runProgram(startWorld(room.variant), fixedLengths).commands,
      target: targetWorld(room.variant),
      frameMs: 180,
    });
  }
  const askIt = el('ask-it');
  if (askIt) askIt.hidden = false;
}

// The room console: the same field read, one answer per room. Different
// numbers side by side are why you read the length instead of typing it.
function ask(): void {
  const log = el('ask-log');
  if (!log) return;
  log.textContent = DEMO.map(
    (room) =>
      `// ${room.variant.label}\nroom.len  ->  ${toRoom(room.variant).len}`,
  ).join('\n\n');
  const branch = el('branch');
  if (branch) branch.hidden = false;
}

// The build view. A press picks a room at random; the two tiles underneath
// always report every room, so code that fits only one cannot look finished.
let stopReplay: (() => void) | null = null;
let picked: Variant = shortRoom;

function renderLesson(): void {
  const canvas = el<HTMLCanvasElement>('lesson-canvas');
  const verdict = el('lesson-verdict');
  const done = el('lesson-done');
  if (!canvas || !verdict) return;
  stopReplay?.();
  verdict.textContent = 'running...';
  verdict.style.color = '#37474f';
  if (done) done.hidden = true;
  renderBoth();
  const room = toRoom(picked);
  stopReplay = replay({
    canvas,
    start: startWorld(picked),
    commands: runProgram(startWorld(picked), () => paintStaircase(room))
      .commands,
    target: targetWorld(picked),
    frameMs: 70,
    onFinish: () => {
      const result = judge(picked, paintStaircase);
      verdict.textContent = `${picked.label}: ${result.message}`;
      verdict.style.color = TONE_COLOR[result.tone];
      const overall = judgeAll(paintStaircase);
      if (done) done.hidden = !overall.solved;
    },
  });
}

function renderBoth(): void {
  const host = el('both');
  if (!host) return;
  host.replaceChildren();
  for (const variant of rooms) {
    const figure = document.createElement('figure');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('figcaption');
    const room = toRoom(variant);
    const solved = judge(variant, paintStaircase).solved;
    drawWorld({
      canvas,
      world: runProgram(startWorld(variant), () => paintStaircase(room)).world,
      target: targetWorld(variant),
      cell: 18,
    });
    caption.textContent = `${variant.label}: ${solved ? 'PASS' : 'FAIL'}`;
    if (!solved) caption.className = 'fail';
    figure.append(canvas, caption);
    host.append(figure);
  }
}

function build(): void {
  const index = Math.floor(Math.random() * rooms.length);
  picked = rooms[index] ?? shortRoom;
  renderLesson();
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
    showDemoLen();
    drawDemoRooms();
  }
  if (view === 'lesson') renderLesson();
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

el('bump')?.addEventListener('click', bumpDemoLen);
el('reset')?.addEventListener('click', resetDemoLen);
el('to-room')?.addEventListener('click', () => {
  const rooms = el('room-part');
  if (rooms) rooms.hidden = false;
  drawDemoRooms();
});
el('run-same')?.addEventListener('click', runDemo);
el('ask')?.addEventListener('click', ask);
el('to-build')?.addEventListener('click', () => go('lesson'));
el('build')?.addEventListener('click', build);
el('to-card')?.addEventListener('click', () => go('card'));
for (const link of document.querySelectorAll<HTMLElement>(
  '[data-back-learn]',
)) {
  link.addEventListener('click', () => go('learn'));
}
for (const link of document.querySelectorAll<HTMLElement>(
  '[data-back-lesson]',
)) {
  link.addEventListener('click', () => go('lesson'));
}

el('kit-open')?.addEventListener('click', () => {
  const now = currentView();
  if (now !== 'kit') lastView = now;
  go('kit');
});
el('kit-back')?.addEventListener('click', () => go(lastView));

show(currentView());
