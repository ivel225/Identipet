export function unwrapList(payload) {
  return payload?.results ?? payload ?? [];
}

export function toSelectValue(value) {
  return value === null || value === undefined ? "" : String(value);
}
