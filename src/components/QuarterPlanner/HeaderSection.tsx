import { ReactNode } from "react";
import {
  Header,
  TitleGroup,
  Kicker,
  Subtitle,
  Controls,
  NavButton,
} from "./styles/headerSectionStyles";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

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
          <ChevronLeftIcon />
          Previous
        </NavButton>
        <NavButton type="button" onClick={onNext} aria-label="View next quarter">
          Next
          <ChevronRightIcon />
        </NavButton>
        {extraActions}
      </Controls>
    </Header>
  );
}


