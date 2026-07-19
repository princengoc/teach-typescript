// Task 1: a load of 4 or fewer gets through.
export function opens(load: number): boolean {
  return false;
}

// Task 2: on market day the gate stays shut whatever the load. Otherwise it
// behaves the way task 1 says. Call opens rather than writing the 4 again.
export function opensOn(load: number, marketDay: boolean): boolean {
  return false;
}

// Task 3: the word on the gate, for the same two answers.
export function sign(load: number, marketDay: boolean): string {
  return '';
}
