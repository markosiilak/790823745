import styled, { css } from "styled-components";
import { QuarterStructure, formatISODate, parseISODate, weekOverlapsRange } from "@/lib/quarter";
import { Task } from "./types";
import theme from "@/styles/theme";

const Card = styled.section`
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 2rem;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.controlGap};
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  max-width: 46ch;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
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

const WeekRange = styled.span`
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

const NAME_COLUMN_WIDTH = 260;
const DATE_COLUMN_WIDTH = 140;

const StickyHeaderCell = styled.th<{ $left: number; $width: number }>`
  ${stickyColumnStyles};
  z-index: 3;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: 1rem;
  text-align: left;
`;

const StickyBodyCell = styled.td<{ $left: number; $width: number }>`
  ${stickyColumnStyles};
  z-index: 1;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  padding: 1rem;
`;

const TaskRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
`;

const TaskName = styled.span`
  font-weight: 600;
  display: block;
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.accentStrong};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const WeekCell = styled.td<{ $active: boolean }>`
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

const EmptyCell = styled.td`
  ${stickyColumnStyles};
  z-index: 1;
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${theme.colors.foregroundMuted};
  font-style: italic;
`;

type QuarterTableProps = {
  structure: QuarterStructure;
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
};

const weekFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function QuarterTable({ structure, tasks, onRemoveTask }: QuarterTableProps) {
  return (
    <Card>
      <TableHeader>
        <div>
          <h2>Quarter overview</h2>
          <Subtitle>
            Weeks follow ISO-8601 rules (Monday start, week 1 contains Thursday). Weeks are assigned
            to the month they mostly occupy.
          </Subtitle>
        </div>
      </TableHeader>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <StickyHeaderCell rowSpan={2} scope="col" $left={0} $width={NAME_COLUMN_WIDTH}>
                Task
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
              >
                Start date
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
              >
                End date
              </StickyHeaderCell>
              {structure.months.map((month) => (
                <th key={month.month} colSpan={month.weeks.length} scope="colgroup">
                  {month.name}
                </th>
              ))}
            </tr>
            <tr>
              {structure.months.flatMap((month) =>
                month.weeks.map((week) => {
                  const weekStartKey = formatISODate(week.start);
                  return (
                    <th key={`${month.month}-${weekStartKey}`}>
                      W{week.isoWeek}
                      <WeekRange>
                        {weekFormatter.format(week.start)} – {weekFormatter.format(week.end)}
                      </WeekRange>
                    </th>
                  );
                }),
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <EmptyCell colSpan={1 + structure.weeks.length}>
                  No tasks yet. Add one above to see it highlighted here.
                </EmptyCell>
              </tr>
            ) : (
              tasks.map((task) => {
                const taskStart = parseISODate(task.start);
                const taskEnd = parseISODate(task.end);
                return (
                  <tr key={task.id}>
                    <StickyBodyCell as="th" scope="row" $left={0} $width={NAME_COLUMN_WIDTH}>
                      <TaskRow>
                        <TaskName>{task.name}</TaskName>
                        <RemoveButton
                          type="button"
                          onClick={() => onRemoveTask(task.id)}
                          aria-label={`Remove task ${task.name}`}
                        >
                          Remove
                        </RemoveButton>
                      </TaskRow>
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                    >
                      {dateFormatter.format(taskStart)}
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                    >
                      {dateFormatter.format(taskEnd)}
                    </StickyBodyCell>
                    {structure.months.flatMap((month) =>
                      month.weeks.map((week) => {
                        const weekStartKey = formatISODate(week.start);
                        const active = weekOverlapsRange(week, taskStart, taskEnd);
                        return (
                          <WeekCell key={`${task.id}-${weekStartKey}`} $active={active} />
                        );
                      }),
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </Card>
  );
}


