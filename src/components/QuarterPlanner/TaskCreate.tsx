'use client';

import { QuarterKey } from "@/lib/quarter";
import { TaskForm } from "./TaskForm";
import { HeadingGroup, PageShell, Subtitle } from "./styles/taskPageStyles";
import { useTaskForm } from "./hooks/useTaskForm";

type TaskCreateProps = {
  quarter: QuarterKey;
  maxTasks?: number;
};

export function TaskCreate({ quarter, maxTasks = Number.MAX_SAFE_INTEGER }: TaskCreateProps) {
  const { form, error, isSaving, handleChange, handleSubmit, handleCancel, handleReset } =
    useTaskForm({ quarter });

  if (!form) return null;

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
        onReset={handleReset}
        submitLabel="Save task"
        secondaryLabel="Cancel"
        onSecondaryAction={handleCancel}
        showLimitBadge={false}
        submitDisabled={isSaving}
      />
    </PageShell>
  );
}


