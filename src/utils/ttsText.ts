/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
