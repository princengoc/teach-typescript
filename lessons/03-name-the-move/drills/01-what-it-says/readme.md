# 01: what it says

Three functions, and one of them calls another. Work out what each one hands
back before you run anything.

1. Write the number `twice(4)` hands back into `answer1`.
2. Write the number `bigger(3)` hands back into `answer2`.
3. Write the number `add(twice(2), bigger(0))` hands back into `answer3`.

Write numbers, not calls. `export const answer1 = twice(4);` would pass the
test and teach you nothing.

Only task 1 runs at first. Delete the `.skip` on the next test when it passes.
