# Wordbook

Every word the course has introduced so far, one line each, with the card
that defines it. When you forget a word, look here first.

| Word | One line | Card |
| --- | --- | --- |
| `const` | gives a value a name; the name cannot get a new value later | 01 |
| object | values that belong together, each under its own name | 01 |
| the dot `.` | reads one named part back out | 01 |
| call | makes something happen; the brackets are what run it | 02 |
| execution order | calls run top to bottom | 02 |
| `function` | gives a list of calls one name | 03 |
| argument | a value you hand to a call | 03 |
| parameter | the name an argument arrives under inside the function | 03 |
| `return` | hands a value back to whoever called | 03 |
| boolean | a value that is only ever `true` or `false` | 04 |
| `===`, `<`, `>` | compare two values and hand back a boolean | 04 |
| `!` | flips a boolean: true becomes false, false becomes true | 04 |
| `if` | runs the block after it when its boolean is true | 04 |
| `else` | the block to run instead, when that boolean is false | 04 |
| `let` | gives a value a name that can get a new value later | 05 |
| reassignment | hands an existing name a new value with `=` | 05 |
| `+= 1` | adds one to what a name already holds | 05 |
| `for` | runs a block again and again; start, keep-going test, step | 06 |
| the block `{ }` | the lines a loop or `if` runs each time | 06 |
| recursion | a function that calls itself to do the rest | 06 |
| base case | the test that stops a recursion; `return` when nothing is left | 06 |
| `robot.wallAhead()` | a sensor: `true` when the next step lands on a wall, so a base case can read the room instead of counting | 06 |
| `+ 1`, `- 1` | make a new number without changing the old one | 06 |
| return type `: number` | a promise a function makes: it hands back a number | 07 |
| capture a value | keep what a function returns in a name, to spend later | 07 |
| return type `: boolean` | a promise a function makes: it hands back true or false | 08 |
| predicate | a function whose whole job is to hand back a boolean | 08 |
| `>=`, `<=` | compare two values: at least, at most | 08 |
| `/` | divides one number by another | 08 |
| `%` | the remainder after dividing; `i % 2` is 0 on every other number | 08 |
| `&&` | joins two tests; true only when both sides are true | 08 |
| nested loop | a loop written inside another loop's block | 09 |
| outer loop | the one on the outside; it goes round once per row | 09 |
| inner loop | the one inside; it runs all the way through every outer turn | 09 |
| `nextRow()` | a move: carries the robot to the first square of the row below | 09 |
| list | many values kept in order under one name | 10 |
| `number[]` | the type of a list of numbers | 10 |
| `for...of` | runs a block once per value in a list, handing you the value | 10 |
| move | robot calls under a name; written once, spent anywhere | 11 |
| `robot.turnLeft()` | turns the robot a quarter turn to the left | 11 |
| `*` | multiplies two numbers; `y * room.width` is y whole rows of squares | 12 |
