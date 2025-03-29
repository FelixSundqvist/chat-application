export function uniqueArray<T>(array: T[]) {
  return [...new Set(array)];
}

export function arrayToRecord<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
): Record<string, T>;
export function arrayToRecord<T extends Record<string, unknown>, R>(
  array: T[],
  key: keyof T,
  mapFn: (item: T) => R,
): Record<string, R>;
/**
 * Converts an array of objects into a record (object) using a specified key from each object.
 * Optionally, a mapping function can be applied to transform each object.
 *
 * @param {T[]} array - The array of objects to be converted into a record.
 * @param {keyof T} key - The key to be used as the property name in the resulting record.
 * @param {(item: T) => R | T} [mapFn] - An optional function to transform each object before adding it to the record.
 * @return {Record<string, R | T>} A record object where the key is the value of the specified key from each object, and the value is either the object itself or the result of the mapping function.
 */
export function arrayToRecord<T extends Record<string, unknown>, R>(
  array: T[],
  key: keyof T,
  mapFn?: (item: T) => R | T,
): Record<string, R | T> {
  return array.reduce<Record<string, R | T>>((acc, item) => {
    const itemKey = item[key] as string;

    if (mapFn) {
      acc[itemKey] = mapFn(item);
    } else {
      acc[itemKey] = item;
    }

    return acc;
  }, {});
}
