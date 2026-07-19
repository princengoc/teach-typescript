import type { Command, Direction, Robot, World } from './types';

const DELTA: Record<Direction, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
};

const LEFT: Record<Direction, Direction> = {
  north: 'west',
  west: 'south',
  south: 'east',
  east: 'north',
};

const RIGHT: Record<Direction, Direction> = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
};

const COMMAND_CAP = 500;

function grid(width: number, height: number): boolean[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false),
  );
}

export function makeWorld(width: number, height: number, robot: Robot): World {
  return {
    width,
    height,
    blocked: grid(width, height),
    painted: grid(width, height),
    robot,
    crashed: false,
  };
}

function cellOpen(world: World, x: number, y: number): boolean {
  if (x < 0 || x >= world.width || y < 0 || y >= world.height) return false;
  return !(world.blocked[y]?.[x] ?? true);
}

function paintCell(painted: boolean[][], x: number, y: number): boolean[][] {
  return painted.map((row, ry) =>
    ry === y ? row.map((cell, rx) => (rx === x ? true : cell)) : row,
  );
}

export function step(world: World, command: Command): World {
  if (world.crashed) return world;
  switch (command.kind) {
    case 'step': {
      const delta = DELTA[world.robot.facing];
      const x = world.robot.x + delta.dx;
      const y = world.robot.y + delta.dy;
      if (!cellOpen(world, x, y)) return { ...world, crashed: true };
      return { ...world, robot: { ...world.robot, x, y } };
    }
    case 'turn': {
      const table = command.hand === 'left' ? LEFT : RIGHT;
      const facing = table[world.robot.facing];
      return { ...world, robot: { ...world.robot, facing } };
    }
    case 'paint':
      return {
        ...world,
        painted: paintCell(world.painted, world.robot.x, world.robot.y),
      };
  }
}

export function run(world: World, commands: Command[]): World {
  let current = world;
  for (const command of commands.slice(0, COMMAND_CAP)) {
    current = step(current, command);
  }
  return current;
}

// The lesson's one sensor. Left of the robot is one turn anticlockwise from
// the way it faces; a square off the grid counts as a wall.
export function wallOnLeft(world: World): boolean {
  const facing = LEFT[world.robot.facing];
  const delta = DELTA[facing];
  return !cellOpen(world, world.robot.x + delta.dx, world.robot.y + delta.dy);
}

export function paintedCells(world: World): string[] {
  const cells: string[] = [];
  world.painted.forEach((row, y) => {
    row.forEach((painted, x) => {
      if (painted) cells.push(`${x},${y}`);
    });
  });
  return cells.sort();
}

export function sameCells(a: World, b: World): boolean {
  return paintedCells(a).join(' ') === paintedCells(b).join(' ');
}
