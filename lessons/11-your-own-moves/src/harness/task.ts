import { type Run, runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in. The box is exactly as big as the picture needs,
// except on rung 1, where the lane is wider than the run: a move that paints one
// square too many has room to be wrong.
export interface Variant {
  label: string;
  room: Room;
  width: number;
  height: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
}

const EMPTY: Room = { run: 0, bars: [], bands: [], thick: 0 };

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

export function toRoom(variant: Variant): Room {
  return { ...variant.room };
}

// The longest number in a list, walked with for...of like everything else here.
export function widest(numbers: number[]): number {
  let out = 0;
  for (const n of numbers) {
    if (n > out) out = n;
  }
  return out;
}

function row(width: number, y: number): Cell[] {
  const cells: Cell[] = [];
  for (let x = 0; x < width; x += 1) {
    cells.push({ x, y });
  }
  return cells;
}

function start(): { x: number; y: number; facing: Direction } {
  return { x: 0, y: 0, facing: 'east' };
}

// RUNG 1. One run of n squares in a lane with room to spare.
export function runVariant(n: number, lane: number): Variant {
  return {
    label: `n = ${n}, lane ${lane} wide`,
    room: { ...EMPTY, run: n },
    width: lane,
    height: 1,
    start: start(),
    target: row(n, 0),
  };
}

// RUNG 2. One number is one bar: a row that many squares long.
export function chartVariant(bars: number[]): Variant {
  const cells: Cell[] = [];
  let y = 0;
  for (const n of bars) {
    cells.push(...row(n, y));
    y += 1;
  }
  return {
    label: `[${bars.join(', ')}]`,
    room: { ...EMPTY, bars },
    width: widest(bars),
    height: bars.length,
    start: start(),
    target: cells,
  };
}

// RUNG 3. The same chart, but every bar is `thick` rows deep instead of one.
export function bandsVariant(bands: number[], thick: number): Variant {
  const cells: Cell[] = [];
  let y = 0;
  for (const width of bands) {
    for (let i = 0; i < thick; i += 1) {
      cells.push(...row(width, y));
      y += 1;
    }
  }
  return {
    label: `[${bands.join(', ')}], ${thick} rows each`,
    room: { ...EMPTY, bands, thick },
    width: widest(bands),
    height: bands.length * thick,
    start: start(),
    target: cells,
  };
}

// Two fixed rooms a rung, so a number typed into the code fits one and misses
// the other. Rung 3's rooms are two and four rows deep, never the three the
// handed-over copy-paste version paints.
export const runVariants: Variant[] = [runVariant(4, 7), runVariant(2, 5)];
export const chartVariants: Variant[] = [
  chartVariant([3, 2]),
  chartVariant([4, 2, 5, 3]),
];
export const bandsVariants: Variant[] = [
  bandsVariant([4, 2], 2),
  bandsVariant([3, 5, 2], 4),
];

function randomInt(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

function randomList(count: number, min: number, span: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(randomInt(min, span));
  }
  return out;
}

export function randomRunVariant(): Variant {
  const n = randomInt(2, 5);
  return runVariant(n, n + randomInt(1, 3));
}

export function randomChartVariant(): Variant {
  return chartVariant(randomList(randomInt(2, 3), 1, 6));
}

// Never three rows deep: the handed-over copy-paste version paints exactly
// three, and a surprise room it happened to fit would flatter it.
export function randomBandsVariant(): Variant {
  const thick = randomInt(2, 4);
  return bandsVariant(
    randomList(randomInt(2, 2), 1, 6),
    thick === 3 ? 5 : thick,
  );
}

export function startWorld(variant: Variant): World {
  return makeWorld(variant.width, variant.height, { ...variant.start });
}

// A world with the target already painted, for the ghost outline in the preview.
export function targetWorld(variant: Variant): World {
  const world = startWorld(variant);
  const wanted = new Set(variant.target.map(key));
  const painted = world.painted.map((cells, y) =>
    cells.map((_, x) => wanted.has(`${x},${y}`)),
  );
  return { ...world, painted };
}

export type Tone = 'todo' | 'progress' | 'done';

export interface Verdict {
  solved: boolean;
  message: string;
  tone: Tone;
}

const PASS: Verdict = { solved: true, message: 'PASS.', tone: 'done' };

const RUNAWAY =
  'The robot never stopped. Does your recursion have a base case?';

function fail(message: string, tone: Tone = 'todo'): Verdict {
  return { solved: false, message, tone };
}

// One judge for one room, called by both the test and the preview.
export function judge(
  variant: Variant,
  program: (room: Room) => void,
): Verdict {
  const room = toRoom(variant);
  const { world, stopped } = runProgram(startWorld(variant), () =>
    program(room),
  );
  const wanted = variant.target.map(key);
  const got = paintedCells(world);

  if (stopped) return fail(RUNAWAY);
  if (world.crashed) return fail('The robot walked off the picture.');
  if (got.length === 0) return fail('Nothing painted yet.');

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return PASS;
  }
  return fail(
    `Not there yet: ${right.length} of ${wanted.length} squares are right.`,
    'progress',
  );
}

// A rung is done only when the same code draws the picture in every room.
export function judgeRung(
  variants: Variant[],
  program: (room: Room) => void,
): Verdict {
  const failed = variants
    .map((variant) => ({ variant, verdict: judge(variant, program) }))
    .find((entry) => !entry.verdict.solved);
  if (!failed) return { ...PASS, message: 'PASS. Every room.' };
  return {
    ...failed.verdict,
    message: `${failed.variant.label}: ${failed.verdict.message}`,
  };
}

// The moves the kid writes are graded on their own as well as in the picture:
// a move has to work when it is called by itself, or it is not a move.
export interface Landing {
  x: number;
  y: number;
  facing: Direction;
}

function where(run: Run, wanted: Landing, what: string): Verdict | undefined {
  const { world, stopped } = run;
  if (stopped) return fail(`${what}: ${RUNAWAY}`);
  if (world.crashed) return fail(`${what}: the robot walked into a wall.`);
  const { x, y, facing } = world.robot;
  if (x !== wanted.x || y !== wanted.y || facing !== wanted.facing) {
    return fail(
      `${what}: the robot ended at ${x},${y} facing ${facing}, not ${wanted.x},${wanted.y} facing ${wanted.facing}.`,
      'progress',
    );
  }
  return undefined;
}

export function checkBackToRowStart(move: () => void): Verdict {
  const fromMiddle = runProgram(
    makeWorld(5, 1, { x: 3, y: 0, facing: 'west' }),
    move,
  );
  const already = runProgram(
    makeWorld(5, 1, { x: 0, y: 0, facing: 'west' }),
    move,
  );
  return (
    where(fromMiddle, { x: 0, y: 0, facing: 'west' }, 'from the middle') ??
    where(already, { x: 0, y: 0, facing: 'west' }, 'already at the start') ??
    PASS
  );
}

export function checkNextRow(move: () => void): Verdict {
  const middle = runProgram(
    makeWorld(4, 3, { x: 2, y: 0, facing: 'east' }),
    move,
  );
  const bottom = runProgram(
    makeWorld(4, 3, { x: 2, y: 2, facing: 'east' }),
    move,
  );
  return (
    where(middle, { x: 0, y: 1, facing: 'east' }, 'from a middle row') ??
    where(bottom, { x: 0, y: 2, facing: 'east' }, 'from the bottom row') ??
    PASS
  );
}

export function checkPaintBand(
  move: (width: number, rows: number) => void,
): Verdict {
  const { world, stopped } = runProgram(makeWorld(5, 4, start()), () =>
    move(3, 2),
  );
  if (stopped) return fail(`paintBand: ${RUNAWAY}`);
  if (world.crashed) return fail('paintBand: the robot walked into a wall.');
  const wanted = [...row(3, 0), ...row(3, 1)].map(key).sort();
  const got = paintedCells(world);
  if (got.join(' ') !== wanted.join(' ')) {
    return fail(
      `paintBand(3, 2) painted ${got.length} squares, not the ${wanted.length} a band that size needs.`,
      got.length === 0 ? 'todo' : 'progress',
    );
  }
  return PASS;
}
