'use client';

import { useMemo } from "react";
import { QuarterKey } from "@/lib/quarter";
import { TaskForm } from "./TaskForm";
import { HeadingGroup, PageShell, Subtitle } from "./styles/taskPageStyles";
import { useTaskForm } from "./hooks/useTaskForm";

type TaskEditProps = {
  quarter: QuarterKey;
  taskId: string;
};

export function TaskEdit({ quarter, taskId }: TaskEditProps) {
  const { form, error, loadError, isSaving, handleChange, handleSubmit, handleCancel, handleReset } =
    useTaskForm({ quarter, taskId });

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


