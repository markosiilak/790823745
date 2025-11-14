'use client';

import { QuarterKey } from "@/lib/quarter";
import { TaskForm } from "@/components/QuarterPlanner/TaskForm"; 
import { HeadingGroup, PageShell, Subtitle } from "@/components/QuarterPlanner/styles/taskPageStyles";
import { useTaskForm } from "@/components/QuarterPlanner/hooks/useTaskForm";
import { useTranslations } from "@/lib/translations";

type TaskCreateProps = {
  quarter: QuarterKey;
  maxTasks?: number;
};

/** * Uses TaskForm with useTaskForm hook for form management. *
 */
export function TaskCreate({ quarter, maxTasks = Number.MAX_SAFE_INTEGER }: TaskCreateProps) {
  const t = useTranslations("taskCreate");
  const { form, error, isSaving, handleChange, handleSubmit, handleCancel, handleReset } =
    useTaskForm({ quarter });

  if (!form) return null;

  return (
    <PageShell>
      <HeadingGroup>
        <h1>{t.title}</h1>
        <Subtitle>{t.subtitle}</Subtitle>
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
        submitLabel={t.saveTask}
        secondaryLabel={t.cancel}
        onSecondaryAction={handleCancel}
        showLimitBadge={false}
        submitDisabled={isSaving}
      />
    </PageShell>
  );
}


