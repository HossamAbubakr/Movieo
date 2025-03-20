function isNullOrUndefined(value: unknown): value is null | undefined {
  return value == null;
}

function isEmptyString(value: string): boolean {
  return !value.trim();
}

function isEmptyObject(value: object): boolean {
  return Object.keys(value).length === 0 && value.constructor === Object;
}

function isEmptyArray<T>(value: T[]): boolean {
  return value.length === 0;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value);
}

function isWithin(value: number, limit: number): boolean {
  return limit === 0 || value >= limit;
}

function isStringWithinLength(value: string, limit: number): boolean {
  return limit === 0 || value.length >= limit;
}

export function isInvalid(value: unknown, length = 0): boolean {
  if (isNullOrUndefined(value)) return true;

  if (typeof value === "string") return isEmptyString(value) || !isStringWithinLength(value, length);

  if (Array.isArray(value)) return isEmptyArray(value);

  if (typeof value === "object" && value !== null) return isEmptyObject(value);

  if (isValidNumber(value)) return !isWithin(value, length);

  return false;
}
