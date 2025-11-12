import { ReactNode } from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

const Header = styled.header`
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

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Kicker = styled.p`
  font-size: 0.85rem;
  letter-spacing: ${({ theme }) => theme.typography.kickerLetterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentStrong};
  font-weight: 600;
  margin-bottom: 0.35rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.foregroundMuted};
  max-width: 46ch;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.controlGap};
  align-items: center;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const NavButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.65rem 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.navHover};
    transform: translateY(-1px);
  }
`;

type HeaderSectionProps = {
  label: string;
  subtitle: string;
  onPrevious: () => void;
  onNext: () => void;
  extraActions?: ReactNode;
};

export function HeaderSection({
  label,
  subtitle,
  onPrevious,
  onNext,
  extraActions,
}: HeaderSectionProps) {
  return (
    <Header>
      <TitleGroup>
        <Kicker>Quarterly Task Planner</Kicker>
        <h1>{label}</h1>
        <Subtitle>{subtitle}</Subtitle>
      </TitleGroup>

      <Controls>
        <NavButton type="button" onClick={onPrevious} aria-label="View previous quarter">
          ← Previous
        </NavButton>
        <NavButton type="button" onClick={onNext} aria-label="View next quarter">
          Next →
        </NavButton>
        {extraActions}
      </Controls>
    </Header>
  );
}


