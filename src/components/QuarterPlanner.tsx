'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styled, { css } from "styled-components";
import {
  QuarterKey,
  buildQuarterStructure,
  formatISODate,
  getQuarterFromDate,
  parseISODate,
  shiftQuarter,
  weekOverlapsRange,
} from "@/lib/quarter";

type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
};

const MAX_TASKS = 10;

const DEFAULT_TASKS: Task[] = [
  {
    id: "kickoff",
    name: "Product Discovery",
    start: formatISODate(new Date()),
    end: formatISODate(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)),
  },
];

const Planner = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

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
  margin-top: 0.4rem;
  max-width: 46ch;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-start;
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

const Card = styled.section`
  background: var(--background-alt);
  border-radius: 20px;
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: var(--foreground);
  width: 100%;
`;

const Input = styled.input`
  appearance: none;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  font: inherit;
  color: var(--foreground);
  background: #f8fbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-muted);
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #d64545;
  background: rgba(214, 69, 69, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(214, 69, 69, 0.25);
`;

const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

const buttonBase = css`
  border-radius: 999px;
  border: none;
  padding: 0.65rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
`;

const PrimaryButton = styled.button`
  ${buttonBase};
  background: var(--accent);
  color: #ffffff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: var(--foreground-muted);
  border: 1px solid var(--border);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--accent);
    color: var(--accent-strong);
  }
`;

const LimitBadge = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--foreground-muted);
  background: rgba(67, 97, 238, 0.08);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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
    color: var(--foreground);
    background: #eef2ff;
    border-bottom: 1px solid var(--border);
  }

  thead tr:first-child th:first-child {
    border-top-left-radius: 14px;
  }

  thead tr:first-child th:last-child {
    border-top-right-radius: 14px;
  }

  tbody th,
  tbody td {
    border-bottom: 1px solid #ecf0f6;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const WeekRange = styled.span`
  display: block;
  font-size: 0.7rem;
  color: var(--foreground-muted);
  margin-top: 0.2rem;
`;

const stickyColumnStyles = css`
  position: sticky;
  left: 0;
  background: var(--background-alt);
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
  color: var(--foreground-muted);
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: var(--accent-strong);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const WeekCell = styled.td<{ $active: boolean }>`
  height: 62px;
  width: 62px;
  min-width: 62px;
  border-right: 1px solid #ecf0f6;
  position: relative;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, rgba(67, 97, 238, 0.12), rgba(67, 97, 238, 0.28))"
      : "#fbfcff"};
  box-shadow: ${({ $active }) =>
    $active ? "inset 0 0 0 2px rgba(67, 97, 238, 0.25)" : "none"};
  border-right-color: ${({ $active }) => ($active ? "rgba(67, 97, 238, 0.45)" : "#ecf0f6")};

  &:last-child {
    border-right: none;
  }
`;

const EmptyCell = styled.td`
  ${stickyColumnStyles};
  z-index: 1;
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--foreground-muted);
  font-style: italic;
`;

export function QuarterPlanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const fallbackQuarter = useMemo(() => getQuarterFromDate(today), [today]);

  const searchQuarter = useMemo(
    () => parseQuarterFromSearch(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const currentQuarter = searchQuarter ?? fallbackQuarter;

  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);

  const [name, setName] = useState("");
  const [start, setStart] = useState(formatISODate(today));
  const [end, setEnd] = useState(formatISODate(today));
  const [error, setError] = useState<string | null>(null);

  const setQuarterInUrl = useCallback(
    (nextQuarter: QuarterKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", String(nextQuarter.year));
      params.set("quarter", String(nextQuarter.quarter));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (searchQuarter) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(fallbackQuarter.year));
    params.set("quarter", String(fallbackQuarter.quarter));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [fallbackQuarter, pathname, router, searchParams, searchQuarter]);

  const structure = useMemo(
    () => buildQuarterStructure(currentQuarter.year, currentQuarter.quarter),
    [currentQuarter.quarter, currentQuarter.year],
  );

  const handleShiftQuarter = useCallback(
    (delta: number) => {
      const nextQuarter = shiftQuarter(currentQuarter, delta);
      setQuarterInUrl(nextQuarter);
    },
    [currentQuarter, setQuarterInUrl],
  );

  const resetForm = useCallback(() => {
    setName("");
    setStart(formatISODate(today));
    setEnd(formatISODate(today));
    setError(null);
  }, [today]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (tasks.length >= MAX_TASKS) {
        setError(`Only ${MAX_TASKS} tasks are supported.`);
        return;
      }

      if (!name.trim()) {
        setError("Please provide a task name.");
        return;
      }

      if (!start || !end) {
        setError("Please pick both start and end dates.");
        return;
      }

      const startDate = parseISODate(start);
      const endDate = parseISODate(end);

      if (startDate > endDate) {
        setError("The end date must be on or after the start date.");
        return;
      }

      setTasks((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          start: formatISODate(startDate),
          end: formatISODate(endDate),
        },
      ]);

      resetForm();
    },
    [end, name, resetForm, start, tasks.length],
  );

  const handleRemoveTask = useCallback((taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  return (
    <Planner>
      <Header>
        <div>
          <Kicker>Quarterly Task Planner</Kicker>
          <h1>{structure.label}</h1>
          <Subtitle>
            Visualise task timelines across weeks. Navigate between quarters and add up to ten
            tasks to your view.
          </Subtitle>
        </div>
        <Controls>
          <NavButton
            type="button"
            onClick={() => handleShiftQuarter(-1)}
            aria-label="View previous quarter"
          >
            ← Previous
          </NavButton>
          <NavButton
            type="button"
            onClick={() => handleShiftQuarter(1)}
            aria-label="View next quarter"
          >
            Next →
          </NavButton>
        </Controls>
      </Header>

      <Card>
        <h2>Add a task</h2>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Label>
              Task name
              <Input
                type="text"
                name="name"
                placeholder="e.g. Marketing campaign"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Label>
          </FormRow>
          <FormGrid>
            <Label>
              Start date
              <Input
                type="date"
                name="start"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                required
              />
            </Label>
            <Label>
              End date
              <Input
                type="date"
                name="end"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                required
              />
            </Label>
          </FormGrid>
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <FormActions>
            <PrimaryButton type="submit" disabled={tasks.length >= MAX_TASKS}>
              Add task
            </PrimaryButton>
            <SecondaryButton type="button" onClick={resetForm}>
              Clear
            </SecondaryButton>
            <LimitBadge>
              {tasks.length}/{MAX_TASKS} tasks added
            </LimitBadge>
          </FormActions>
        </Form>
      </Card>

      <Card>
        <div>
          <TableHeader>
            <div>
              <h2>Quarter overview</h2>
              <Subtitle>
                Weeks follow ISO-8601 rules (Monday start, week 1 contains Thursday). Weeks are
                assigned to the month they mostly occupy.
              </Subtitle>
            </div>
          </TableHeader>
        </div>
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
                  month.weeks.map((week) => (
                    <th key={`${month.month}-${week.isoWeek}`}>
                      W{week.isoWeek}
                      <WeekRange>
                        {formatISODate(week.start).slice(5)} – {formatISODate(week.end).slice(5)}
                      </WeekRange>
                    </th>
                  )),
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
                            onClick={() => handleRemoveTask(task.id)}
                            aria-label={`Remove task ${task.name}`}
                          >
                            Remove
                          </RemoveButton>
                        </TaskRow>
                      </TaskRowHeader>
                      {structure.months.flatMap((month) =>
                        month.weeks.map((week) => {
                          const active = weekOverlapsRange(week, taskStart, taskEnd);
                          return (
                            <WeekCell
                              key={`${task.id}-${month.month}-${week.isoWeek}`}
                              $active={active}
                            />
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
    </Planner>
  );
}

function parseQuarterFromSearch(searchParams: URLSearchParams): QuarterKey | null {
  const yearParam = Number(searchParams.get("year"));
  const quarterParam = Number(searchParams.get("quarter"));
  if (!Number.isFinite(yearParam) || !Number.isFinite(quarterParam)) {
    return null;
  }

  if (quarterParam < 1 || quarterParam > 4) {
    return null;
  }

  return { year: yearParam, quarter: quarterParam };
}

