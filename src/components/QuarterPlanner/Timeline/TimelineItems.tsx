import { useMemo } from 'react';
import { TimelineRow, TimelineItem, TimelineItemLabel } from './styles';
import { WeekInfo } from '@/lib/quarter';
import type { Task, Subtask } from '@/components/QuarterPlanner/types';

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

interface TimelineItemsProps {
  tasks: ParsedTask[];
  structure: { weeks: WeekInfo[] };
  timelineStart: Date;
  timelineEnd: Date;
  weekWidth: number;
  totalWidth: number;
  onEditTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, taskName: string, week: WeekInfo) => void;
  onEditSubtask: (
    taskId: string,
    taskName: string,
    subtaskId: string,
    subtaskTitle: string,
    subtaskTimestamp: string,
    week: WeekInfo,
  ) => void;
}

// Calculate position and width of a task item on the timeline
function calculateItemPosition(
  task: ParsedTask,
  timelineStart: Date,
  weekWidth: number,
  weeks: WeekInfo[],
): { left: number; width: number } {
  const taskStart = task.startDate.getTime();
  const taskEnd = task.endDate.getTime() + 24 * 60 * 60 * 1000 - 1; // End of day
  const timelineStartTime = timelineStart.getTime();

  // Find the first week that overlaps with the task
  let firstWeekIndex = -1;
  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];
    const weekStart = week.start.getTime();
    const weekEnd = week.end.getTime() + 24 * 60 * 60 * 1000 - 1;
    if (weekEnd >= taskStart && weekStart <= taskEnd) {
      firstWeekIndex = i;
      break;
    }
  }

  if (firstWeekIndex === -1) {
    return { left: 0, width: 0 };
  }

  // Calculate left position - where task starts relative to the first week
  const firstWeek = weeks[firstWeekIndex];
  const weekStartTime = firstWeek.start.getTime();
  const weekEndTime = firstWeek.end.getTime() + 24 * 60 * 60 * 1000 - 1;
  
  // Clamp task start to week boundaries
  const effectiveTaskStart = Math.max(taskStart, weekStartTime);
  const daysIntoWeek = Math.max(0, (effectiveTaskStart - weekStartTime) / (24 * 60 * 60 * 1000));
  const left = firstWeekIndex * weekWidth + (daysIntoWeek / 7) * weekWidth;

  // Calculate width - find last week and calculate total duration
  let lastWeekIndex = firstWeekIndex;
  for (let i = firstWeekIndex; i < weeks.length; i++) {
    const week = weeks[i];
    const weekStart = week.start.getTime();
    const weekEnd = week.end.getTime() + 24 * 60 * 60 * 1000 - 1;
    if (weekStart <= taskEnd && weekEnd >= taskStart) {
      lastWeekIndex = i;
    } else if (weekStart > taskEnd) {
      break;
    }
  }

  // Calculate width based on task end relative to last week
  const lastWeek = weeks[lastWeekIndex];
  const lastWeekStartTime = lastWeek.start.getTime();
  const effectiveTaskEnd = Math.min(taskEnd, lastWeek.end.getTime() + 24 * 60 * 60 * 1000 - 1);
  const daysFromLastWeekStart = Math.max(0, (effectiveTaskEnd - lastWeekStartTime) / (24 * 60 * 60 * 1000));
  const daysInLastWeek = Math.min(7, daysFromLastWeekStart + 1);
  
  const width = (lastWeekIndex - firstWeekIndex) * weekWidth + (daysInLastWeek / 7) * weekWidth;

  return { left: Math.max(0, left), width: Math.max(weekWidth / 7, width) };
}

export function TimelineItems({
  tasks,
  structure,
  timelineStart,
  timelineEnd,
  weekWidth,
  totalWidth,
  onEditTask,
  onAddSubtask,
  onEditSubtask,
}: TimelineItemsProps) {
  const itemsWithPositions = useMemo(() => {
    return tasks.map((task) => {
      const position = calculateItemPosition(task, timelineStart, weekWidth, structure.weeks);
      return {
        task,
        ...position,
      };
    });
  }, [tasks, timelineStart, weekWidth, structure.weeks]);

  return (
    <div style={{ position: 'relative', width: `${totalWidth}px`, minHeight: '100%' }}>
      {itemsWithPositions.map(({ task, left, width }, index) => (
        <TimelineRow key={task.id} style={{ zIndex: 1, position: 'relative' }}>
          <TimelineItem
            $left={left}
            $width={width}
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onEditTask(task.id);
              }
            }}
            aria-label={`Edit task: ${task.name}`}
          >
            <TimelineItemLabel>{task.name}</TimelineItemLabel>
          </TimelineItem>
        </TimelineRow>
      ))}
      {/* Empty rows to match sidebar if needed */}
      {tasks.length === 0 && (
        <TimelineRow>
          <div style={{ padding: '1rem', color: '#999', textAlign: 'center', width: '100%' }}>
            No tasks
          </div>
        </TimelineRow>
      )}
    </div>
  );
}

