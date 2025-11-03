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
