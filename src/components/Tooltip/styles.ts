import styled from "styled-components";
import theme from "@/styles/theme";

export const TooltipBubble = styled.div`
  position: absolute;
  background: ${theme.tooltip.background};
  color: ${theme.tooltip.color};
  padding: ${theme.tooltip.padding};
  border-radius: ${theme.radii.tooltip};
  box-shadow: ${theme.shadows.tooltip};
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
  z-index: 2000;
`;

