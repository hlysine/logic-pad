// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function isEventHandler<T>(val: unknown, event: string): val is T {
  if (typeof val !== 'object' || val === null || val === undefined)
    return false;
  return (
    event in val &&
    typeof (val as Record<string, unknown>)[event] === 'function'
  );
}
