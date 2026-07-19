import cardSource from '../card.md?raw';
import './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawWorld, replay } from './harness/render';
import { script } from './harness/robot';
import {
  judge,
  lessonDoor,
  otherDoors,
  startWorld,
  targetWorld,
} from './harness/task';
import type { Command, World } from './harness/types';
import { run, step } from './harness/world';

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

// The try-it console: one press, one command, so a call reads as one event.
const TRY_DOOR = { x: 2, y: 1 };
const TRY_CALLS: Record<string, Command> = {
  paint: { kind: 'paint' },
  step: { kind: 'step' },
  turnLeft: { kind: 'turn', hand: 'left' },
};
let tryWorld: World = startWorld(TRY_DOOR);
let tryLog: string[] = [];

function renderTry(): void {
  const canvas = el<HTMLCanvasElement>('try-canvas');
  const log = el('try-log');
  if (canvas) {
    drawWorld({
      canvas,
      world: tryWorld,
      target: startWorld(TRY_DOOR),
      door: TRY_DOOR,
      cell: 36,
    });
  }
  if (!log) return;
  if (tryLog.length === 0) {
    log.innerHTML = '<span class="empty">your calls appear here</span>';
    return;
  }
  const crashed = tryWorld.crashed ? '\n// crash: that was a wall' : '';
  log.textContent = tryLog.join('\n') + crashed;
}

function pressCall(name: string): void {
  const command = TRY_CALLS[name];
  if (!command || tryWorld.crashed) return;
  tryWorld = step(tryWorld, command);
  tryLog.push(`robot.${name}();`);
  renderTry();
}

function resetTry(): void {
  tryWorld = startWorld(TRY_DOOR);
  tryLog = [];
  renderTry();
}

// The build view: replay the kid's recorded script, then judge the final world.
let stopReplay: (() => void) | null = null;

function renderLesson(): void {
  const canvas = el<HTMLCanvasElement>('lesson-canvas');
  const verdict = el('lesson-verdict');
  const done = el('lesson-done');
  if (!canvas || !verdict) return;
  stopReplay?.();
  verdict.textContent = 'running...';
  verdict.style.color = '#37474f';
  if (done) done.hidden = true;
  stopReplay = replay({
    canvas,
    start: startWorld(lessonDoor),
    commands: script(),
    target: targetWorld(lessonDoor),
    door: lessonDoor,
    onFinish: () => {
      const result = judge(lessonDoor, script());
      verdict.textContent = result.message;
      verdict.style.color = TONE_COLOR[result.tone];
      if (done) done.hidden = !result.solved;
      if (result.solved) renderAnywhere();
    },
  });
}

// The payoff: the same unedited script, replayed from two other doors.
function renderAnywhere(): void {
  const host = el('anywhere');
  if (!host || host.childElementCount > 0) return;
  for (const door of otherDoors) {
    const figure = document.createElement('figure');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('figcaption');
    const commands = script();
    drawWorld({
      canvas,
      world: run(startWorld(door), commands),
      target: targetWorld(door),
      door,
      cell: 18,
    });
    caption.textContent = judge(door, commands).solved ? 'PASS' : 'FAIL';
    figure.append(canvas, caption);
    host.append(figure);
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
  if (view === 'learn') renderTry();
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

for (const button of document.querySelectorAll<HTMLElement>('[data-call]')) {
  button.addEventListener('click', () => pressCall(button.dataset.call ?? ''));
}
el('try-reset')?.addEventListener('click', resetTry);
el('to-build')?.addEventListener('click', () => go('lesson'));
el('lesson-again')?.addEventListener('click', renderLesson);
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
