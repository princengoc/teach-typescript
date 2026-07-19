// A room is an object: two numbers under their own names. The part in the
// brackets says what the parameter has to hold.

// Task 1: how many squares does the floor have?
export function floorArea(room: { width: number; height: number }): number {
  return room.width * room.height;
}

// Task 2: painting the floor costs 2 a square. What does this room cost?
export function paintCost(room: { width: number; height: number }): number {
  return floorArea(room) * 2;
}
