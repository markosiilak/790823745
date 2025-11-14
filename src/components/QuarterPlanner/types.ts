export type Subtask = {
  id: string;
  title: string;
  timestamp: string;
};

export type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  durationDays?: number;
  subtasks: Subtask[];
};

export type TaskFormState = {
  name: string;
  start: string;
  end: string;
};
