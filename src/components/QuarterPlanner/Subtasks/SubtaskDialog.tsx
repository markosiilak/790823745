"use client";

import { useCallback, useMemo, useState } from "react";
import { WeekInfo, formatISODate, parseISODate } from "@/lib/quarter";
import { DatePicker } from "@/components/DatePicker";
import {
  Overlay,
  DialogCard,
  Heading,
  Subtitle,
  Form,
  FieldGroup,
  Label,
  TextInput,
  TimeInput,
  TaskSelect,
  Actions,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
} from "./styles";

type SubtaskDialogProps = {
  mode: "task" | "week";
  taskName?: string;
  taskId?: string;
  week: WeekInfo;
  availableTasks: Array<{ id: string; name: string }>;
  error: string | null;
  isSaving: boolean;
  onDismiss: () => void;
  onSubmit: (form: { taskId: string; title: string; date: string; time: string; subtaskId?: string }) => Promise<void> | void;
  // Edit mode props
  subtaskId?: string;
  initialTitle?: string;
  initialDate?: string;
};

/**
 * Modal dialog for creating or editing subtasks.
 * Supports two modes: "task" (subtask for a specific task) and "week" (subtask for a week with task selection).
 * Handles form state, validation, and submission. Pre-fills data in edit mode.
 * Combines date and time inputs into an ISO timestamp for storage.
 */
export function SubtaskDialog({
  mode,
  taskName,
  taskId,
  week,
  availableTasks,
  error,
  isSaving,
  onDismiss,
  onSubmit,
  subtaskId,
  initialTitle,
  initialDate,
}: SubtaskDialogProps) {
  const defaultDate = useMemo(() => formatISODate(week.start), [week.start]);
  const isEditMode = Boolean(subtaskId);
  
  // Initialize form with existing data if in edit mode, otherwise use defaults
  const initialFormData = useMemo(() => {
    if (isEditMode && initialDate) {
      // initialDate is an ISO timestamp string, parse it to get date and time
      const timestampDate = new Date(initialDate);
      if (!Number.isNaN(timestampDate.getTime())) {
        const timeString = timestampDate.toTimeString().slice(0, 5); // HH:mm format
        return {
          title: initialTitle || "",
          date: formatISODate(timestampDate),
          time: timeString,
        };
      }
    }
    return {
      title: "",
      date: defaultDate,
      time: "09:00",
    };
  }, [isEditMode, initialTitle, initialDate, defaultDate]);

  const [title, setTitle] = useState(initialFormData.title);
  const [date, setDate] = useState(initialFormData.date);
  const [time, setTime] = useState(initialFormData.time);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    mode === "task" ? taskId : availableTasks[0]?.id,
  );

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

       const resolvedTaskId = mode === "task" ? taskId : selectedTaskId;
       if (!resolvedTaskId) {
         setLocalError("Please pick a task for this subtask.");
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
        taskId: resolvedTaskId,
        title: title.trim(),
        date,
        time,
        ...(subtaskId && { subtaskId }),
      });
    },
    [date, mode, onSubmit, selectedTaskId, taskId, time, title, week.end, week.start, subtaskId],
  );

  const dialogSubtitle =
    mode === "task" && taskName
      ? `${taskName} · Week ${week.isoWeek} (${weekSummary})`
      : `Week ${week.isoWeek} (${weekSummary})`;

  const canSubmit = mode === "task" ? Boolean(taskId) : availableTasks.length > 0 && Boolean(selectedTaskId);

  return (
    <Overlay>
      <DialogCard role="dialog" aria-modal="true" aria-labelledby="subtask-dialog-title">
        <Heading>
          <h2 id="subtask-dialog-title">{isEditMode ? "Edit subtask" : "Add subtask"}</h2>
          <Subtitle>{dialogSubtitle}</Subtitle>
        </Heading>
        <Form onSubmit={handleSubmit}>
          {mode === "week" ? (
            <FieldGroup>
              <Label htmlFor="subtask-task">Task</Label>
              <TaskSelect
                id="subtask-task"
                value={selectedTaskId ?? ""}
                onChange={(event) => setSelectedTaskId(event.target.value)}
              >
                {availableTasks.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </TaskSelect>
              {availableTasks.length === 0 ? (
                <Subtitle>No tasks overlap with this week.</Subtitle>
              ) : null}
            </FieldGroup>
          ) : null}
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
            <PrimaryButton type="submit" disabled={isSaving || !canSubmit}>
              {isSaving ? "Saving…" : "Save subtask"}
            </PrimaryButton>
          </Actions>
        </Form>
      </DialogCard>
    </Overlay>
  );
}


