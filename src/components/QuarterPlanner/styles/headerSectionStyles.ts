import styled from "styled-components";
import theme from "@/styles/theme";

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${theme.spacing.controlGap};
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.gapMedium};
`;

export const Kicker = styled.p`
  font-size: ${theme.typography.fontSizeMediumLarge};
  letter-spacing: ${theme.typography.kickerLetterSpacing};
  text-transform: uppercase;
  color: ${theme.colors.accentStrong};
  font-weight: 600;
  margin-bottom: ${theme.spacing.gapSmall};
`;

export const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  max-width: 46ch;
`;

export const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing.controlGap};
  align-items: center;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

export const NavButton = styled.button`
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.pill};
  padding: 0.65rem 1.2rem;
  font-weight: 500;
  color: ${theme.colors.foreground};
  cursor: pointer;
  transition: transform ${theme.transitions.medium}, border-color ${theme.transitions.medium}, box-shadow ${theme.transitions.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.gapMedium};

  &:hover {
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.navHover};
    transform: translateY(-1px);
  }
`;

