const theme = {
  colorScheme: "light",
  colors: {
    background: "#f5f7fb",
    backgroundAlt: "#ffffff",
    foreground: "#1f2933",
    foregroundMuted: "#4a5a6a",
    accent: "#4361ee",
    accentMuted: "rgba(67, 97, 238, 0.15)",
    accentStrong: "#3046c5",
    border: "#d4dbe7",
    success: "#2d9d78",
    danger: "#d64545",
    dangerTint: "rgba(214, 69, 69, 0.1)",
    dangerBorder: "rgba(214, 69, 69, 0.25)",
    tableHeader: "#eef2ff",
    tableHeaderText: "#1f2933",
    tableCellBg: "#fbfcff",
    tableDivider: "#ecf0f6",
    weekGradientStart: "rgba(67, 97, 238, 0.12)",
    weekGradientEnd: "rgba(67, 97, 238, 0.28)",
    weekBorderActive: "rgba(67, 97, 238, 0.45)",
    accentBadge: "rgba(67, 97, 238, 0.08)",
    weekInset: "rgba(67, 97, 238, 0.25)",
  },
  shadows: {
    card: "0 12px 32px rgba(31, 41, 51, 0.12)",
    navHover: "0 6px 18px rgba(67, 97, 238, 0.15)",
    primaryHover: "0 8px 20px rgba(67, 97, 238, 0.25)",
  },
  radii: {
    card: "20px",
    pill: "999px",
    input: "12px",
  },
  spacing: {
    pagePaddingY: "3rem",
    pagePaddingX: "1.5rem",
    sectionGap: "2.5rem",
    controlGap: "0.75rem",
    formGap: "1.25rem",
    fieldGap: "0.45rem",
    stackGap: "2rem",
  },
  sizes: {
    weekCell: "62px",
  },
  typography: {
    kickerLetterSpacing: "0.08em",
  },
} as const;

export type AppTheme = typeof theme;

export { theme };

export default theme;


