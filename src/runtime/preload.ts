/** Native dynamic imports replace the production bundler's preload wrapper. */
export function zT<T>(
  load: () => Promise<T>,
  _dependencies: string[] = [],
): Promise<T> {
  return load();
}
