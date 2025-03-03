export type Status<T = void> =
  | (T extends void ? { status: "success"; data?: T } : { status: "success"; data: T })
  | { status: "failed"; error: Error };
