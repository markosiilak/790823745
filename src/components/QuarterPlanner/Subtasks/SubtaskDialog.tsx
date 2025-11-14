"use client";

import { useCallback, useMemo, useState, type FormEvent, type JSX } from "react";
import { formatISODate, parseISODate } from "@/lib/quarter";
import { DatePicker } from "@/components/DatePicker";
import { Dropdown, type DropdownOption } from "@/components/QuarterPlanner/Dropdown";
import { useTranslations } from "@/lib/translations";
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
  Actions,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
} from "./styles";
import type { SubtaskDialogProps, SubtaskFormData, FormState, TaskOption } from "./types";

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
}: SubtaskDialogProps): JSX.Element {
  const t = useTranslations("subtaskDialog");
  const defaultDate = useMemo<string>(() => formatISODate(week.start), [week.start]);
  const isEditMode = useMemo<boolean>(() => Boolean(subtaskId), [subtaskId]);
  
  const initialFormData = useMemo<FormState>(() => {
    if (isEditMode && initialDate) {
      const timestampDate = new Date(initialDate);
      if (!Number.isNaN(timestampDate.getTime())) {
        const timeString = timestampDate.toTimeString().slice(0, 5) as `${number}${number}:${number}${number}`;
        return {
          title: initialTitle ?? "",
          date: formatISODate(timestampDate),
          time: timeString,
        } as const;
      }
    }
    return {
      title: "",
      date: defaultDate,
      time: "09:00",
    } as const;
  }, [isEditMode, initialTitle, initialDate, defaultDate]);

  const [title, setTitle] = useState<string>(initialFormData.title);
  const [date, setDate] = useState<string>(initialFormData.date);
  const [time, setTime] = useState<string>(initialFormData.time);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(() =>
    mode === "task" ? taskId : availableTasks[0]?.id,
  );

  const taskOptions = useMemo<DropdownOption[]>(
    () =>
      availableTasks.map((task: TaskOption) => ({
        value: task.id,
        label: task.name,
      })),
    [availableTasks],
  );

  const weekSummary = useMemo<string>(() => {
    const rangeStart = formatISODate(week.start);
    const rangeEnd = formatISODate(week.end);
    return `${rangeStart} – ${rangeEnd}`;
  }, [week.end, week.start]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setLocalError(null);

      if (!title.trim()) {
        setLocalError(t.errorTitleRequired);
        return;
      }

      if (!date) {
        setLocalError(t.errorDateRequired);
        return;
      }

      if (!time) {
        setLocalError(t.errorTimeRequired);
        return;
      }

      const resolvedTaskId: string | undefined = mode === "task" ? taskId : selectedTaskId;
      if (!resolvedTaskId) {
        setLocalError(t.errorTaskRequired);
        return;
      }

      const selectedDate = parseISODate(date);
      selectedDate.setHours(0, 0, 0, 0);

      const weekStart = new Date(week.start);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(week.end);
      weekEnd.setHours(23, 59, 59, 999);

      const selectedTime = selectedDate.getTime();
      const weekStartTime = weekStart.getTime();
      const weekEndTime = weekEnd.getTime();

      if (selectedTime < weekStartTime || selectedTime > weekEndTime) {
        setLocalError(t.errorDateOutOfRange);
        return;
      }

      const formData: SubtaskFormData = {
        taskId: resolvedTaskId,
        title: title.trim(),
        date,
        time,
        ...(subtaskId ? { subtaskId } : undefined),
      };

      await onSubmit(formData);
    },
    [
      date,
      mode,
      onSubmit,
      selectedTaskId,
      taskId,
      time,
      title,
      week.end,
      week.start,
      subtaskId,
      t.errorTitleRequired,
      t.errorDateRequired,
      t.errorTimeRequired,
      t.errorTaskRequired,
      t.errorDateOutOfRange,
    ],
  );

  const dialogSubtitle = useMemo<string>(() => {
    if (mode === "task" && taskName) {
      return t.subtitleTask
        .replace("{{taskName}}", taskName)
        .replace("{{week}}", String(week.isoWeek))
        .replace("{{range}}", weekSummary);
    }
    return t.subtitleWeek.replace("{{week}}", String(week.isoWeek)).replace("{{range}}", weekSummary);
  }, [mode, taskName, week.isoWeek, weekSummary, t.subtitleTask, t.subtitleWeek]);

  const canSubmit = useMemo<boolean>(
    () => (mode === "task" ? Boolean(taskId) : availableTasks.length > 0 && Boolean(selectedTaskId)),
    [mode, taskId, availableTasks.length, selectedTaskId],
  );

  return (
    <Overlay>
      <DialogCard role="dialog" aria-modal="true" aria-labelledby="subtask-dialog-title">
        <Heading>
          <h2 id="subtask-dialog-title">{isEditMode ? t.titleEdit : t.titleAdd}</h2>
          <Subtitle>{dialogSubtitle}</Subtitle>
        </Heading>
        <Form onSubmit={handleSubmit}>
          {mode === "week" ? (
            <FieldGroup>
              <Label>{t.taskLabel}</Label>
              {availableTasks.length > 0 ? (
                <Dropdown
                  options={taskOptions}
                  value={selectedTaskId ?? null}
                  onChange={setSelectedTaskId}
                  ariaLabel={t.taskLabel}
                  width="100%"
                />
              ) : (
                <Subtitle>{t.noTasks}</Subtitle>
              )}
            </FieldGroup>
          ) : null}
          <FieldGroup>
            <Label htmlFor="subtask-title">{t.titleLabel}</Label>
            <TextInput
              id="subtask-title"
              type="text"
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <Label id="subtask-date-label">{t.dateLabel}</Label>
            <DatePicker value={date} onChange={setDate} ariaLabelledBy="subtask-date-label" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="subtask-time">{t.timeLabel}</Label>
            <TimeInput
              id="subtask-time"
              value={time}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTime(event.target.value);
              }}
              step={300}
            />
          </FieldGroup>
          {localError ? <ErrorMessage>{localError}</ErrorMessage> : null}
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Actions>
            <SecondaryButton type="button" onClick={onDismiss}>
              {t.cancel}
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSaving || !canSubmit}>
              {isSaving ? t.saving : t.save}
            </PrimaryButton>
          </Actions>
        </Form>
      </DialogCard>
    </Overlay>
  );
}


