import { door, grid, startX, startY } from './exercise';
import { drawScene, replay } from './harness/render';
import {
  builtInMoves,
  failStart,
  goalDoor,
  makeStartWorld,
  targetWorld,
} from './harness/task';

type View = 'menu' | 'demo' | 'lesson';
const VIEWS: View[] = ['menu', 'demo', 'lesson'];

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

function renderLesson(): void {
  const canvas = el<HTMLCanvasElement>('lesson-canvas');
  const verdict = el('lesson-verdict');
  if (!canvas || !verdict) return;
  drawScene({
    canvas,
    verdict,
    grid,
    door,
    start: { x: startX, y: startY },
    goal: goalDoor,
  });
}

function playDemo(start: { x: number; y: number }): void {
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const verdict = el('demo-verdict');
  if (!canvas || !verdict) return;
  replay({
    canvas,
    verdict,
    start: makeStartWorld(start.x, start.y),
    commands: builtInMoves,
    target: targetWorld,
    door: goalDoor,
  });
}

function show(view: View): void {
  for (const id of VIEWS) {
    const section = el(id);
    if (section) section.hidden = id !== view;
  }
  if (view === 'lesson') renderLesson();
}

function currentView(): View {
  const hash = location.hash.replace('#', '');
  return hash === 'demo' || hash === 'lesson' ? hash : 'menu';
}

function go(view: View): void {
  location.hash = view;
}

window.addEventListener('hashchange', () => show(currentView()));

el('to-demo')?.addEventListener('click', () => go('demo'));
el('to-lesson')?.addEventListener('click', () => go('lesson'));
for (const back of document.querySelectorAll<HTMLElement>('[data-go]')) {
  back.addEventListener('click', () => go('menu'));
}
el('demo-play')?.addEventListener('click', () => playDemo(goalDoor));
el('demo-fail')?.addEventListener('click', () => playDemo(failStart));

show(currentView());
