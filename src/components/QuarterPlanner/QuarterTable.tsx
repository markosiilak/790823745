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
  left: 0;
  background: ${theme.colors.backgroundAlt};
  box-shadow: 1px 0 0 rgba(31, 41, 51, 0.08);
`;

const TaskHeaderCell = styled.th`
  ${stickyColumnStyles};
  z-index: 3;
  width: 260px;
  padding: 1rem;
  text-align: left;

  @media (max-width: 900px) {
    width: 220px;
  }
`;

const TaskRowHeader = styled.th`
  ${stickyColumnStyles};
  z-index: 1;
  width: 260px;
  padding: 1rem;
  text-align: left;

  @media (max-width: 900px) {
    width: 220px;
  }
`;

const TaskRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const TaskName = styled.span`
  font-weight: 600;
  display: block;
`;

const TaskDates = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.foregroundMuted};
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
              <TaskHeaderCell rowSpan={2} scope="col">
                Task
              </TaskHeaderCell>
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
                  const weekEndLabel = formatISODate(week.end);
                  return (
                    <th key={`${month.month}-${weekStartKey}`}>
                      W{week.isoWeek}
                      <WeekRange>
                        {weekStartKey.slice(5)} – {weekEndLabel.slice(5)}
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
                    <TaskRowHeader scope="row">
                      <TaskRow>
                        <TaskDetails>
                          <TaskName>{task.name}</TaskName>
                          <TaskDates>
                            {task.start} → {task.end}
                          </TaskDates>
                        </TaskDetails>
                        <RemoveButton
                          type="button"
                          onClick={() => onRemoveTask(task.id)}
                          aria-label={`Remove task ${task.name}`}
                        >
                          Remove
                        </RemoveButton>
                      </TaskRow>
                    </TaskRowHeader>
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


