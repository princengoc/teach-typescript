// This one is written for you, and it is right. Leave it alone.
export function isOpen(gap: number): boolean {
  return gap > 0;
}

// 1. This one promises a boolean and hands back the gap itself.
export function isWide(gap: number): boolean {
  return gap > 0;
}

// 2. This one hands back an answer when the gap is big, and nothing at all
// when it is not.
export function isBig(gap: number): boolean {
  if (gap > 10) {
    return true;
  } else {
    return false;
  }
}

// 3. This one compares the gap with the word '2' instead of the number 2.
export function isTwo(gap: number): boolean {
  return gap === 2;
}
