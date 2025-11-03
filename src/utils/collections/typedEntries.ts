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
 * Typed utilities for working with object entries.
 */
export type Entry<T extends Record<PropertyKey, unknown>> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

/**
 * Returns strongly typed entries for the provided record.
 *
 * @param record - Source record
 * @returns Tuple entries preserving key/value types
 */
export function typedEntries<T extends Record<PropertyKey, unknown>>(record: T): Array<Entry<T>> {
  return Object.entries(record) as Array<Entry<T>>;
}
