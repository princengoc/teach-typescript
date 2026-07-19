import type { Cell, Command, World } from './types';
import { step } from './world';

const CELL = 44;
const MARGIN = 10;

function drawCells(
  ctx: CanvasRenderingContext2D,
  world: World,
  target: World,
  cell: number,
): void {
  for (let y = 0; y < world.height; y += 1) {
    for (let x = 0; x < world.width; x += 1) {
      const px = MARGIN + x * cell;
      const py = MARGIN + y * cell;
      if (world.painted[y]?.[x]) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(px, py, cell, cell);
      } else if (target.painted[y]?.[x]) {
        ctx.strokeStyle = '#9e9e9e';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(px + 4, py + 4, cell - 8, cell - 8);
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = '#cfd8dc';
      ctx.strokeRect(px, py, cell, cell);
    }
  }
}

function drawDoor(
  ctx: CanvasRenderingContext2D,
  door: Cell,
  cell: number,
): void {
  const px = MARGIN + door.x * cell;
  const py = MARGIN + door.y * cell;
  ctx.strokeStyle = '#1565c0';
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 2, py + 2, cell - 4, cell - 4);
  ctx.lineWidth = 1;
}

function drawRobot(
  ctx: CanvasRenderingContext2D,
  world: World,
  cell: number,
): void {
  const { x, y, facing } = world.robot;
  const cx = MARGIN + x * cell + cell / 2;
  const cy = MARGIN + y * cell + cell / 2;
  const r = cell / 3;
  const points: Record<string, [number, number][]> = {
    north: [
      [cx, cy - r],
      [cx - r, cy + r],
      [cx + r, cy + r],
    ],
    south: [
      [cx, cy + r],
      [cx - r, cy - r],
      [cx + r, cy - r],
    ],
    east: [
      [cx + r, cy],
      [cx - r, cy - r],
      [cx - r, cy + r],
    ],
    west: [
      [cx - r, cy],
      [cx + r, cy - r],
      [cx + r, cy + r],
    ],
  };
  const triangle = points[facing];
  if (!triangle) return;
  const [first, ...rest] = triangle;
  if (!first) return;
  ctx.fillStyle = world.crashed ? '#d32f2f' : '#37474f';
  ctx.beginPath();
  ctx.moveTo(first[0], first[1]);
  for (const [px, py] of rest) {
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export interface FrameOptions {
  canvas: HTMLCanvasElement;
  world: World;
  target: World;
  door: Cell;
  cell?: number;
}

// One still frame: ghost target, painted cells, door, robot.
export function drawWorld(options: FrameOptions): void {
  const { canvas, world, target, door } = options;
  const cell = options.cell ?? CELL;
  canvas.width = MARGIN * 2 + world.width * cell;
  canvas.height = MARGIN * 2 + world.height * cell;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCells(ctx, world, target, cell);
  drawDoor(ctx, door, cell);
  drawRobot(ctx, world, cell);
}

export interface ReplayOptions {
  canvas: HTMLCanvasElement;
  start: World;
  commands: Command[];
  target: World;
  door: Cell;
  frameMs?: number;
  onFrame?: (index: number) => void;
  onFinish?: (final: World) => void;
}

// Replays the recorded commands one at a time, then hands the final world to
// the caller, which asks the judge for a verdict.
export function replay(options: ReplayOptions): () => void {
  const { canvas, start, commands, target, door } = options;
  const frameMs = options.frameMs ?? 320;
  const worlds: World[] = [start];
  let current = start;
  for (const command of commands) {
    current = step(current, command);
    worlds.push(current);
  }

  let index = 0;
  let timer = 0;
  const tick = (): void => {
    const world = worlds[index];
    if (!world) return;
    drawWorld({ canvas, world, target, door });
    options.onFrame?.(index);
    if (index === worlds.length - 1 || world.crashed) {
      options.onFinish?.(world);
      return;
    }
    index += 1;
    timer = window.setTimeout(tick, frameMs);
  };
  tick();
  return () => window.clearTimeout(timer);
}
