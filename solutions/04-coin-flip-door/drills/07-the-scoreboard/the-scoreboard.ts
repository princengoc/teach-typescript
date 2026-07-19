// Task 1: my score is the bigger one.
export function isWin(mine: number, theirs: number): boolean {
  return mine > theirs;
}

// Task 2: the two scores are the same.
export function isDraw(mine: number, theirs: number): boolean {
  return mine === theirs;
}

// Task 3: 'win', 'draw' or 'lose'. Use the two functions above.
export function result(mine: number, theirs: number): string {
  if (isWin(mine, theirs)) {
    return 'win';
  } else {
    if (isDraw(mine, theirs)) {
      return 'draw';
    } else {
      return 'lose';
    }
  }
}
