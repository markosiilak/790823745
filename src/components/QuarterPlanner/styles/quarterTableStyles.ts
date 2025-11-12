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

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.controlGap};
  flex-wrap: wrap;
`;

export const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.controlGap};
`;

const baseSelectStyles = css`
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.backgroundAlt};
  color: ${theme.colors.foreground};
  padding: 0.55rem 2.25rem 0.55rem 0.75rem;
  font: inherit;
  cursor: pointer;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, ${theme.colors.accentStrong} 50%),
    linear-gradient(135deg, ${theme.colors.accentStrong} 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(1.1em), calc(100% - 13px) calc(1.1em);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: ${theme.colors.accent};
  }

  &:focus-visible {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accentMuted};
  }
`;

export const ViewModeSelect = styled.select`
  ${baseSelectStyles};
  min-width: 190px;
`;

export const WeekSelect = styled.select`
  ${baseSelectStyles};
  min-width: 220px;
`;

export const StyledTable = styled.table<{ $compact: boolean }>`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: ${({ $compact }) => ($compact ? "640px" : "720px")};

  thead th {
    text-align: center;
    padding: ${({ $compact }) => ($compact ? "0.6rem 0.4rem" : "0.85rem")};
    font-size: ${({ $compact }) => ($compact ? "0.8rem" : "0.9rem")};
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

export const StickyHeaderCell = styled.th<{ $left: number; $width: number; $compact: boolean }>`
  ${stickyColumnStyles};
  z-index: 3;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: ${({ $compact }) =>
    $compact ? theme.spacing.tableCellPaddingCompact : theme.spacing.tableCellPadding};
  && {
    text-align: left;
  }
`;

export const StickyBodyCell = styled.td<{ $left: number; $width: number; $compact: boolean }>`
  ${stickyColumnStyles};
  z-index: 1;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: ${({ $compact }) =>
    $compact ? theme.spacing.tableCellPaddingCompact : theme.spacing.tableCellPadding};
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
  text-align: left;
`;

export const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const iconButtonStyles = css`
  border: none;
  background: transparent;
  cursor: pointer;
  transition: ${theme.transitions.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.iconPadding};
  border-radius: ${theme.radii.input};
`;

export const EditButton = styled.button`
  ${iconButtonStyles};
  color: ${theme.colors.foreground};

  &:hover {
    transform: scale(1.05);
    color: ${theme.colors.accentStrong};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${theme.colors.weekInset};
  }
`;

export const RemoveButton = styled.button`
  ${iconButtonStyles};
  color: ${theme.colors.accentStrong};

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${theme.colors.weekInset};
  }
`;

export const WeekCell = styled.td<{ $active: boolean; $compact: boolean }>`
  min-height: ${({ $compact }) =>
    $compact ? theme.sizes.weekCellCompact : theme.sizes.weekCell};
  width: ${({ $compact }) =>
    $compact ? theme.sizes.weekCellCompact : theme.sizes.weekCell};
  min-width: ${({ $compact }) =>
    $compact ? theme.sizes.weekCellCompact : theme.sizes.weekCell};
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
  padding: 0.45rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: stretch;
  overflow: hidden;

  &:last-child {
    border-right: none;
  }
`;

export const AddSubtaskButton = styled.button`
  align-self: flex-end;
  border: none;
  background: rgba(255, 255, 255, 0.65);
  color: ${theme.colors.accentStrong};
  border-radius: ${theme.radii.input};
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  font-weight: ${theme.typography.fontWeightBold};
  cursor: pointer;
  transition: ${theme.transitions.primary}, background-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${theme.colors.weekInset};
  }
`;

export const SubtaskList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
`;

export const SubtaskItem = styled.li`
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${theme.radii.input};
  padding: 0.35rem 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  box-shadow: inset 0 0 0 1px rgba(31, 41, 51, 0.06);
`;

export const SubtaskMeta = styled.span`
  font-size: 0.65rem;
  color: ${theme.colors.foregroundMuted};
`;

export const SubtaskTitle = styled.span`
  font-size: 0.75rem;
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.foreground};
  word-break: break-word;
`;

export const EmptySubtasks = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: ${theme.colors.foregroundMuted};
  background: rgba(255, 255, 255, 0.6);
  border-radius: ${theme.radii.input};
`;

export const EmptyCell = styled.td`
  ${stickyColumnStyles};
  z-index: 1;
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${theme.colors.foregroundMuted};
  font-style: italic;
`;
