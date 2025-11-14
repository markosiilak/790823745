'use client';

import { useState, useCallback } from "react";
import { WeekInfo } from "@/lib/quarter";
import { Subtask } from "../types";

export type SubtaskDraft =
  | {
      mode: "task";
      taskId: string;
      taskName: string;
      week: WeekInfo;
      subtaskId?: string;
      initialTitle?: string;
      initialTimestamp?: string;
    }
  | {
      mode: "week";
      week: WeekInfo;
      taskOptions: Array<{ id: string; name: string }>;
    };

type UseSubtasksOptions = {
  onSubtaskCreated: (taskId: string, subtask: Subtask) => void;
  onSubtaskUpdated: (taskId: string, subtaskId: string, subtask: Subtask) => void;
};

export function useSubtasks({ onSubtaskCreated, onSubtaskUpdated }: UseSubtasksOptions) {
  const [subtaskDraft, setSubtaskDraft] = useState<SubtaskDraft | null>(null);
  const [subtaskError, setSubtaskError] = useState<string | null>(null);
  const [isSavingSubtask, setIsSavingSubtask] = useState(false);

  const openSubtaskDialog = useCallback((draft: SubtaskDraft) => {
    setSubtaskDraft(draft);
    setSubtaskError(null);
  }, []);

  const closeSubtaskDialog = useCallback(() => {
    setSubtaskDraft(null);
    setSubtaskError(null);
  }, []);

  const handleAddSubtask = useCallback(
    (taskId: string, taskName: string, week: WeekInfo) => {
      openSubtaskDialog({
        mode: "task",
        taskId,
        taskName,
        week,
      });
    },
    [openSubtaskDialog],
  );

  const handleAddSubtaskForWeek = useCallback(
    (week: WeekInfo, taskOptions: Array<{ id: string; name: string }>) => {
      if (taskOptions.length === 0) {
        return;
      }
      openSubtaskDialog({
        mode: "week",
        week,
        taskOptions,
      });
    },
    [openSubtaskDialog],
  );

  const handleEditSubtask = useCallback(
    (
      taskId: string,
      taskName: string,
      subtaskId: string,
      subtaskTitle: string,
      subtaskTimestamp: string,
      week: WeekInfo,
    ) => {
      openSubtaskDialog({
        mode: "task",
        taskId,
        taskName,
        week,
        subtaskId,
        initialTitle: subtaskTitle,
        initialTimestamp: subtaskTimestamp,
      });
    },
    [openSubtaskDialog],
  );

  const handleSubtaskSubmit = useCallback(
    async (taskId: string, payload: { title: string; date: string; time: string; subtaskId?: string }) => {
      setIsSavingSubtask(true);
      setSubtaskError(null);
      try {
        const isEdit = Boolean(payload.subtaskId);
        const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(isEdit && { subtaskId: payload.subtaskId }),
          }),
        });

        if (!response.ok) {
          const message = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(message?.error ?? (isEdit ? "Failed to update subtask." : "Failed to add subtask."));
        }

        const updated = (await response.json()) as Subtask;

        if (isEdit && payload.subtaskId) {
          onSubtaskUpdated(taskId, payload.subtaskId, updated);
        } else {
          onSubtaskCreated(taskId, updated);
        }

        closeSubtaskDialog();
      } catch (error) {
        console.error(`Failed to ${payload.subtaskId ? "update" : "create"} subtask`, error);
        setSubtaskError(
          error instanceof Error
            ? error.message
            : `Failed to ${payload.subtaskId ? "update" : "add"} subtask.`,
        );
      } finally {
        setIsSavingSubtask(false);
      }
    },
    [onSubtaskCreated, onSubtaskUpdated, closeSubtaskDialog],
  );

  return {
    subtaskDraft,
    subtaskError,
    isSavingSubtask,
    handleAddSubtask,
    handleAddSubtaskForWeek,
    handleEditSubtask,
    handleSubtaskSubmit,
    closeSubtaskDialog,
  };
}

