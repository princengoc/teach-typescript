# Card 12: the finale

One walk, and one rule about each square. Change the rule, change the picture.

**Every square gets asked about. Only the yeses get painted.**

```ts
for (let y = 0; y < room.height; y += 1) {
  for (let x = 0; x < room.width; x += 1) {
    if (wanted(x, y, room)) {
      paint();
    }
    next();
  }
  nextRow();
}
```

**Number the squares the way you read a book. `*` multiplies.**

```ts
return y * room.width + x;
```

**A rule can stop the moment it finds its answer.**

```ts
for (const mark of room.marks) {
  if (mark === cellNumber(x, y, room)) return true;
}
return false;
```

## For Racket hands

A rule that hands back true or false is a predicate, and Racket ends their names
with a question mark for exactly the reason you felt here: it reads as a
question about one thing.
