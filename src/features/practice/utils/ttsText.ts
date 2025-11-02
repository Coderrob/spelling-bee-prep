/**
 * Text pre-processing utilities for TTS
 */

/**
 * Prepares text for TTS by handling special characters and formatting
 */
export function prepareTtsText(text: string): string {
  return text
    .replace(/[.,!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Adds pauses for better TTS clarity
 */
export function addPauses(text: string, pauseSymbol = ','): string {
  return text.split(' ').join(`${pauseSymbol} `);
}
