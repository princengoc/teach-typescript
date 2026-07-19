// The one file you edit. The preview on the right says what each part wants.
// Save after every change and watch it.
import { attic, cellar, kitchen } from './rooms';

// Part 1: say what you see. Read rooms.ts, then write your predictions.
export const predictedWidth = 0;
export const predictedDoorX = 0;
export const predictedDoorY = 0;

// Part 2: read with dots. Each line reads the right room, the wrong part.
export const kitchenDoorX = kitchen.door.y;
export const atticDoorY = attic.door.x;
export const cellarDoorX = cellar.door.y;

// Part 3: park the robot on the charger.
export const parkX = 0;
export const parkY = 0;

// Part 4: build the room.
export const grid = { width: 8, height: 6 };
export const door = { x: 0, y: 0 };
export const startX = 0;
export const startY = 0;
