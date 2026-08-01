import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in. `bars` is the chart: one number per row, the
// length of that row's bar. The box is as wide as the longest bar and as deep
// as the list is long, so the list alone decides the picture.
export interface Variant {
  label: string;
  bars: number[];
  min: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

// The room the kid's program is handed: the list and the tall-enough mark.
export function toRoom(variant: Variant): Room {
  return { bars: [...variant.bars], min: variant.min };
}

// The longest bar in the list, walked with for...of like everything else here.
export function widest(bars: number[]): number {
  let out = 0;
  for (const n of bars) {
    if (n > out) out = n;
  }
  return out;
}

// The squares a chart wants painted: row y is the y-th number in the list, and
// a bar the rule turns down leaves its row empty but still takes up the row.
function chartCells(bars: number[], wanted: (n: number) => boolean): Cell[] {
  const cells: Cell[] = [];
  let y = 0;
  for (const n of bars) {
    if (wanted(n)) {
      for (let x = 0; x < n; x += 1) {
        cells.push({ x, y });
      }
    }
    y += 1;
  }
  return cells;
}

function variant(
  bars: number[],
  min: number,
  wanted: (n: number) => boolean,
): Variant {
  return {
    label: `[${bars.join(', ')}]`,
    bars,
    min,
    start: { x: 0, y: 0, facing: 'east' },
    target: chartCells(bars, wanted),
  };
}

// RUNGS 1 and 2. Every number in the list gets its bar.
export function chartVariant(bars: number[], min: number): Variant {
  return variant(bars, min, () => true);
}

// RUNG 3. Only the bars that reach the mark are painted; the short ones keep
// their row and leave it empty.
export function tallVariant(bars: number[], min: number): Variant {
  return variant(bars, min, (n) => n >= min);
}

// Each rung is graded in two rooms whose lists differ in length and in numbers,
// so a list typed into the code fits one and misses the other.
export const chartVariants: Variant[] = [
  chartVariant([4, 2, 5, 3], 3),
  chartVariant([3, 6, 2], 2),
];
export const byHandVariants: Variant[] = [
  chartVariant([2, 5, 3], 2),
  chartVariant([6, 1, 4, 2], 4),
];
export const tallVariants: Variant[] = [
  tallVariant([4, 1, 5, 2], 4),
  tallVariant([2, 6, 3, 5, 1], 3),
];

function randomInt(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

function randomBars(count: number, min: number, span: number): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    bars.push(randomInt(min, span));
  }
  return bars;
}

// A surprise chart, a new list each run, to prove the loop reads room.bars.
export function randomChartVariant(): Variant {
  const bars = randomBars(randomInt(3, 3), 1, 6);
  return chartVariant(bars, randomInt(2, 3));
}

// The surprise chart for rung 3. One bar is the longest by construction and
// clears the mark, so the picture is never empty.
export function randomTallVariant(): Variant {
  const count = randomInt(3, 3);
  const longest = randomInt(5, 2);
  const at = randomInt(0, count);
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    bars.push(i === at ? longest : randomInt(1, longest - 1));
  }
  return tallVariant(bars, longest - 2);
}

export function startWorld(variant: Variant): World {
  return makeWorld(widest(variant.bars), variant.bars.length, {
    ...variant.start,
  });
}

// A world with the target already painted, for the ghost outline in the preview.
export function targetWorld(variant: Variant): World {
  const world = startWorld(variant);
  const wanted = new Set(variant.target.map(key));
  const painted = world.painted.map((row, y) =>
    row.map((_, x) => wanted.has(`${x},${y}`)),
  );
  return { ...world, painted };
}

export type Tone = 'todo' | 'progress' | 'done';

export interface Verdict {
  solved: boolean;
  message: string;
  tone: Tone;
}

// One judge for one room, called by both the test and the preview. It hands the
// program the room's list and grades the squares it paints.
export function judge(
  variant: Variant,
  program: (room: Room) => void,
): Verdict {
  const room = toRoom(variant);
  const { world } = runProgram(startWorld(variant), () => program(room));
  const wanted = variant.target.map(key);
  const got = paintedCells(world);

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked off the chart.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return { solved: false, message: 'Nothing painted yet.', tone: 'todo' };
  }

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return { solved: true, message: 'PASS.', tone: 'done' };
  }
  return {
    solved: false,
    message: `Not there yet: ${right.length} of ${wanted.length} squares are right.`,
    tone: 'progress',
  };
}

// A rung is done only when the same loop draws the chart in every room. A list
// typed into the code passes one room and fails the rest.
export function judgeRung(
  variants: Variant[],
  program: (room: Room) => void,
): Verdict {
  const failed = variants
    .map((variant) => ({ variant, verdict: judge(variant, program) }))
    .find((entry) => !entry.verdict.solved);
  if (!failed) {
    return { solved: true, message: 'PASS. Every room.', tone: 'done' };
  }
  return {
    ...failed.verdict,
    message: `${failed.variant.label}: ${failed.verdict.message}`,
  };
}
