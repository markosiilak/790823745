import styled, { css } from "styled-components";
import { TaskFormState } from "./types";

const Card = styled.section`
  background: var(--background-alt);
  border-radius: 20px;
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: var(--foreground);
  width: 100%;
`;

const Input = styled.input`
  appearance: none;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  font: inherit;
  color: var(--foreground);
  background: #f8fbff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-muted);
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #d64545;
  background: rgba(214, 69, 69, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(214, 69, 69, 0.25);
`;

const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

const buttonBase = css`
  border-radius: 999px;
  border: none;
  padding: 0.65rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
`;

const PrimaryButton = styled.button`
  ${buttonBase};
  background: var(--accent);
  color: #ffffff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: var(--foreground-muted);
  border: 1px solid var(--border);

  &:hover {
    transform: translateY(-1px);
    border-color: var(--accent);
    color: var(--accent-strong);
  }
`;

const LimitBadge = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--foreground-muted);
  background: rgba(67, 97, 238, 0.08);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
`;

type TaskFormProps = {
  form: TaskFormState;
  error: string | null;
  taskCount?: number;
  maxTasks?: number;
  onNameChange: (value: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  submitLabel?: string;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  showLimitBadge?: boolean;
};

export function TaskForm({
  form,
  error,
  taskCount = 0,
  maxTasks = Number.MAX_SAFE_INTEGER,
  onNameChange,
  onStartChange,
  onEndChange,
  onSubmit,
  onReset,
  submitLabel = "Add task",
  secondaryLabel = "Clear",
  onSecondaryAction,
  showLimitBadge = true,
}: TaskFormProps) {
  const handleSecondary = onSecondaryAction ?? onReset;
  const isAtLimit = taskCount >= maxTasks;

  return (
    <Card>
      <h2>Add a task</h2>
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
          <Label>
            Start date
            <Input
              type="date"
              name="start"
              value={form.start}
              onChange={(event) => onStartChange(event.target.value)}
              required
            />
          </Label>
          <Label>
            End date
            <Input
              type="date"
              name="end"
              value={form.end}
              onChange={(event) => onEndChange(event.target.value)}
              required
            />
          </Label>
        </FormGrid>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        <FormActions>
          <PrimaryButton type="submit" disabled={isAtLimit}>
            {submitLabel}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleSecondary}>
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


