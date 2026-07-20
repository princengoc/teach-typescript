import cardSource from '../card.md?raw';
import { paintStaircase } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { goToNextBar, paintBar } from './harness/moves';
import { drawWorld, replay } from './harness/render';
import { robot, runProgram } from './harness/robot';
import {
  judge,
  judgeAll,
  roomName,
  rooms,
  startWorld,
  targetWorld,
} from './harness/task';

type View = 'learn' | 'lesson' | 'card';
const VIEWS: View[] = ['learn', 'lesson', 'card'];

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
let demoHeight = 1;
function showDemoHeight(): void {
  const log = el('count-log');
  if (log) log.textContent = `height  ->  ${demoHeight}`;
}
function bumpDemoHeight(): void {
  demoHeight += 1;
  showDemoHeight();
}
function resetDemoHeight(): void {
  demoHeight = 1;
  showDemoHeight();
}

// The two rooms the demo contrasts: they want different first bars, so a move
// with the heights nailed in cannot fit both.
const DEMO: { startHeight: number; canvas: string; caption: string }[] = [
  { startHeight: rooms[0] ?? 2, canvas: 'room-a', caption: 'cap-a' },
  { startHeight: rooms[1] ?? 3, canvas: 'room-b', caption: 'cap-b' },
];

// Heights nailed to the first room, shown in the taught part as the move that
// looks right but only fits one room.
function fixedHeights(): void {
  paintBar(rooms[0] ?? 2);
  goToNextBar();
  paintBar((rooms[0] ?? 2) + 1);
  goToNextBar();
  paintBar((rooms[0] ?? 2) + 2);
}

function drawDemoRooms(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    if (!canvas) continue;
    drawWorld({
      canvas,
      world: startWorld(room.startHeight),
      target: targetWorld(room.startHeight),
      cell: 26,
    });
  }
}

function runDemo(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    const verdict = judge(room.startHeight, fixedHeights);
    if (caption) {
      caption.textContent = `${roomName(room.startHeight)}: ${
        verdict.solved ? 'PASS' : 'wrong'
      }`;
      caption.style.color = TONE_COLOR[verdict.tone];
    }
    if (!canvas) continue;
    replay({
      canvas,
      start: startWorld(room.startHeight),
      commands: runProgram(startWorld(room.startHeight), fixedHeights).commands,
      target: targetWorld(room.startHeight),
      frameMs: 180,
    });
  }
  const askIt = el('ask-it');
  if (askIt) askIt.hidden = false;
}

// The sensor console: one call, one answer, in each room. Different numbers
// side by side are why you read the height instead of typing it.
function ask(): void {
  const log = el('ask-log');
  if (!log) return;
  log.textContent = DEMO.map(
    (room) =>
      `// ${roomName(room.startHeight)}\nrobot.startHeight();  ->  ${sense(
        room.startHeight,
      )}`,
  ).join('\n\n');
  const branch = el('branch');
  if (branch) branch.hidden = false;
}

function sense(startHeight: number): number {
  let answer = 0;
  runProgram(startWorld(startHeight), () => {
    answer = robot.startHeight();
  });
  return answer;
}

// The build view. A press picks a room at random; the two tiles underneath
// always report every room, so code that fits only one cannot look finished.
let stopReplay: (() => void) | null = null;
let picked: number = rooms[0] ?? 2;

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
  stopReplay = replay({
    canvas,
    start: startWorld(picked),
    commands: runProgram(startWorld(picked), paintStaircase).commands,
    target: targetWorld(picked),
    frameMs: 70,
    onFinish: () => {
      const result = judge(picked, paintStaircase);
      verdict.textContent = `${roomName(picked)}: ${result.message}`;
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
  for (const startHeight of rooms) {
    const figure = document.createElement('figure');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('figcaption');
    const solved = judge(startHeight, paintStaircase).solved;
    drawWorld({
      canvas,
      world: runProgram(startWorld(startHeight), paintStaircase).world,
      target: targetWorld(startHeight),
      cell: 18,
    });
    caption.textContent = `${roomName(startHeight)}: ${solved ? 'PASS' : 'FAIL'}`;
    if (!solved) caption.className = 'fail';
    figure.append(canvas, caption);
    host.append(figure);
  }
}

function build(): void {
  const index = Math.floor(Math.random() * rooms.length);
  picked = rooms[index] ?? rooms[0] ?? 2;
  renderLesson();
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
    showDemoHeight();
    drawDemoRooms();
  }
  if (view === 'lesson') renderLesson();
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

el('bump')?.addEventListener('click', bumpDemoHeight);
el('reset')?.addEventListener('click', resetDemoHeight);
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

show(currentView());
