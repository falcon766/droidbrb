// Design System Constants — matches docs/DESIGN-SYSTEM.md exactly
export const C = {
  black: "#111111",
  dark: "#1A1A1A",
  gray900: "#222222",
  gray700: "#444444",
  gray500: "#777777",
  gray400: "#999999",
  gray300: "#BBBBBB",
  gray200: "#DDDDDD",
  gray100: "#EEEEEE",
  gray50: "#F5F5F3",
  white: "#FAFAF8",
  pureWhite: "#FFFFFF",
  blue: "#2563EB",
  blueHover: "#1D4FD7",
  blueMuted: "rgba(37,99,235,0.08)",
} as const;

// Reusable style fragments
export const typography = {
  heroH1: {
    fontSize: "clamp(44px, 5.5vw, 72px)",
    fontWeight: 400,
    letterSpacing: "-0.03em",
    lineHeight: 1.08,
  },
  sectionH2: {
    fontSize: "clamp(30px, 3.5vw, 44px)",
    fontWeight: 400,
    letterSpacing: "-0.025em",
    lineHeight: 1.15,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: C.gray400,
    marginBottom: 24,
  },
  navItem: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.75,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.7,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.65,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  cardDetail: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.55,
  },
  caption: {
    fontSize: 13,
    fontWeight: 400,
  },
  micro: {
    fontSize: 12,
    fontWeight: 500,
  },
} as const;

export const pillButton = {
  base: {
    padding: "12px 28px",
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.25s",
    fontFamily: "inherit",
    border: "none",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filled: {
    background: C.blue,
    color: C.pureWhite,
    border: `1.5px solid ${C.blue}`,
  },
  filledHover: {
    background: C.blueHover,
    border: `1.5px solid ${C.blueHover}`,
  },
  outline: {
    background: "transparent",
    color: C.gray700,
    border: `1.5px solid ${C.gray200}`,
  },
  outlineHover: {
    background: C.gray50,
  },
  outlineDark: {
    background: "transparent",
    color: C.gray300,
    border: "1.5px solid rgba(255,255,255,0.2)",
  },
  outlineDarkHover: {
    background: "rgba(255,255,255,0.06)",
  },
} as const;

export const pillInput = {
  width: "100%",
  padding: "14px 20px",
  background: "transparent",
  border: `1.5px solid ${C.gray200}`,
  borderRadius: 100,
  fontSize: 15,
  fontFamily: "inherit",
  fontWeight: 400,
  color: C.black,
  outline: "none",
  transition: "border 0.3s",
} as const;
