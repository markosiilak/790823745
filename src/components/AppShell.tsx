'use client';

import { PropsWithChildren } from "react";
import { createGlobalStyle, styled } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #f5f7fb;
    --background-alt: #ffffff;
    --foreground: #1f2933;
    --foreground-muted: #4a5a6a;
    --accent: #4361ee;
    --accent-muted: rgba(67, 97, 238, 0.15);
    --accent-strong: #3046c5;
    --border: #d4dbe7;
    --success: #2d9d78;
    --shadow: 0 12px 32px rgba(31, 41, 51, 0.12);
    color-scheme: light;
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
    background: var(--background);
  }

  body {
    color: var(--foreground);
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
    color: var(--foreground);
  }

  button {
    font-family: inherit;
  }
`;

const LayoutContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 3rem 1.5rem;
`;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>{children}</LayoutContainer>
    </>
  );
}


