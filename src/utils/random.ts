/**
 * Seedable random number generator utilities
 */

/**
 * Simple seedable RNG using mulberry32
 */
export class SeededRandom {
  private seed: number;

  /**
   * Constructs a SeededRandom with the given seed
   * @param seed - Seed number
   */
  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Get next random number between 0 and 1
   * @returns Random number between 0 and 1
   */
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Get random integer between min (inclusive) and max (exclusive)
   * @param min - Minimum integer (inclusive)
   * @param max - Maximum integer (exclusive)
   * @returns Random integer between min and max
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

/**
 * Get random item from array
 * @param items - Array of items
 * @returns Random item or null if array is empty
 */
export function getRandomItem<T>(items: T[]): T | null {
  if (items.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
