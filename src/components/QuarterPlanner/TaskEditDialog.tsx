'use client';

import { useMemo } from 'react';
import { QuarterKey } from '@/lib/quarter';
import { DatePicker } from '@/components/DatePicker';
import { useTaskForm } from '@/components/QuarterPlanner/hooks/useTaskForm';
import { useTranslations } from '@/lib/translations';
import {
  Overlay,
  DialogCard,
  Heading,
  Subtitle,
  Form,
  FieldGroup,
  Label,
  TextInput,
  Actions,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
} from './Subtasks/styles';
import {
  FormGrid,
  FieldLabel,
} from './styles/taskFormStyles';

type TaskEditDialogProps = {
  quarter: QuarterKey;
  taskId: string;
  onDismiss: () => void;
  onSuccess?: () => void;
};

/**
 * Modal dialog for editing tasks.
 * Uses the useTaskForm hook to handle form state and submission.
 * Closes the modal on successful save or cancel.
 */
export function TaskEditDialog({ quarter, taskId, onDismiss, onSuccess }: TaskEditDialogProps) {
  const t = useTranslations('taskEdit');
  const tForm = useTranslations('taskForm');
  const tDialog = useTranslations('subtaskDialog');
  const { form, error, loadError, isSaving, handleChange, handleSubmit, handleReset } = useTaskForm({
    quarter,
    taskId,
    onSubmitSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
      onDismiss();
    },
  });

  const headingTitle = useMemo(
    () => (form ? `${t.editTaskWithName} ${form.name}` : t.title),
    [form, t.editTaskWithName, t.title],
  );

  return (
    <Overlay onClick={onDismiss}>
      <DialogCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-edit-dialog-title"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(500px, 100%)' }}
      >
        <Heading>
          <h2 id="task-edit-dialog-title">{headingTitle}</h2>
          <Subtitle>{t.subtitle}</Subtitle>
        </Heading>

        {loadError ? (
          <ErrorMessage role="alert">{loadError}</ErrorMessage>
        ) : form ? (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="task-name">{tForm.taskName}</Label>
              <TextInput
                id="task-name"
                type="text"
                placeholder={tForm.taskNamePlaceholder}
                value={form.name}
                onChange={(e) => handleChange('name')(e.target.value)}
                required
              />
            </FieldGroup>
            <FormGrid>
              <FieldGroup>
                <FieldLabel id="task-start-label">{tForm.startDate}</FieldLabel>
                <DatePicker
                  value={form.start}
                  onChange={handleChange('start')}
                  ariaLabelledBy="task-start-label"
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel id="task-end-label">{tForm.endDate}</FieldLabel>
                <DatePicker
                  value={form.end}
                  onChange={handleChange('end')}
                  ariaLabelledBy="task-end-label"
                />
              </FieldGroup>
            </FormGrid>
            {error ? <ErrorMessage>{error}</ErrorMessage> : null}
            <Actions>
              <SecondaryButton type="button" onClick={onDismiss} disabled={isSaving}>
                {tDialog.cancel}
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSaving}>
                {isSaving ? tDialog.saving : t.updateTask}
              </PrimaryButton>
            </Actions>
          </Form>
        ) : (
          <Subtitle>{t.loading}</Subtitle>
        )}
      </DialogCard>
    </Overlay>
  );
}

