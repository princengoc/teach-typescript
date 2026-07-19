import cardSource from '../card.md?raw';
import { door, grid, startX, startY } from './exercise';
import { renderMarkdown } from './harness/markdown';
import { drawScene, drawStill, replay } from './harness/render';
import {
  builtInMoves,
  failStart,
  goalDoor,
  makeStartWorld,
  targetWorld,
} from './harness/task';

type View = 'menu' | 'demo' | 'learn' | 'lesson' | 'card';
const VIEWS: View[] = ['menu', 'demo', 'learn', 'lesson', 'card'];

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

function renderLesson(): void {
  const canvas = el<HTMLCanvasElement>('lesson-canvas');
  const verdict = el('lesson-verdict');
  const done = el('lesson-done');
  if (!canvas || !verdict) return;
  const solved = drawScene({
    canvas,
    verdict,
    grid,
    door,
    start: { x: startX, y: startY },
    goal: goalDoor,
  });
  if (done) done.hidden = !solved;
}

// The card is card.md itself, rendered. The file stays the one place its words
// live, so it can go on being the kid's reference.
function renderCard(): void {
  const body = el('card-body');
  if (body) body.innerHTML = renderMarkdown(cardSource);
}

// The demo is one path: still scene, then the success run, then a failed run.
type DemoStage = 'still' | 'success' | 'fail';
interface DemoStep {
  caption: string;
  stage: DemoStage;
  button: string;
}
const DEMO_STEPS: DemoStep[] = [
  {
    caption: 'This is the room: a grid, a door, and the robot on the door.',
    stage: 'still',
    button: 'Next',
  },
  {
    caption:
      'From the door, the robot follows its moves and paints the target.',
    stage: 'success',
    button: 'Next',
  },
  {
    caption:
      'A failed version: the robot starts in the wrong place, so it paints the wrong squares.',
    stage: 'fail',
    button: 'Start Lesson 1',
  },
];
let demoIndex = 0;

function renderDemo(): void {
  const step = DEMO_STEPS[demoIndex];
  const caption = el('demo-caption');
  const canvas = el<HTMLCanvasElement>('demo-canvas');
  const verdict = el('demo-verdict');
  const next = el('demo-next');
  if (!step || !caption || !canvas || !verdict || !next) return;
  caption.textContent = step.caption;
  next.textContent = step.button;
  if (step.stage === 'still') {
    verdict.textContent = '';
    drawStill(canvas, makeStartWorld(goalDoor.x, goalDoor.y), goalDoor);
    return;
  }
  const start = step.stage === 'success' ? goalDoor : failStart;
  replay({
    canvas,
    verdict,
    start: makeStartWorld(start.x, start.y),
    commands: builtInMoves,
    target: targetWorld,
    door: goalDoor,
  });
}

function advanceDemo(): void {
  if (demoIndex < DEMO_STEPS.length - 1) {
    demoIndex += 1;
    renderDemo();
  } else {
    go('learn');
  }
}

function show(view: View): void {
  for (const id of VIEWS) {
    const section = el(id);
    if (section) section.hidden = id !== view;
  }
  if (view === 'lesson') renderLesson();
  if (view === 'card') renderCard();
  if (view === 'demo') {
    demoIndex = 0;
    renderDemo();
  }
}

function currentView(): View {
  const hash = location.hash.replace('#', '') as View;
  return VIEWS.includes(hash) ? hash : 'menu';
}

function go(view: View): void {
  location.hash = view;
}

window.addEventListener('hashchange', () => show(currentView()));

el('to-demo')?.addEventListener('click', () => go('demo'));
el('start-lesson')?.addEventListener('click', () => go('learn'));
el('to-build')?.addEventListener('click', () => go('lesson'));
el('demo-next')?.addEventListener('click', advanceDemo);
el('to-card')?.addEventListener('click', () => go('card'));
for (const link of document.querySelectorAll<HTMLElement>(
  '[data-back-lesson]',
)) {
  link.addEventListener('click', () => go('lesson'));
}
for (const back of document.querySelectorAll<HTMLElement>('[data-go]')) {
  back.addEventListener('click', () => go('menu'));
}

show(currentView());
