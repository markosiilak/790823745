import styled from "styled-components";

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
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
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-strong);
  font-weight: 600;
  margin-bottom: 0.35rem;
`;

const Subtitle = styled.p`
  color: var(--foreground-muted);
  max-width: 46ch;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const NavButton = styled.button`
  border: 1px solid var(--border);
  background: var(--background-alt);
  border-radius: 999px;
  padding: 0.65rem 1.2rem;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: var(--accent);
    box-shadow: 0 6px 18px rgba(67, 97, 238, 0.15);
    transform: translateY(-1px);
  }
`;

type HeaderSectionProps = {
  label: string;
  subtitle: string;
  onPrevious: () => void;
  onNext: () => void;
  extraActions?: React.ReactNode;
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


