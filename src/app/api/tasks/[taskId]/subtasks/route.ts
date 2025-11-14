import { NextResponse } from "next/server";
import { readTasks, StoredSubtask, StoredTask, writeTasks } from "../../route";
import { parseDateTime } from "@/lib/task-utils";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { taskId } = await context.params;

  if (typeof taskId !== "string" || taskId.length === 0) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as {
      title?: string;
      date?: string;
      time?: string;
    };

    if (typeof payload.title !== "string" || typeof payload.date !== "string" || typeof payload.time !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const timestampISO = parseDateTime(payload.date, payload.time);
    if (!timestampISO) {
      return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const nextSubtask: StoredSubtask = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      timestamp: timestampISO,
    };

    const currentTask: StoredTask = tasks[taskIndex];
    const currentSubtasks = Array.isArray(currentTask.subtasks) ? currentTask.subtasks : [];

    tasks[taskIndex] = {
      ...currentTask,
      subtasks: [...currentSubtasks, nextSubtask],
    };

    await writeTasks(tasks);

    return NextResponse.json(nextSubtask, { status: 201 });
  } catch (error) {
    console.error("Failed to add subtask", error);
    return NextResponse.json({ error: "Failed to add subtask" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { taskId } = await context.params;

  if (typeof taskId !== "string" || taskId.length === 0) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as {
      subtaskId?: string;
      title?: string;
      date?: string;
      time?: string;
    };

    if (
      typeof payload.subtaskId !== "string" ||
      typeof payload.title !== "string" ||
      typeof payload.date !== "string" ||
      typeof payload.time !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const timestampISO = parseDateTime(payload.date, payload.time);
    if (!timestampISO) {
      return NextResponse.json({ error: "Invalid date or time" }, { status: 400 });
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const currentTask: StoredTask = tasks[taskIndex];
    const currentSubtasks = Array.isArray(currentTask.subtasks) ? currentTask.subtasks : [];
    const subtaskIndex = currentSubtasks.findIndex((subtask) => subtask.id === payload.subtaskId);

    if (subtaskIndex === -1) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }

    const updatedSubtask: StoredSubtask = {
      id: payload.subtaskId,
      title: payload.title.trim(),
      timestamp: timestampISO,
    };

    const updatedSubtasks = [...currentSubtasks];
    updatedSubtasks[subtaskIndex] = updatedSubtask;

    tasks[taskIndex] = {
      ...currentTask,
      subtasks: updatedSubtasks,
    };

    await writeTasks(tasks);

    return NextResponse.json(updatedSubtask);
  } catch (error) {
    console.error("Failed to update subtask", error);
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}


