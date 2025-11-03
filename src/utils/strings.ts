/**
 * Utility functions for string manipulation
 */

/**
 * Normalizes a string by removing accents and converting to lowercase
 * @param text - The input string
 * @returns The normalized string
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '');
}

/**
 * Strips accents from a string
 * @param text - The input string
 * @returns The string without accents
 */
export function stripAccents(text: string): string {
  return text.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '');
}

/**
 * Trims and converts to lowercase
 * @param text - The input string
 * @returns The cleaned string
 */
export function cleanInput(text: string): string {
  return text.trim().toLowerCase();
}
