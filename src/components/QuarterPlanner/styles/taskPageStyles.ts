import styled from "styled-components";
import theme from "@/styles/theme";

export const PageShell = styled.div`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.stackGap};
`;

export const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.controlGap};
`;

export const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  max-width: 46ch;
`;


