import { DatePicker } from "@/components/DatePicker";
import { TaskFormState } from "./types";
import { useTranslations } from "@/lib/translations";
import {
  Card,
  Form,
  FormRow,
  FormGrid,
  Label,
  FieldGroup,
  FieldLabel,
  Input,
  ErrorMessage,
  FormActions,
  PrimaryButton,
  SecondaryButton,
  LimitBadge,
} from "./styles/taskFormStyles";

type TaskFormProps = {
  form: TaskFormState;
  error: string | null;
  taskCount?: number;
  maxTasks?: number;
  title?: string;
  onNameChange: (value: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  submitLabel?: string;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  showLimitBadge?: boolean;
  submitDisabled?: boolean;
};

export function TaskForm({
  form,
  error,
  taskCount = 0,
  maxTasks = Number.MAX_SAFE_INTEGER,
  title,
  onNameChange,
  onStartChange,
  onEndChange,
  onSubmit,
  onReset,
  submitLabel,
  secondaryLabel,
  onSecondaryAction,
  showLimitBadge = true,
  submitDisabled = false,
}: TaskFormProps) {
  const t = useTranslations("taskForm");
  const handleSecondary = onSecondaryAction ?? onReset;
  const isAtLimit = taskCount >= maxTasks;
  const isSubmitDisabled = submitDisabled || isAtLimit;
  const displayTitle = title ?? t.title;
  const displaySubmitLabel = submitLabel ?? t.addTask;
  const displaySecondaryLabel = secondaryLabel ?? t.clear;

  return (
    <Card>
      <h2>{displayTitle}</h2>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <Label>
            {t.taskName}
            <Input
              type="text"
              name="name"
              placeholder={t.taskNamePlaceholder}
              value={form.name}
              onChange={(event) => onNameChange(event.target.value)}
              required
            />
          </Label>
        </FormRow>
        <FormGrid>
          <FieldGroup>
            <FieldLabel id="task-start-label">{t.startDate}</FieldLabel>
            <DatePicker
              value={form.start}
              onChange={onStartChange}
              ariaLabelledBy="task-start-label"
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel id="task-end-label">{t.endDate}</FieldLabel>
            <DatePicker
              value={form.end}
              onChange={onEndChange}
              ariaLabelledBy="task-end-label"
            />
          </FieldGroup>
        </FormGrid>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        <FormActions>
          <PrimaryButton type="submit" disabled={isSubmitDisabled}>
            {displaySubmitLabel}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleSecondary} disabled={submitDisabled}>
            {displaySecondaryLabel}
          </SecondaryButton>
          {showLimitBadge ? (
            <LimitBadge>
              {taskCount}/{maxTasks} {t.tasksAdded}
            </LimitBadge>
          ) : null}
        </FormActions>
      </Form>
    </Card>
  );
}


