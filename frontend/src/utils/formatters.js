export function formatDate(value) {
  if (!value) {
    return "Not set";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function formatCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return "Not mapped";
  }
  return Number(value).toFixed(5);
}
