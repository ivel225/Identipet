export function formatDate(value) {
  if (!value) {
    return "Not set";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
