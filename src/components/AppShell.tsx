'use client';

import { PropsWithChildren } from "react";
import { GlobalStyle, LayoutContainer } from "./styles";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>{children}</LayoutContainer>
    </>
  );
}
