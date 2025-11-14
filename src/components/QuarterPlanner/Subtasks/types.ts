import { type WeekInfo } from "@/lib/quarter";

export type DialogMode = "task" | "week";

export type TaskOption = Readonly<{
  id: string;
  name: string;
}>;

export type SubtaskFormData = Readonly<{
  taskId: string;
  title: string;
  date: string;
  time: string;
  subtaskId?: string;
}>;

export type FormState = Readonly<{
  title: string;
  date: string;
  time: string;
}>;

export interface SubtaskDialogProps {
  readonly mode: DialogMode;
  readonly taskName?: string;
  readonly taskId?: string;
  readonly week: WeekInfo;
  readonly availableTasks: readonly TaskOption[];
  readonly error: string | null;
  readonly isSaving: boolean;
  readonly onDismiss: () => void;
  readonly onSubmit: (form: SubtaskFormData) => Promise<void> | void;
  readonly subtaskId?: string;
  readonly initialTitle?: string;
  readonly initialDate?: string;
}

