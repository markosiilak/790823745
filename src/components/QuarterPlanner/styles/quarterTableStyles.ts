import styled, { css } from "styled-components";
import theme from "@/styles/theme";

export const Card = styled.section`
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 2rem;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.controlGap};
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

export const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  max-width: 46ch;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 720px;

  thead th {
    text-align: center;
    padding: 0.85rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${theme.colors.tableHeaderText};
    background: ${theme.colors.tableHeader};
    border-bottom: 1px solid ${theme.colors.border};
  }

  thead tr:first-child th:first-child {
    border-top-left-radius: 14px;
  }

  thead tr:first-child th:last-child {
    border-top-right-radius: 14px;
  }

  tbody th,
  tbody td {
    border-bottom: 1px solid ${theme.colors.tableDivider};
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const WeekRange = styled.span`
  display: block;
  font-size: 0.7rem;
  color: ${theme.colors.foregroundMuted};
  margin-top: 0.2rem;
`;

const stickyColumnStyles = css`
  position: sticky;
  background: ${theme.colors.backgroundAlt};
  box-shadow: 1px 0 0 rgba(31, 41, 51, 0.08);
`;

export const StickyHeaderCell = styled.th<{ $left: number; $width: number }>`
  ${stickyColumnStyles};
  z-index: 3;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: ${theme.spacing.tableCellPadding};
  text-align: left;
`;

export const StickyBodyCell = styled.td<{ $left: number; $width: number }>`
  ${stickyColumnStyles};
  z-index: 1;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: ${theme.spacing.tableCellPadding};
`;

export const TaskRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
`;

export const TaskName = styled.span`
  font-weight: 600;
  display: block;
`;

export const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.accentStrong};
  cursor: pointer;
  transition: ${theme.transitions.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.iconPadding};
  border-radius: ${theme.radii.input};

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${theme.colors.weekInset};
  }
`;

export const WeekCell = styled.td<{ $active: boolean }>`
  height: ${theme.sizes.weekCell};
  width: ${theme.sizes.weekCell};
  min-width: ${theme.sizes.weekCell};
  border-right: 1px solid ${theme.colors.tableDivider};
  position: relative;
  background: ${({ $active }) =>
    $active
      ? `linear-gradient(135deg, ${theme.colors.weekGradientStart}, ${theme.colors.weekGradientEnd})`
      : theme.colors.tableCellBg};
  box-shadow: ${({ $active }) =>
    $active ? `inset 0 0 0 2px ${theme.colors.weekInset}` : "none"};
  border-right-color: ${({ $active }) =>
    $active ? theme.colors.weekBorderActive : theme.colors.tableDivider};

  &:last-child {
    border-right: none;
  }
`;

export const EmptyCell = styled.td`
  ${stickyColumnStyles};
  z-index: 1;
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${theme.colors.foregroundMuted};
  font-style: italic;
`;
