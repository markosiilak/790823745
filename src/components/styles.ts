import { createGlobalStyle, styled } from "styled-components";
import theme from "@/styles/theme";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: ${theme.colorScheme};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    background: ${theme.colors.background};
  }

  body {
    color: ${theme.colors.foreground};
    font-family: var(--font-geist-sans, "Inter", "Segoe UI", -apple-system, sans-serif);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    color: ${theme.colors.foreground};
  }

  button {
    font-family: inherit;
  }
`;

export const LayoutContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.pagePaddingY} ${theme.spacing.pagePaddingX};
`;

