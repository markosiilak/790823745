'use client';

import { useMemo } from "react";
import { QuarterKey } from "@/lib/quarter";
import { TaskForm } from "./TaskForm";
import { HeadingGroup, PageShell, Subtitle } from "./styles/taskPageStyles";
import { useTaskForm } from "./hooks/useTaskForm";
import { useTranslations } from "@/lib/translations";

type TaskEditProps = {
  quarter: QuarterKey;
  taskId: string;
};

export function TaskEdit({ quarter, taskId }: TaskEditProps) {
  const t = useTranslations("taskEdit");
  const tCreate = useTranslations("taskCreate");
  const { form, error, loadError, isSaving, handleChange, handleSubmit, handleCancel, handleReset } =
    useTaskForm({ quarter, taskId });

  const headingTitle = useMemo(
    () => (form ? `${t.editTaskWithName} ${form.name}` : t.title),
    [form, t.editTaskWithName, t.title],
  );

  return (
    <PageShell>
      <HeadingGroup>
        <h1>{headingTitle}</h1>
        <Subtitle>{t.subtitle}</Subtitle>
      </HeadingGroup>

      {loadError ? (
        <p role="alert">{loadError}</p>
      ) : form ? (
        <TaskForm
          form={form}
          error={error}
          title={t.title}
          onNameChange={handleChange("name")}
          onStartChange={handleChange("start")}
          onEndChange={handleChange("end")}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitLabel={t.updateTask}
          secondaryLabel={tCreate.cancel}
          onSecondaryAction={handleCancel}
          showLimitBadge={false}
          submitDisabled={isSaving}
        />
      ) : (
        <p>{t.loading}</p>
      )}
    </PageShell>
  );
}


