import { useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function useDragAndDrop(
  onMoveSubtask?: (payload: { taskId: string; subtaskId: string; isoDate: string }) => void,
) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    const activeData = active.data.current as
      | { type: "subtask"; taskId: string; subtaskId: string }
      | null
      | undefined;
    const overData = over.data.current as { type: "day"; isoDate: string } | null | undefined;

    if (!activeData || !overData || activeData.type !== "subtask" || overData.type !== "day") {
      return;
    }

    if (onMoveSubtask) {
      onMoveSubtask({
        taskId: activeData.taskId,
        subtaskId: activeData.subtaskId,
        isoDate: overData.isoDate,
      });
    }
  };

  return {
    sensors,
    handleDragEnd,
  };
}

