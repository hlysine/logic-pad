export function extractName(value: unknown) {
  if (
    (typeof value !== 'object' && typeof value !== 'function') ||
    value === null ||
    value === undefined
  )
    return undefined;
  if ('name' in value) return value.name as string;
  else if ('constructor' in value && 'name' in value.constructor)
    return value.constructor.name;
}

export function stripExtension(path: string) {
  return path.split('.').slice(0, -1).join('.');
}
