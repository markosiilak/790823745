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
    // Repeated border colors
    borderSubtle: "rgba(31, 41, 51, 0.08)",
    borderVerySubtle: "rgba(31, 41, 51, 0.06)",
    borderMedium: "rgba(31, 41, 51, 0.12)",
    // White overlays
    whiteOverlayLight: "rgba(255, 255, 255, 0.6)",
    whiteOverlayMedium: "rgba(255, 255, 255, 0.65)",
    whiteOverlayStrong: "rgba(255, 255, 255, 0.85)",
    whiteOverlayStronger: "rgba(255, 255, 255, 0.9)",
    whiteOverlayFull: "rgba(255, 255, 255, 1)",
    // Accent overlays
    accentOverlayLight: "rgba(123, 63, 228, 0.08)",
    accentOverlayMedium: "rgba(123, 63, 228, 0.2)",
    accentOverlayStrong: "rgba(123, 63, 228, 0.3)",
    // Overlay background
    overlayBg: "rgba(17, 24, 39, 0.35)",
  },
  shadows: {
    card: "0 12px 32px rgba(31, 41, 51, 0.12)",
    navHover: "0 6px 18px rgba(123, 63, 228, 0.18)",
    primaryHover: "0 8px 20px rgba(123, 63, 228, 0.28)",
    tooltip: "0 10px 24px rgba(31, 41, 51, 0.18)",
  },
  radii: {
    card: "12px",
    pill: "999px",
    input: "12px",
    tooltip: "8px",
    button: "100%",
    timelineCard: "8px",
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
    iconPadding: "0.5rem",
    tableCellPadding: "1rem",
    tableCellPaddingCompact: "0.65rem 0.75rem",
    iconButton: "1.2rem",
    // Repeated spacing values
    gapSmall: "0.35rem",
    gapMedium: "0.4rem",
    gapMediumLarge: "0.45rem",
    inputPadding: "0.65rem 0.85rem",
    inputPaddingLarge: "0.7rem 0.85rem",
    errorPadding: "0.75rem 1rem",
  },
  sizes: {
    weekCell: "90px",
    weekCellCompact: "46px",
  },
  typography: {
    kickerLetterSpacing: "0.08em",
    fontWeightBold: 600,
    // Repeated font sizes
    fontSizeSmall: "0.65rem",
    fontSizeMedium: "0.75rem",
    fontSizeMediumLarge: "0.85rem",
    fontSizeLarge: "0.9rem",
  },
  transitions: {
    primary: "transform 0.18s ease, box-shadow 0.18s ease",
    // Repeated transition durations
    fast: "0.15s ease",
    medium: "0.18s ease",
    slow: "0.2s ease",
  },
  tooltip: {
    background: "#1f1636",
    color: "#ffffff",
    padding: "0.35rem 0.6rem",
    offset: 12,
  },
  zIndex: {
    overlay: 50,
    sidebar: 10,
    header: 5,
    stickyHeader: 3,
    stickyBody: 1,
  },
} as const;

export type AppTheme = typeof theme;

export { theme };

export default theme;


