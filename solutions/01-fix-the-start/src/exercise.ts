// The one file you edit. The preview on the right says what each part wants.
// Save after every change and watch it.
import { attic, cellar, kitchen } from './rooms';

// Part 1: say what you see. Read rooms.ts, then write your predictions.
export const predictedWidth = 8;
export const predictedDoorX = 2;
export const predictedDoorY = 4;

// Part 2: read with dots. Each line reads the right room, the wrong part.
export const kitchenDoorX = kitchen.door.x;
export const atticDoorY = attic.door.y;
export const cellarDoorX = cellar.door.x;

// Part 3: park the robot on the charger.
export const parkX = 7;
export const parkY = 5;

// Part 4: build the room.
export const grid = { width: 8, height: 6 };
export const door = { x: 2, y: 4 };
export const startX = 2;
export const startY = 4;
