import { StoredSubtask, StoredTask } from "@/app/api/tasks/route";
import { Subtask, Task } from "@/components/QuarterPlanner/types";
import { formatISODate, parseISODate } from "./quarter";

/**
 * Normalizes a stored subtask from the JSON file to a typed Subtask object.
 * Validates required fields (title, timestamp) and ensures data integrity.
 * Returns null if the subtask is invalid or missing required data.
 */
export function normalizeSubtask(subtask: StoredSubtask | null | undefined): Subtask | null {
  if (!subtask || typeof subtask.title !== "string" || typeof subtask.timestamp !== "string") {
    return null;
  }

  const timestamp = new Date(subtask.timestamp);
  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return {
    id: subtask.id ?? crypto.randomUUID(),
    title: subtask.title.trim() || "Untitled subtask",
    timestamp: timestamp.toISOString(),
  };
}

/**
 * Normalizes a stored task from the JSON file to a typed Task object.
 * Handles missing or invalid date fields by providing defaults.
 * Calculates end date from durationDays if end date is missing.
 * Normalizes all subtasks recursively.
 */
export function normalizeTask(rawTask: StoredTask): Task | null {
  if (typeof rawTask.name !== "string") {
    return null;
  }

  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const fallbackStart = formatISODate(base);

  const startISO = rawTask.start ? formatISODate(parseISODate(rawTask.start)) : fallbackStart;
  const startDate = parseISODate(startISO);

  const endISO = rawTask.end
    ? formatISODate(parseISODate(rawTask.end))
    : (() => {
        const end = new Date(startDate);
        const duration = Number(rawTask.durationDays) || 0;
        end.setDate(end.getDate() + Math.max(duration, 0));
        return formatISODate(end);
      })();

  return {
    id: rawTask.id ?? crypto.randomUUID(),
    name: rawTask.name.trim() ?? "Untitled Task",
    start: startISO,
    end: endISO,
    durationDays: rawTask.durationDays,
    subtasks: Array.isArray(rawTask.subtasks)
      ? rawTask.subtasks.map(normalizeSubtask).filter((subtask): subtask is Subtask => subtask !== null)
      : [],
  };
}

/**
 * Normalizes an array of stored tasks, filtering out invalid tasks and duplicates.
 * Uses a combination of name, start date, and end date to detect duplicates.
 */
export function normalizeTasks(rawTasks: StoredTask[]): Task[] {
  const seen = new Set<string>();

  return rawTasks
    .map(normalizeTask)
    .filter((task): task is Task => {
      if (!task) return false;
      const key = `${task.name}-${task.start}-${task.end}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/**
 * Creates a StoredSubtask object from a subtask input for persistence.
 * Generates a UUID if no ID is provided.
 * Trims whitespace from the title.
 */
export function createStoredSubtask(subtask: {
  id?: string;
  title: string;
  timestamp: string;
}): StoredSubtask {
  return {
    id: subtask.id ?? crypto.randomUUID(),
    title: subtask.title.trim(),
    timestamp: subtask.timestamp,
  };
}

/**
 * Validates and normalizes subtask input from an API request payload.
 * Ensures title and timestamp are valid strings and that timestamp is a valid date.
 * Returns null if validation fails.
 */
export function validateSubtaskPayload(payload: {
  title?: string;
  timestamp?: string;
}): { title: string; timestamp: string } | null {
  if (typeof payload.title !== "string" || typeof payload.timestamp !== "string") {
    return null;
  }

  const timestamp = new Date(payload.timestamp);
  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return {
    title: payload.title.trim(),
    timestamp: timestamp.toISOString(),
  };
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:mm) into an ISO timestamp.
 * Validates that the resulting timestamp is a valid date.
 */
export function parseDateTime(date: string, time: string): string | null {
  const timestampCandidate = new Date(`${date}T${time}`);
  if (Number.isNaN(timestampCandidate.getTime())) {
    return null;
  }
  return timestampCandidate.toISOString();
}

/**
 * Validates a task payload from an API request.
 * Ensures required fields (name, start, end) are present and valid strings.
 * Optionally requires an ID field for update operations.
 */
export function validateTaskPayload(
  payload: unknown,
  requireId = false,
): { id?: string; name: string; start: string; end: string } | null {
  const task = payload as StoredTask;

  if (requireId && typeof task.id !== "string") {
    return null;
  }

  if (
    typeof task.name !== "string" ||
    typeof task.start !== "string" ||
    typeof task.end !== "string"
  ) {
    return null;
  }

  return {
    ...(requireId && { id: task.id }),
    name: task.name,
    start: task.start,
    end: task.end,
  };
}

