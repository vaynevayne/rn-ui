export function randomId() {
  return `@repo-${Math.random().toString(36).slice(2, 11)}`;
}
