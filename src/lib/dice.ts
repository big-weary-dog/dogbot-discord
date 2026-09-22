import { randomInt } from 'node:crypto';

/** Rolls a fair die, returning a whole number from 1 to `sides`. */
export function rollDie(sides: number): number {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new RangeError(`A die needs a whole number of sides, at least 2 (got ${sides})`);
  }
  return randomInt(1, sides + 1);
}
