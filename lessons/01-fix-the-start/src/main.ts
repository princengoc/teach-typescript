import {
  atticDoorY,
  cellarDoorX,
  door,
  grid,
  kitchenDoorX,
  parkX,
  parkY,
  predictedDoorX,
  predictedDoorY,
  predictedWidth,
  startX,
  startY,
} from './exercise';
import exerciseSource from './exercise.ts?raw';
import {
  drawPark,
  drawRoom,
  drawScene,
  drawStill,
  replay,
} from './harness/render';
import {
  type Check,
  charger,
  checkDots,
  checkPark,
  checkPlacement,
  checkPredictions,
  parkRoom,
  type Tone,
} from './harness/steps';
import {
  builtInMoves,
  failStart,
  goalDoor,
  makeStartWorld,
  targetWorld,
} from './harness/task';
import { room } from './rooms';

type View = 'menu' | 'demo' | 'learn' | 'lesson';
const VIEWS: View[] = ['menu', 'demo', 'learn', 'lesson'];

const TONE_COLOR: Record<Tone, string> = {
  todo: '#c62828',
  progress: '#1565c0',
  done: '#2e7d32',
};

function el<T extends HTMLElement>(id: string): T | null {
  return document.querySelector<T>(`#${id}`);
}

// The lesson is one line of four parts. Each part names its own check and says
// what, if anything, to draw.
interface Part {
  id: string;
  check: () => Check;
  draw?: (canvas: HTMLCanvasElement, passed: boolean) => void;
}

const PARTS: Part[] = [
  {
    id: 'part-1',
    check: () =>
      checkPredictions({
        width: predictedWidth,
        doorX: predictedDoorX,
        doorY: predictedDoorY,
      }),
    // Drawn only once the kid has predicted: seeing it first is the answer.
    draw: (canvas, passed) => {
      canvas.hidden = !passed;
      if (passed) drawRoom(canvas, room);
    },
  },
  {
    id: 'part-2',
    check: () =>
      checkDots({ kitchenDoorX, atticDoorY, cellarDoorX }, exerciseSource),
  },
  {
    id: 'part-3',
    check: () => checkPark(parkX, parkY),
    draw: (canvas) =>
      drawPark(canvas, parkRoom, charger, { x: parkX, y: parkY }),
  },
  {
    id: 'part-4',
    check: () =>
      checkPlacement({
        grid,
        door,
        start: { x: startX, y: startY },
        goal: goalDoor,
      }),
    draw: (canvas) =>
      drawScene(canvas, {
        grid,
        door,
        start: { x: startX, y: startY },
        goal: goalDoor,
      }),
  },
];

let partIndex = 0;

function renderLesson(): void {
  const part = PARTS[partIndex];
  const canvas = el<HTMLCanvasElement>('lesson-canvas');
  const verdict = el('lesson-verdict');
  const next = el<HTMLButtonElement>('lesson-next');
  const back = el<HTMLButtonElement>('lesson-back');
  const counter = el('lesson-counter');
  const done = el('lesson-done');
  if (!part || !canvas || !verdict || !next || !back || !counter) return;

  for (const other of PARTS) {
    const block = el(other.id);
    if (block) block.hidden = other.id !== part.id;
  }

  const result = part.check();
  verdict.textContent = result.message;
  verdict.style.color = TONE_COLOR[result.tone];
  counter.textContent = `Part ${partIndex + 1} of ${PARTS.length}`;

  canvas.hidden = !part.draw;
  part.draw?.(canvas, result.pass);

  const last = partIndex === PARTS.length - 1;
  next.hidden = last;
  next.disabled = !result.pass;
  back.hidden = partIndex === 0;
  if (done) done.hidden = !(last && result.pass);
}

function goPart(index: number): void {
  partIndex = Math.min(Math.max(index, 0), PARTS.length - 1);
  location.hash = `lesson/${partIndex + 1}`;
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
  if (view === 'demo') {
    demoIndex = 0;
    renderDemo();
  }
}

// The hash carries the part number so a save, which reloads the page, lands
// the kid back on the part they were working on.
function readHash(): View {
  const [name, part] = location.hash.replace('#', '').split('/');
  if (name === 'lesson') {
    const parsed = Number(part);
    partIndex = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed - 1, 0), PARTS.length - 1)
      : 0;
    return 'lesson';
  }
  return VIEWS.includes(name as View) ? (name as View) : 'menu';
}

function go(view: View): void {
  location.hash = view;
}

window.addEventListener('hashchange', () => show(readHash()));

el('to-demo')?.addEventListener('click', () => go('demo'));
el('start-lesson')?.addEventListener('click', () => go('learn'));
el('to-build')?.addEventListener('click', () => goPart(0));
el('lesson-next')?.addEventListener('click', () => goPart(partIndex + 1));
el('lesson-back')?.addEventListener('click', () => goPart(partIndex - 1));
el('demo-next')?.addEventListener('click', advanceDemo);
for (const back of document.querySelectorAll<HTMLElement>('[data-go]')) {
  back.addEventListener('click', () => go('menu'));
}

show(readHash());
