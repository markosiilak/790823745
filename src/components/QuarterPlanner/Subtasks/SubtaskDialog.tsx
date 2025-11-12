'use client';

import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { WeekInfo, formatISODate, parseISODate } from "@/lib/quarter";
import { DatePicker } from "@/components/DatePicker";
import theme from "@/styles/theme";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
`;

const DialogCard = styled.div`
  width: min(420px, 100%);
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.formGap};
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  font-size: 0.9rem;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.formGap};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.fieldGap};
`;

const Label = styled.label`
  font-weight: ${theme.typography.fontWeightBold};
  font-size: 0.85rem;
  color: ${theme.colors.foreground};
`;

const TextInput = styled.input`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.input};
  padding: 0.65rem 0.85rem;
  font: inherit;
  color: ${theme.colors.foreground};
  background: ${theme.colors.tableCellBg};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 4px ${theme.colors.accentMuted};
  }
`;

const TimeInput = styled(TextInput).attrs({ type: "time" })`
  width: 160px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.controlGap};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const buttonBase = `
  border-radius: ${theme.radii.pill};
  padding: ${theme.spacing.controlPadding};
  font-weight: ${theme.typography.fontWeightBold};
  cursor: pointer;
  transition: ${theme.transitions.primary}, opacity 0.18s ease;
  border: none;
`;

const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${theme.colors.accent};
  color: ${theme.colors.accentInverted};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryHover};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: ${theme.colors.foregroundMuted};
  border: 1px solid ${theme.colors.border};

  &:hover {
    transform: translateY(-1px);
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accentStrong};
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  background: ${theme.colors.dangerTint};
  padding: 0.75rem 1rem;
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.dangerBorder};
  font-size: 0.85rem;
`;

type SubtaskDialogProps = {
  taskName: string;
  week: WeekInfo;
  error: string | null;
  isSaving: boolean;
  onDismiss: () => void;
  onSubmit: (form: { title: string; date: string; time: string }) => Promise<void> | void;
};

export function SubtaskDialog({ taskName, week, error, isSaving, onDismiss, onSubmit }: SubtaskDialogProps) {
  const defaultDate = useMemo(() => formatISODate(week.start), [week.start]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("09:00");
  const [localError, setLocalError] = useState<string | null>(null);

  const weekSummary = useMemo(() => {
    const rangeStart = formatISODate(week.start);
    const rangeEnd = formatISODate(week.end);
    return `${rangeStart} – ${rangeEnd}`;
  }, [week.end, week.start]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLocalError(null);

      if (!title.trim()) {
        setLocalError("Please provide a subtask title.");
        return;
      }

      if (!date) {
        setLocalError("Please choose a date.");
        return;
      }

      if (!time) {
        setLocalError("Please choose a time.");
        return;
      }

      const selectedDate = parseISODate(date);
      selectedDate.setHours(0, 0, 0, 0);

      const weekStart = new Date(week.start);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(week.end);
      weekEnd.setHours(23, 59, 59, 999);

      if (selectedDate.getTime() < weekStart.getTime() || selectedDate.getTime() > weekEnd.getTime()) {
        setLocalError("The subtask date must fall within the selected week.");
        return;
      }

      await onSubmit({
        title: title.trim(),
        date,
        time,
      });
    },
    [date, onSubmit, time, title, week.end, week.start],
  );

  return (
    <Overlay>
      <DialogCard role="dialog" aria-modal="true" aria-labelledby="subtask-dialog-title">
        <Heading>
          <h2 id="subtask-dialog-title">Add subtask</h2>
          <Subtitle>
            {taskName} · Week {week.isoWeek} ({weekSummary})
          </Subtitle>
        </Heading>
        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="subtask-title">Title</Label>
            <TextInput
              id="subtask-title"
              type="text"
              placeholder="e.g. Client sync"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label id="subtask-date-label">Date</Label>
            <DatePicker value={date} onChange={setDate} ariaLabelledBy="subtask-date-label" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="subtask-time">Time</Label>
            <TimeInput
              id="subtask-time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              step={300}
            />
          </FieldGroup>
          {localError ? <ErrorMessage>{localError}</ErrorMessage> : null}
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Actions>
            <SecondaryButton type="button" onClick={onDismiss}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save subtask"}
            </PrimaryButton>
          </Actions>
        </Form>
      </DialogCard>
    </Overlay>
  );
}


