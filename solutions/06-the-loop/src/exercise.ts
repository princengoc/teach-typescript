import { paintBar, paintSide, stepToNextBar } from './harness/moves';
import { robot } from './harness/robot';

export function paintSquare(): void {
  const side = robot.squareSide();
  for (let i = 0; i < 4; i += 1) {
    paintSide(side);
  }
}

export function paintRectangle(): void {
  const width = robot.rectWidth();
  const height = robot.rectHeight();
  for (let i = 0; i < 2; i += 1) {
    paintSide(width);
    paintSide(height);
  }
}

export function paintStaircaseLoop(): void {
  const barCount = robot.barCount();
  let height = 1;
  for (let i = 0; i < barCount; i += 1) {
    paintBar(height);
    stepToNextBar();
    height += 1;
  }
}

function climb(height: number, barsLeft: number): void {
  if (barsLeft === 0) return;
  paintBar(height);
  stepToNextBar();
  climb(height + 1, barsLeft - 1);
}

export function paintStaircaseRec(): void {
  climb(1, robot.barCount());
}

function paintLine(): void {
  robot.paint();
  if (robot.wallAhead()) return;
  robot.walk(1);
  paintLine();
}

export function paintSquareBlind(): void {
  for (let i = 0; i < 4; i += 1) {
    paintLine();
    robot.turnRight();
  }
}
