import assert from 'node:assert';

export function toArray<T>(source: T | T[]): T[] {
  return Array.isArray(source) ? source : [source];
}

export const MESSAGE_PREFIX = '[@egg/bullboard]:';

export function appAssert(value: unknown, message: string): asserts value {
  assert(value, `${MESSAGE_PREFIX} ${message}`);
}
