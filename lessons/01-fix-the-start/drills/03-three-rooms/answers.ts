import { attic, cellar, kitchen } from './rooms';

// Each line reads from the right room but the wrong place. Fix the dots.
export const kitchenDoorX = kitchen.door.y;
export const atticDoorY = attic.door.x;
export const cellarDoorX = cellar.door.y;
