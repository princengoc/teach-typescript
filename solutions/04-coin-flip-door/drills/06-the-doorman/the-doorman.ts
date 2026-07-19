// Task 1: no key, no entry.
export function staysOut(hasKey: boolean): boolean {
  return !hasKey;
}

// Task 2: an unlocked door lets anyone in; a locked one wants a key.
export function getsIn(hasKey: boolean, isLocked: boolean): boolean {
  if (isLocked) {
    return hasKey;
  } else {
    return true;
  }
}
