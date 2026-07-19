// This one is written for you, and it is right. Leave it alone.
export function shelfSquares(length: number): number {
  return length * 3;
}

// 1. This one forgot to hand anything back.
export function twoShelves(): number {
  shelfSquares(2) + shelfSquares(2);
}

// 2. This one never tells shelfSquares how long the shelf is. It is 3 long.
export function oneShelf(): number {
  return shelfSquares();
}

// 3. This one promises a number and hands back words.
export function shelfName(length: number): number {
  return `a shelf of ${length}`;
}
