export const NAME_COLUMN_WIDTH = 260;
export const DATE_COLUMN_WIDTH = 140;

export type ViewMode = "standard" | "compact" | "single-week";

export const weekFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

export const dateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

