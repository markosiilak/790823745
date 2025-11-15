export const weekFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

export const dateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

