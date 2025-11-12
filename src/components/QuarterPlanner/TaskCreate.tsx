'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { QuarterKey, formatISODate, parseISODate } from "@/lib/quarter";
import { TaskForm } from "./TaskForm";
import { TaskFormState } from "./types";

const PageShell = styled.div`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.stackGap};
`;

const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.controlGap};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.foregroundMuted};
  max-width: 46ch;
`;

type TaskCreateProps = {
  quarter: QuarterKey;
  maxTasks?: number;
};

export function TaskCreate({ quarter, maxTasks = Number.MAX_SAFE_INTEGER }: TaskCreateProps) {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [form, setForm] = useState<TaskFormState>(() => ({
    name: "",
    start: formatISODate(today),
    end: formatISODate(today),
  }));
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof TaskFormState) => (value: string) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      start: formatISODate(today),
      end: formatISODate(today),
    });
    setError(null);
  }, [today]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

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

      const params = new URLSearchParams();
      params.set(
        "task",
        JSON.stringify({
          name: form.name.trim(),
          start: formatISODate(startDate),
          end: formatISODate(endDate),
        }),
      );

      router.push(`/calendar/${quarter.year}/${quarter.quarter}?${params.toString()}`);
    },
    [form.end, form.name, form.start, quarter.quarter, quarter.year, router],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <PageShell>
      <HeadingGroup>
        <h1>Add a task</h1>
        <Subtitle>
          Fill in the task details below. After submission you will be redirected back to the
          quarter overview.
        </Subtitle>
      </HeadingGroup>

      <TaskForm
        form={form}
        error={error}
        taskCount={0}
        maxTasks={maxTasks}
        onNameChange={handleChange("name")}
        onStartChange={handleChange("start")}
        onEndChange={handleChange("end")}
        onSubmit={handleSubmit}
        onReset={resetForm}
        submitLabel="Save task"
        secondaryLabel="Cancel"
        onSecondaryAction={handleCancel}
        showLimitBadge={false}
      />
    </PageShell>
  );
}


