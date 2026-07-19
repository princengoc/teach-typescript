import cardSource from '../card.md?raw';
import { paintTheRoom } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld, replay } from './harness/render';
import { robot, runProgram } from './harness/robot';
import {
  doorName,
  doors,
  judge,
  judgeAll,
  leftDoor,
  rightDoor,
  startWorld,
  targetWorld,
} from './harness/task';
import type { Cell } from './harness/types';

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

// The move the taught part runs in both rooms: no question asked, so it
// survives one room and crashes in the other.
function alwaysTurnRight(): void {
  robot.turnRight();
  robot.paint();
  robot.walk(1);
  robot.paint();
  robot.walk(1);
  robot.paint();
}

const DEMO: { door: Cell; canvas: string; caption: string }[] = [
  { door: leftDoor, canvas: 'room-left', caption: 'cap-left' },
  { door: rightDoor, canvas: 'room-right', caption: 'cap-right' },
];

function drawDemoRooms(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    if (!canvas) continue;
    drawWorld({
      canvas,
      world: startWorld(room.door),
      target: targetWorld(room.door),
      door: room.door,
      cell: 26,
    });
  }
}

// The verdict is set at once and the picture animates behind it, so the
// contrast between the two rooms is readable before the replay finishes.
function runDemo(): void {
  for (const room of DEMO) {
    const canvas = el<HTMLCanvasElement>(room.canvas);
    const caption = el(room.caption);
    const verdict = judge(room.door, alwaysTurnRight);
    if (caption) {
      caption.textContent = `${doorName(room.door)}: ${verdict.solved ? 'PASS' : 'crash'}`;
      caption.style.color = TONE_COLOR[verdict.tone];
    }
    if (!canvas) continue;
    replay({
      canvas,
      start: startWorld(room.door),
      commands: runProgram(startWorld(room.door), alwaysTurnRight).commands,
      target: targetWorld(room.door),
      door: room.door,
      frameMs: 260,
    });
  }
  const askIt = el('ask-it');
  if (askIt) askIt.hidden = false;
}

// The sensor console: one call, one answer, in each room. Seeing true and
// false side by side is what makes a boolean a value rather than a word.
function ask(): void {
  const log = el('ask-log');
  if (!log) return;
  log.textContent = doors
    .map(
      (door) => `// ${doorName(door)}\nrobot.wallOnLeft();  ->  ${sense(door)}`,
    )
    .join('\n\n');
  const branch = el('branch');
  if (branch) branch.hidden = false;
}

function sense(door: Cell): boolean {
  let answer = false;
  runProgram(startWorld(door), () => {
    answer = robot.wallOnLeft();
  });
  return answer;
}

// The build view. The coin decides which room the kid watches; the two tiles
// underneath always report both, so half a solution cannot look finished.
let stopReplay: (() => void) | null = null;
let flipped: Cell = leftDoor;

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
    start: startWorld(flipped),
    commands: runProgram(startWorld(flipped), paintTheRoom).commands,
    target: targetWorld(flipped),
    door: flipped,
    frameMs: 200,
    onFinish: () => {
      const result = judge(flipped, paintTheRoom);
      verdict.textContent = `${doorName(flipped)}: ${result.message}`;
      verdict.style.color = TONE_COLOR[result.tone];
      const overall = judgeAll(paintTheRoom);
      if (done) done.hidden = !overall.solved;
    },
  });
}

function renderBoth(): void {
  const host = el('both');
  if (!host) return;
  host.replaceChildren();
  for (const door of doors) {
    const figure = document.createElement('figure');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('figcaption');
    const solved = judge(door, paintTheRoom).solved;
    drawWorld({
      canvas,
      world: runProgram(startWorld(door), paintTheRoom).world,
      target: targetWorld(door),
      door,
      cell: 18,
    });
    caption.textContent = `${doorName(door)}: ${solved ? 'PASS' : 'FAIL'}`;
    if (!solved) caption.className = 'fail';
    figure.append(canvas, caption);
    host.append(figure);
  }
}

function flip(): void {
  flipped = Math.random() < 0.5 ? leftDoor : rightDoor;
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
  if (view === 'learn') drawDemoRooms();
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

el('run-same')?.addEventListener('click', runDemo);
el('ask')?.addEventListener('click', ask);
el('to-build')?.addEventListener('click', () => go('lesson'));
el('flip')?.addEventListener('click', flip);
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
