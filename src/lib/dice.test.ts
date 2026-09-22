import { describe, expect, it } from 'vitest';
import { rollDie } from './dice.js';

describe('rollDie', () => {
  it('always lands between 1 and the number of sides', () => {
    for (const sides of [2, 6, 20, 1000]) {
      for (let i = 0; i < 500; i++) {
        const result = rollDie(sides);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      }
    }
  });

  it('can land on every face', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) seen.add(rollDie(6));
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it.each([0, 1, -6, 2.5, Number.NaN])('rejects %s sides', (sides) => {
    expect(() => rollDie(sides)).toThrow(RangeError);
  });
});
