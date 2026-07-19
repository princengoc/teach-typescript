# 04: the toll gate

A gate on the way into the room, and a robot carrying a load.

1. `opens(load)` says whether the gate opens: it does for a load of 4 or
   fewer.
2. `opensOn(load, marketDay)` says the same thing, except that on market day
   the gate stays shut whatever the load. Call `opens` from inside it.
3. `sign(load, marketDay)` hands back the word on the gate: `'open'` or
   `'closed'`.
