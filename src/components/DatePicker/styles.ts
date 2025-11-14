import styled from "styled-components";
import theme from "@/styles/theme";

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const TriggerButton = styled.button`
  width: 100%;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.input};
  padding: 0.7rem 0.85rem;
  font: inherit;
  color: ${theme.colors.foreground};
  background: ${theme.colors.tableCellBg};
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 4px ${theme.colors.accentMuted};
    outline: none;
  }
`;

export const DisplayValue = styled.span`
  color: ${theme.colors.foreground};
`;

export const Placeholder = styled.span`
  color: ${theme.colors.foregroundMuted};
`;

export const CalendarCard = styled.div`
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  z-index: 20;
  width: 280px;
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 1rem;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const MonthLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.foreground};
`;

export const NavButton = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.foreground};
  font-size: 1rem;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: ${theme.radii.input};
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.accentBadge};
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

export const WeekdayCell = styled.span`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.foregroundMuted};
  padding-bottom: 0.25rem;
`;

export const DayButton = styled.button<{
  $isCurrentMonth: boolean;
  $isSelected: boolean;
  $isToday: boolean;
}>`
  height: 2.25rem;
  border-radius: ${theme.radii.input};
  border: none;
  cursor: pointer;
  font: inherit;
  color: ${({ $isCurrentMonth, $isSelected }) =>
    $isSelected ? "#ffffff" : $isCurrentMonth ? theme.colors.foreground : theme.colors.foregroundMuted};
  background: ${({ $isSelected, $isToday }) => {
    if ($isSelected) return theme.colors.accent;
    if ($isToday) return theme.colors.accentBadge;
    return "transparent";
  }};
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $isSelected }) => ($isSelected ? theme.colors.accent : theme.colors.accentBadge)};
  }
`;

