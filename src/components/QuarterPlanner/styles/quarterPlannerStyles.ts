import styled from "styled-components";
import theme from "@/styles/theme";

export const PlannerShell = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sectionGap};
`;

export const AddTaskButton = styled.button`
  border-radius: ${theme.radii.pill};
  border: none;
  background: ${theme.colors.accent};
  padding: ${theme.spacing.controlPadding};
  font-weight: ${theme.typography.fontWeightBold};
  transition: ${theme.transitions.primary};
  color: ${theme.colors.accentInverted};
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryHover};
  }
`;

