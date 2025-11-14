import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuarterKey, formatISODate, parseISODate } from "@/lib/quarter";
import { TaskFormState, Task } from "../types";
import { useToast } from "@/components/shared/Toast/ToastContext";
import { useTranslations } from "@/lib/translations";

type UseTaskFormOptions = {
  quarter: QuarterKey;
  taskId?: string;
  onSubmitSuccess?: () => void;
};

/**
 * React hook for managing task form state, validation, and submission.
 * Handles both create and edit modes (determined by presence of taskId).
 * In edit mode, loads task data from API. In create mode, initializes with default dates.
 * Validates form data, handles API submission, and manages navigation/redirects.
 */
export function useTaskForm({ quarter, taskId, onSubmitSuccess }: UseTaskFormOptions) {
  const router = useRouter();
  const isEditMode = Boolean(taskId);
  const { showToast } = useToast();
  const t = useTranslations("toast");

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const defaultStart = useMemo(() => formatISODate(today), [today]);
  const defaultEnd = useMemo(() => {
    const future = new Date(today);
    future.setDate(future.getDate() + 7);
    return formatISODate(future);
  }, [today]);

  const [form, setForm] = useState<TaskFormState | null>(
    isEditMode
      ? null
      : {
          name: "",
          start: defaultStart,
          end: defaultEnd,
        }
  );
  const [initialForm, setInitialForm] = useState<TaskFormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load task data in edit mode
  useEffect(() => {
    if (!isEditMode || !taskId) return;

    let cancelled = false;

    async function loadTask() {
      try {
        setLoadError(null);
        const response = await fetch("/api/tasks", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load task data.");
        }
        const tasks = (await response.json()) as Task[];
        const task = tasks.find((item) => item.id === taskId);
        if (!task) {
          throw new Error("Task not found.");
        }

        if (!cancelled) {
          if (typeof task.name !== "string") {
            throw new Error("Task is missing a name.");
          }

          const baseStart = (() => {
            if (typeof task.start === "string") {
              return formatISODate(parseISODate(task.start));
            }
            if (typeof task.durationDays === "number") {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return formatISODate(today);
            }
            throw new Error("Task is missing start information.");
          })();

          const baseEnd = (() => {
            if (typeof task.end === "string") {
              return formatISODate(parseISODate(task.end));
            }
            if (typeof task.durationDays === "number") {
              const startDate = parseISODate(baseStart);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + Math.max(task.durationDays, 0));
              return formatISODate(endDate);
            }
            return baseStart;
          })();

          const normalised: TaskFormState = {
            name: task.name,
            start: baseStart,
            end: baseEnd,
          };
          setForm(normalised);
          setInitialForm(normalised);
        }
      } catch (loadErr) {
        if (!cancelled) {
          setLoadError(loadErr instanceof Error ? loadErr.message : "Failed to load task.");
        }
      }
    }

    loadTask();

    return () => {
      cancelled = true;
    };
  }, [isEditMode, taskId]);

  const handleChange = useCallback(
    (field: keyof TaskFormState) => (value: string) => {
      setForm((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          [field]: value,
        };
      });
    },
    []
  );

  const validateForm = useCallback((formData: TaskFormState): string | null => {
    if (!formData.name.trim()) {
      return "Please provide a task name.";
    }

    if (!formData.start || !formData.end) {
      return "Please pick both start and end dates.";
    }

    const startDate = parseISODate(formData.start);
    const endDate = parseISODate(formData.end);

    if (startDate > endDate) {
      return "The end date must be on or after the start date.";
    }

    return null;
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!form) {
        return;
      }

      const validationError = validateForm(form);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        const startDate = parseISODate(form.start);
        const endDate = parseISODate(form.end);

        const response = await fetch("/api/tasks", {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(isEditMode && taskId ? { id: taskId } : {}),
            name: form.name.trim(),
            start: formatISODate(startDate),
            end: formatISODate(endDate),
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(
            payload?.error ?? (isEditMode ? "Failed to update task." : "Failed to save task.")
          );
        }

        const message = (isEditMode ? t.taskUpdated : t.taskCreated).replace("{{taskName}}", form.name.trim());
        showToast(message);

        if (onSubmitSuccess) {
          onSubmitSuccess();
        } else {
          router.push(`/calendar/${quarter.year}/${quarter.quarter}`);
        }
      } catch (saveError) {
        console.error(`Failed to ${isEditMode ? "update" : "save"} task`, saveError);
        setError(
          saveError instanceof Error
            ? saveError.message
            : `Failed to ${isEditMode ? "update" : "save"} task.`
        );
        setIsSaving(false);
      }
    },
    [form, isEditMode, taskId, quarter.quarter, quarter.year, router, validateForm, onSubmitSuccess, showToast, t.taskCreated, t.taskUpdated]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleReset = useCallback(() => {
    if (isEditMode && initialForm) {
      setForm(initialForm);
      setError(null);
    } else {
      setForm({
        name: "",
        start: defaultStart,
        end: defaultEnd,
      });
      setError(null);
    }
  }, [isEditMode, initialForm, defaultStart, defaultEnd]);

  return {
    form,
    error,
    loadError,
    isSaving,
    handleChange,
    handleSubmit,
    handleCancel,
    handleReset,
    isEditMode,
  };
}

