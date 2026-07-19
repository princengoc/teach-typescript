import { placementSolved } from './task';
import type { Command, World } from './types';
import { makeWorld, sameCells, step } from './world';

const CELL = 48;
const MARGIN = 12;
const MAX_DRAWN = 16;

interface Frame {
  world: World;
  commandsUsed: number;
}

function frames(start: World, commands: Command[]): Frame[] {
  const all: Frame[] = [{ world: start, commandsUsed: 0 }];
  let current = start;
  commands.forEach((command, index) => {
    current = step(current, command);
    all.push({ world: current, commandsUsed: index + 1 });
  });
  return all;
}

function drawCellBackground(
  ctx: CanvasRenderingContext2D,
  world: World,
  target: World,
): void {
  for (let y = 0; y < world.height; y += 1) {
    for (let x = 0; x < world.width; x += 1) {
      const px = MARGIN + x * CELL;
      const py = MARGIN + y * CELL;
      if (world.painted[y]?.[x]) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(px, py, CELL, CELL);
      }
      if (target.painted[y]?.[x] && !world.painted[y]?.[x]) {
        ctx.strokeStyle = '#9e9e9e';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(px + 4, py + 4, CELL - 8, CELL - 8);
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = '#cfd8dc';
      ctx.strokeRect(px, py, CELL, CELL);
    }
  }
}

function drawDoor(
  ctx: CanvasRenderingContext2D,
  door: { x: number; y: number },
): void {
  const px = MARGIN + door.x * CELL;
  const py = MARGIN + door.y * CELL;
  ctx.strokeStyle = '#1565c0';
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 2, py + 2, CELL - 4, CELL - 4);
  ctx.lineWidth = 1;
  ctx.fillStyle = '#1565c0';
  ctx.font = '10px sans-serif';
  ctx.fillText('door', px + 12, py + CELL - 6);
}

function drawRobot(ctx: CanvasRenderingContext2D, world: World): void {
  const { x, y, facing } = world.robot;
  const cx = MARGIN + x * CELL + CELL / 2;
  const cy = MARGIN + y * CELL + CELL / 2;
  const r = CELL / 3;
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
  ctx.fillStyle = world.crashed ? '#d32f2f' : '#37474f';
  ctx.beginPath();
  const [first, ...rest] = triangle;
  if (!first) return;
  ctx.moveTo(first[0], first[1]);
  for (const [px, py] of rest) {
    ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export interface ReplayOptions {
  canvas: HTMLCanvasElement;
  verdict: HTMLElement;
  start: World;
  commands: Command[];
  target: World;
  door: { x: number; y: number };
  frameMs?: number;
}

export function replay(options: ReplayOptions): void {
  const { canvas, verdict, start, commands, target, door } = options;
  const frameMs = options.frameMs ?? 350;
  canvas.width = MARGIN * 2 + start.width * CELL;
  canvas.height = MARGIN * 2 + start.height * CELL;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const all = frames(start, commands);
  let index = 0;

  const draw = (frame: Frame): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCellBackground(ctx, frame.world, target);
    drawDoor(ctx, door);
    drawRobot(ctx, frame.world);
  };

  const finish = (last: Frame): void => {
    const solved = !last.world.crashed && sameCells(last.world, target);
    verdict.textContent = solved
      ? 'PASS: the painted cells match the target'
      : last.world.crashed
        ? 'FAIL: the robot crashed into a wall'
        : 'FAIL: the painted cells do not match the target';
    verdict.style.color = solved ? '#2e7d32' : '#c62828';
  };

  const tick = (): void => {
    const frame = all[index];
    if (!frame) return;
    draw(frame);
    if (index === all.length - 1 || frame.world.crashed) {
      finish(frame);
      return;
    }
    index += 1;
    window.setTimeout(tick, frameMs);
  };

  verdict.textContent = 'running...';
  verdict.style.color = '#37474f';
  tick();
}

function drawEmptyGrid(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
): void {
  ctx.strokeStyle = '#cfd8dc';
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      ctx.strokeRect(MARGIN + x * CELL, MARGIN + y * CELL, CELL, CELL);
    }
  }
}

function drawGoalOutline(
  ctx: CanvasRenderingContext2D,
  goal: { x: number; y: number },
): void {
  const px = MARGIN + goal.x * CELL;
  const py = MARGIN + goal.y * CELL;
  ctx.strokeStyle = '#1565c0';
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 2;
  ctx.strokeRect(px + 4, py + 4, CELL - 8, CELL - 8);
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
}

function drawDoorSquare(
  ctx: CanvasRenderingContext2D,
  door: { x: number; y: number },
): void {
  const px = MARGIN + door.x * CELL;
  const py = MARGIN + door.y * CELL;
  ctx.fillStyle = '#bbdefb';
  ctx.fillRect(px + 3, py + 3, CELL - 6, CELL - 6);
  ctx.strokeStyle = '#1565c0';
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 3, py + 3, CELL - 6, CELL - 6);
  ctx.lineWidth = 1;
}

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  verdict: HTMLElement;
  grid: { width: number; height: number };
  door: { x: number; y: number };
  start: { x: number; y: number };
  goal: { x: number; y: number };
}

function sceneReason(o: SceneOptions): string {
  const { grid, door, start, goal } = o;
  if (grid.width < 1 || grid.height < 1) {
    return 'FAIL: give the room a width and a height of at least 1';
  }
  if (
    door.x < 0 ||
    door.x >= grid.width ||
    door.y < 0 ||
    door.y >= grid.height
  ) {
    return 'FAIL: make the room big enough to hold the door';
  }
  if (door.x !== goal.x || door.y !== goal.y) {
    return 'FAIL: move the door onto the dashed goal square';
  }
  if (start.x !== door.x || start.y !== door.y) {
    return 'FAIL: put the robot on the door';
  }
  return 'PASS: the door is on the goal and the robot is on the door';
}

export function drawScene(options: SceneOptions): void {
  const { canvas, verdict, grid, door, start, goal } = options;
  const cols = Math.min(Math.max(grid.width, 1), MAX_DRAWN);
  const rows = Math.min(Math.max(grid.height, 1), MAX_DRAWN);
  canvas.width = MARGIN * 2 + cols * CELL;
  canvas.height = MARGIN * 2 + rows * CELL;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEmptyGrid(ctx, cols, rows);
  drawGoalOutline(ctx, goal);
  drawDoorSquare(ctx, door);
  drawRobot(
    ctx,
    makeWorld(cols, rows, { x: start.x, y: start.y, facing: 'east' }),
  );

  const solved = placementSolved({ grid, door, start, goal });
  verdict.textContent = sceneReason(options);
  verdict.style.color = solved ? '#2e7d32' : '#c62828';
}
