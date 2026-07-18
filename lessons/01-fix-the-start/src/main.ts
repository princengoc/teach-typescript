import { startX, startY } from './exercise';
import { replay } from './harness/render';
import {
  builtInMoves,
  doorCell,
  makeStartWorld,
  targetWorld,
} from './harness/task';

function show(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#room');
  const verdict = document.querySelector<HTMLElement>('#verdict');
  if (!canvas || !verdict) return;
  replay({
    canvas,
    verdict,
    start: makeStartWorld(startX, startY),
    commands: builtInMoves,
    target: targetWorld,
    door: doorCell,
  });
}

document.querySelector('#again')?.addEventListener('click', show);
show();
