import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in. The box is the picture: every rung walks all of
// it and paints the squares its rule picks out.
export interface Variant {
  label: string;
  room: Room;
  target: Cell[];
}

const EMPTY: Room = {
  width: 0,
  height: 0,
  midX: 0,
  midY: 0,
  reach: 0,
  marks: [],
};

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

export function toRoom(variant: Variant): Room {
  return { ...variant.room, marks: [...variant.room.marks] };
}

function start(): { x: number; y: number; facing: Direction } {
  return { x: 0, y: 0, facing: 'east' };
}

// The squares of a room, in reading order: the order the walk visits them.
function cells(room: Room): Cell[] {
  const out: Cell[] = [];
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      out.push({ x, y });
    }
  }
  return out;
}

// The rules the kid writes, written once here so the judge and the kid are
// asking the same question of the same room.
export function cellNumberOf(x: number, y: number, room: Room): number {
  return y * room.width + x;
}

function gapOf(a: number, b: number): number {
  return a > b ? a - b : b - a;
}

export function nearOf(x: number, y: number, room: Room): boolean {
  return gapOf(x, room.midX) + gapOf(y, room.midY) <= room.reach;
}

export function wantedOf(x: number, y: number, room: Room): boolean {
  for (const mark of room.marks) {
    if (mark === cellNumberOf(x, y, room)) return true;
  }
  return false;
}

function pick(room: Room, rule: (x: number, y: number, room: Room) => boolean) {
  return cells(room).filter((cell) => rule(cell.x, cell.y, room));
}

// RUNG 1. The whole box, every square of it.
export function boxVariant(width: number, height: number): Variant {
  const room: Room = { ...EMPTY, width, height };
  return {
    label: `${width} by ${height}`,
    room,
    target: cells(room),
  };
}

// RUNG 2. A diamond: every square within `reach` of the middle one.
export function diamondVariant(
  width: number,
  height: number,
  midX: number,
  midY: number,
  reach: number,
): Variant {
  const room: Room = { ...EMPTY, width, height, midX, midY, reach };
  return {
    label: `${width} by ${height}, middle ${midX},${midY}, reach ${reach}`,
    room,
    target: pick(room, nearOf),
  };
}

// RUNG 3. A picture: the squares whose numbers are on the room's list.
export function pictureVariant(
  label: string,
  width: number,
  height: number,
  marks: number[],
): Variant {
  const room: Room = { ...EMPTY, width, height, marks };
  return {
    label: `${label}, ${width} by ${height}`,
    room,
    target: pick(room, wantedOf),
  };
}

// A picture, drawn where a person can read it. `#` is a square the room wants
// painted; the list of square numbers falls out of the drawing.
export function drawnVariant(label: string, art: string): Variant {
  const rows = art.split('\n').filter((row) => row.length > 0);
  const width = rows[0]?.length ?? 0;
  const marks: number[] = [];
  rows.forEach((row, y) => {
    [...row].forEach((mark, x) => {
      if (mark === '#') marks.push(y * width + x);
    });
  });
  return pictureVariant(label, width, rows.length, marks);
}

const PLUS = ['.#.', '###', '.#.'].join('\n');

const HEART = [
  '.##.##.',
  '#######',
  '#######',
  '.#####.',
  '..###..',
  '...#...',
].join('\n');

// Two fixed rooms a rung, so a number typed into the code fits one and misses
// the other, and a surprise room each run misses both.
export const boxVariants: Variant[] = [boxVariant(4, 3), boxVariant(6, 2)];
export const diamondVariants: Variant[] = [
  diamondVariant(5, 5, 2, 2, 2),
  diamondVariant(7, 4, 4, 1, 3),
];
export const pictureVariants: Variant[] = [
  drawnVariant('the plus', PLUS),
  drawnVariant('the heart', HEART),
];

function randomInt(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

export function randomBoxVariant(): Variant {
  return boxVariant(randomInt(3, 4), randomInt(2, 3));
}

export function randomDiamondVariant(): Variant {
  const width = randomInt(5, 4);
  const height = randomInt(4, 3);
  return diamondVariant(
    width,
    height,
    randomInt(1, width - 2),
    randomInt(1, height - 2),
    randomInt(1, 3),
  );
}

// A scatter, never empty and never the whole box: code that paints everything
// or nothing has nowhere to hide.
export function randomPictureVariant(): Variant {
  const width = randomInt(4, 3);
  const height = randomInt(3, 3);
  const marks: number[] = [];
  for (let i = 0; i < width * height; i += 1) {
    if (Math.random() < 0.5) marks.push(i);
  }
  if (marks.length === 0) marks.push(0);
  if (marks.length === width * height) marks.pop();
  return pictureVariant('a surprise', width, height, marks);
}

export function startWorld(variant: Variant): World {
  return makeWorld(variant.room.width, variant.room.height, start());
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

const PASS: Verdict = { solved: true, message: 'PASS.', tone: 'done' };

const RUNAWAY =
  'The robot never stopped. Does every loop of yours have an end?';

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
  const extra = got.length - right.length;
  if (right.length === wanted.length && extra === 0) return PASS;
  if (extra > 0) {
    return fail(
      `${right.length} of ${wanted.length} squares are right, and ${extra} should not be painted at all.`,
      'progress',
    );
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

// The rules are graded on their own as well as in the picture: a rule is an
// answer about one square, and it has to be right about every square.
export function checkGap(gap: (a: number, b: number) => number): Verdict {
  const pairs: [number, number, number][] = [
    [2, 5, 3],
    [5, 2, 3],
    [4, 4, 0],
    [0, 3, 3],
  ];
  const wrong = pairs.find(([a, b, want]) => gap(a, b) !== want);
  if (!wrong) return PASS;
  const [a, b, want] = wrong;
  return fail(`gap(${a}, ${b}) gave ${gap(a, b)}, not ${want}.`, 'progress');
}

const NUMBERED = pictureVariant('numbering', 4, 4, []).room;

export function checkCellNumber(
  cellNumber: (x: number, y: number, room: Room) => number,
): Verdict {
  const wrong = cells(NUMBERED).find(
    (cell) =>
      cellNumber(cell.x, cell.y, NUMBERED) !==
      cellNumberOf(cell.x, cell.y, NUMBERED),
  );
  if (!wrong) return PASS;
  return fail(
    `in a 4 wide room, the square at ${wrong.x},${wrong.y} is number ${cellNumberOf(
      wrong.x,
      wrong.y,
      NUMBERED,
    )}, and you called it ${cellNumber(wrong.x, wrong.y, NUMBERED)}.`,
    'progress',
  );
}

export function checkRule(
  rule: (x: number, y: number, room: Room) => boolean,
  variants: Variant[],
): Verdict {
  for (const variant of variants) {
    const room = toRoom(variant);
    const wanted = new Set(variant.target.map(key));
    const wrong = cells(room).find(
      (cell) => rule(cell.x, cell.y, room) !== wanted.has(key(cell)),
    );
    if (wrong) {
      return fail(
        `${variant.label}: the square at ${wrong.x},${wrong.y} should be ${
          wanted.has(key(wrong)) ? 'yes' : 'no'
        }, and your rule says ${wanted.has(key(wrong)) ? 'no' : 'yes'}.`,
        'progress',
      );
    }
  }
  return PASS;
}
