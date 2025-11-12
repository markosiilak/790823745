const theme = {
  colorScheme: "light",
  colors: {
    background: "#f5f7fb",
    backgroundAlt: "#ffffff",
    foreground: "#1f2933",
    foregroundMuted: "#4a5a6a",
    accent: "#7b3fe4",
    accentInverted: "#ffffff",
    accentMuted: "rgba(123, 63, 228, 0.15)",
    accentStrong: "#5e26c9",
    border: "#d4dbe7",
    success: "#2d9d78",
    danger: "#d64545",
    dangerTint: "rgba(214, 69, 69, 0.1)",
    dangerBorder: "rgba(214, 69, 69, 0.25)",
    tableHeader: "#eef2ff",
    tableHeaderText: "#1f2933",
    tableCellBg: "#fbfcff",
    tableDivider: "#ecf0f6",
    weekGradientStart: "rgba(123, 63, 228, 0.16)",
    weekGradientEnd: "rgba(123, 63, 228, 0.32)",
    weekBorderActive: "rgba(123, 63, 228, 0.5)",
    accentBadge: "rgba(123, 63, 228, 0.12)",
    weekInset: "rgba(123, 63, 228, 0.28)",
  },
  shadows: {
    card: "0 12px 32px rgba(31, 41, 51, 0.12)",
    navHover: "0 6px 18px rgba(123, 63, 228, 0.18)",
    primaryHover: "0 8px 20px rgba(123, 63, 228, 0.28)",
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
    controlPadding: "0.65rem 1.6rem",
  },
  sizes: {
    weekCell: "62px",
  },
  typography: {
    kickerLetterSpacing: "0.08em",
    fontWeightBold: 600,
  },
  transitions: {
    primary: "transform 0.18s ease, box-shadow 0.18s ease",
  },
} as const;

export type AppTheme = typeof theme;

export { theme };

export default theme;


