import { DatePicker } from "@/components/DatePicker";
import { TaskFormState } from "./types";
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
  title = "Add a task",
  onNameChange,
  onStartChange,
  onEndChange,
  onSubmit,
  onReset,
  submitLabel = "Add task",
  secondaryLabel = "Clear",
  onSecondaryAction,
  showLimitBadge = true,
  submitDisabled = false,
}: TaskFormProps) {
  const handleSecondary = onSecondaryAction ?? onReset;
  const isAtLimit = taskCount >= maxTasks;
  const isSubmitDisabled = submitDisabled || isAtLimit;

  return (
    <Card>
      <h2>{title}</h2>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <Label>
            Task name
            <Input
              type="text"
              name="name"
              placeholder="e.g. Marketing campaign"
              value={form.name}
              onChange={(event) => onNameChange(event.target.value)}
              required
            />
          </Label>
        </FormRow>
        <FormGrid>
          <FieldGroup>
            <FieldLabel id="task-start-label">Start date</FieldLabel>
            <DatePicker
              value={form.start}
              onChange={onStartChange}
              ariaLabelledBy="task-start-label"
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel id="task-end-label">End date</FieldLabel>
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
            {submitLabel}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleSecondary} disabled={submitDisabled}>
            {secondaryLabel}
          </SecondaryButton>
          {showLimitBadge ? (
            <LimitBadge>
              {taskCount}/{maxTasks} tasks added
            </LimitBadge>
          ) : null}
        </FormActions>
      </Form>
    </Card>
  );
}


