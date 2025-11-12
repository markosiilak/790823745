'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuarterKey, formatISODate, parseISODate } from "@/lib/quarter";
import { TaskForm } from "./TaskForm";
import { TaskFormState, Task } from "./types";
import { HeadingGroup, PageShell, Subtitle } from "./styles/taskPageStyles";

type TaskEditProps = {
  quarter: QuarterKey;
  taskId: string;
};

export function TaskEdit({ quarter, taskId }: TaskEditProps) {
  const router = useRouter();
  const [form, setForm] = useState<TaskFormState | null>(null);
  const [initialForm, setInitialForm] = useState<TaskFormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      try {
        setLoadError(null);
        const response = await fetch("/api/tasks", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load task data.");
        }
        const tasks = (await response.json()) as Task[];
        const task = tasks.find((item) => item.id === taskId);
        if (!task) {
          throw new Error("Task not found.");
        }

        if (!cancelled) {
          const normalised: TaskFormState = {
            name: task.name,
            start: formatISODate(parseISODate(task.start)),
            end: formatISODate(parseISODate(task.end)),
          };
          setForm(normalised);
          setInitialForm(normalised);
        }
      } catch (loadErr) {
        if (!cancelled) {
          setLoadError(loadErr instanceof Error ? loadErr.message : "Failed to load task.");
        }
      }
    }

    loadTask();

    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const handleChange = useCallback(
    (field: keyof TaskFormState) => (value: string) => {
      setForm((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          [field]: value,
        };
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!form) {
        return;
      }

      if (!form.name.trim()) {
        setError("Please provide a task name.");
        return;
      }

      if (!form.start || !form.end) {
        setError("Please pick both start and end dates.");
        return;
      }

      const startDate = parseISODate(form.start);
      const endDate = parseISODate(form.end);

      if (startDate > endDate) {
        setError("The end date must be on or after the start date.");
        return;
      }

      try {
        setIsSaving(true);
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: taskId,
            name: form.name.trim(),
            start: formatISODate(startDate),
            end: formatISODate(endDate),
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Failed to update task.");
        }

        router.push(`/calendar/${quarter.year}/${quarter.quarter}`);
      } catch (saveError) {
        console.error("Failed to update task", saveError);
        setError(saveError instanceof Error ? saveError.message : "Failed to update task.");
        setIsSaving(false);
      }
    },
    [form, quarter.quarter, quarter.year, router, taskId],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleReset = useCallback(() => {
    if (initialForm) {
      setForm(initialForm);
      setError(null);
    }
  }, [initialForm]);

  const headingTitle = useMemo(() => (form ? `Edit ${form.name}` : "Edit task"), [form]);

  return (
    <PageShell>
      <HeadingGroup>
        <h1>{headingTitle}</h1>
        <Subtitle>
          Update the task details below. After saving you will be redirected back to the quarter
          overview.
        </Subtitle>
      </HeadingGroup>

      {loadError ? (
        <p role="alert">{loadError}</p>
      ) : form ? (
        <TaskForm
          form={form}
          error={error}
          title="Edit task"
          onNameChange={handleChange("name")}
          onStartChange={handleChange("start")}
          onEndChange={handleChange("end")}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitLabel="Update task"
          secondaryLabel="Cancel"
          onSecondaryAction={handleCancel}
          showLimitBadge={false}
          submitDisabled={isSaving}
        />
      ) : (
        <p>Loading task…</p>
      )}
    </PageShell>
  );
}


