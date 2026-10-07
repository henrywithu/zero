/** Packages now use native module exports, so no bundle interop is necessary. */
export function c<T>(
  module: T,
  _mode?: number,
): {
  default: T;
} {
  return {
    default: module,
  };
}
