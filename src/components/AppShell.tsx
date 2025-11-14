'use client';

import { PropsWithChildren } from "react";
import { GlobalStyle, LayoutContainer } from "./styles";

/**
 * Application shell component that wraps the entire app.
 * Provides global styles and layout container for consistent page structure.
 */
export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>{children}</LayoutContainer>
    </>
  );
}
