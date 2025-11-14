import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { formatISODate, parseISODate } from "@/lib/quarter";
import { createStoredSubtask, normalizeSubtask, validateTaskPayload } from "@/lib/task-utils";
import type { Subtask } from "@/components/QuarterPlanner/types";

export type StoredSubtask = {
  id?: string;
  title?: string;
  timestamp?: string;
};

export type StoredTask = {
  id?: string;
  name?: string;
  start?: string;
  end?: string;
  durationDays?: number;
  subtasks?: StoredSubtask[];
};

const tasksFile = path.join(process.cwd(), "src", "data", "tasks.json");

export async function readTasks(): Promise<StoredTask[]> {
  try {
    const content = await fs.readFile(tasksFile, "utf-8");
    return JSON.parse(content) as StoredTask[];
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeTasks(tasks: StoredTask[]) {
  await fs.writeFile(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`, "utf-8");
}

export async function GET() {
  try {
    const tasks = await readTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to read tasks.json", error);
    return NextResponse.json({ error: "Failed to read tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as StoredTask;
    const validated = validateTaskPayload(payload);

    if (!validated) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const startISO = formatISODate(parseISODate(validated.start));
    const endISO = formatISODate(parseISODate(validated.end));
    const tasks = await readTasks();
    const duplicate = tasks.some(
      (task) => task.name === validated.name && task.start === startISO && task.end === endISO,
    );

    if (duplicate) {
      return NextResponse.json({ error: "Task already exists" }, { status: 409 });
    }

    const newTask: StoredTask = {
      id: payload.id ?? crypto.randomUUID(),
      name: validated.name.trim(),
      start: startISO,
      end: endISO,
      subtasks: Array.isArray(payload.subtasks)
        ? payload.subtasks
            .map(normalizeSubtask)
            .filter((subtask): subtask is Subtask => subtask !== null)
            .map((subtask) => createStoredSubtask(subtask))
        : [],
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Failed to write tasks.json", error);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as StoredTask;
    const validated = validateTaskPayload(payload, true);

    if (!validated || !validated.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === validated.id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const startISO = formatISODate(parseISODate(validated.start));
    const endISO = formatISODate(parseISODate(validated.end));

    const updatedTask: StoredTask = {
      ...tasks[taskIndex],
      id: validated.id,
      name: validated.name.trim(),
      start: startISO,
      end: endISO,
      subtasks: Array.isArray(payload.subtasks)
        ? payload.subtasks
            .map(normalizeSubtask)
            .filter((subtask): subtask is Subtask => subtask !== null)
            .map((subtask) => createStoredSubtask(subtask))
        : Array.isArray(tasks[taskIndex].subtasks)
          ? tasks[taskIndex].subtasks
          : [],
    };

    const conflict = tasks.some(
      (task, index) =>
        index !== taskIndex &&
        task.name === updatedTask.name &&
        task.start === updatedTask.start &&
        task.end === updatedTask.end,
    );

    if (conflict) {
      return NextResponse.json({ error: "Another task already uses these details" }, { status: 409 });
    }

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Failed to update tasks.json", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}


