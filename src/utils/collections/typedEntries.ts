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
