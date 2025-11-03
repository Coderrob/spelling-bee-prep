/**
 * Text pre-processing utilities for TTS
 */

/**
 * Prepares text for TTS by handling special characters and formatting
 * @param text - The input text to prepare
 * @returns The prepared text suitable for TTS
 */
export function prepareTtsText(text: string): string {
  return text
    .replaceAll(/[.,!?;:]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * Adds pauses for better TTS clarity
 * @param text - The input text
 * @param pauseSymbol - The symbol to use for pauses (default is comma)
 * @returns The text with added pauses
 */
export function addPauses(text: string, pauseSymbol = ','): string {
  return text.split(' ').join(`${pauseSymbol} `);
}
