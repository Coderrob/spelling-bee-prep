/**
 * Type guard utilities for common type checks
 */

/**
 * Checks if a value is an Error instance
 * @param value - The value to check
 * @returns true if value is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Checks if a value is a string
 * @param value - The value to check
 * @returns true if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number
 * @param value - The value to check
 * @returns true if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Checks if a value is a boolean
 * @param value - The value to check
 * @returns true if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a function
 * @param value - The value to check
 * @returns true if value is a function
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Checks if a value is an object (and not null)
 * @param value - The value to check
 * @returns true if value is an object
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks if a value is null
 * @param value - The value to check
 * @returns true if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is undefined
 * @param value - The value to check
 * @returns true if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if a value is null or undefined
 * @param value - The value to check
 * @returns true if value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is defined (not null or undefined)
 * @param value - The value to check
 * @returns true if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Checks if a string is empty (null, undefined, or only whitespace)
 * @param value - The string to check
 * @returns true if the string is empty or only whitespace
 */
export function isEmptyString(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Checks if a string has content (not empty and not only whitespace)
 * @param value - The string to check
 * @returns true if the string has content
 */
export function hasContent(value: string | null | undefined): value is string {
  return !!value && value.trim().length > 0;
}

/**
 * Checks if an array is empty or undefined
 * @param value - The array to check
 * @returns true if the array is empty or undefined
 */
export function isEmptyArray<T>(value: T[] | null | undefined): boolean {
  return !value || value.length === 0;
}

/**
 * Checks if an array has elements
 * @param value - The array to check
 * @returns true if the array has elements
 */
export function hasElements<T>(value: T[] | null | undefined): value is T[] {
  return !!value && value.length > 0;
}
