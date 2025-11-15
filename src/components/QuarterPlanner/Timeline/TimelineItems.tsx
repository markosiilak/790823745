import { useMemo } from 'react';
import { TimelineRow, TimelineItem, TimelineItemLabel } from './styles';
import { WeekInfo, DateInfo } from '@/lib/quarter';
import type { Task, Subtask } from '@/components/QuarterPlanner/types';

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

interface TimelineItemsProps {
  tasks: ParsedTask[];
  structure: { dates: DateInfo[] };
  timelineStart: Date;
  timelineEnd: Date;
  dateWidth: number;
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

// Calculate position and width of a task item on the timeline based on dates
function calculateItemPosition(
  task: ParsedTask,
  timelineStart: Date,
  dateWidth: number,
  dates: DateInfo[],
): { left: number; width: number } {
  const taskStart = task.startDate.getTime();
  const taskEnd = task.endDate.getTime() + 24 * 60 * 60 * 1000 - 1; // End of day
  const timelineStartTime = timelineStart.getTime();

  // Find the first date that overlaps with the task
  let firstDateIndex = -1;
  for (let i = 0; i < dates.length; i++) {
    const dateInfo = dates[i];
    const dateTime = dateInfo.date.getTime();
    const dateEndTime = dateTime + 24 * 60 * 60 * 1000 - 1;
    if (dateEndTime >= taskStart && dateTime <= taskEnd) {
      firstDateIndex = i;
      break;
    }
  }

  if (firstDateIndex === -1) {
    return { left: 0, width: 0 };
  }

  // Calculate left position - where task starts relative to the first date
  const firstDate = dates[firstDateIndex];
  const firstDateStartTime = firstDate.date.getTime();
  
  // Clamp task start to date boundaries
  const effectiveTaskStart = Math.max(taskStart, firstDateStartTime);
  const left = firstDateIndex * dateWidth;

  // Calculate width - find last date and calculate total duration
  let lastDateIndex = firstDateIndex;
  for (let i = firstDateIndex; i < dates.length; i++) {
    const dateInfo = dates[i];
    const dateTime = dateInfo.date.getTime();
    const dateEndTime = dateTime + 24 * 60 * 60 * 1000 - 1;
    if (dateTime <= taskEnd && dateEndTime >= taskStart) {
      lastDateIndex = i;
    } else if (dateTime > taskEnd) {
      break;
    }
  }

  // Calculate width based on number of dates the task spans
  const dateCount = lastDateIndex - firstDateIndex + 1;
  const width = dateCount * dateWidth;

  return { left: Math.max(0, left), width: Math.max(dateWidth, width) };
}

export function TimelineItems({
  tasks,
  structure,
  timelineStart,
  timelineEnd,
  dateWidth,
  totalWidth,
  onEditTask,
  onAddSubtask,
  onEditSubtask,
}: TimelineItemsProps) {
  const itemsWithPositions = useMemo(() => {
    return tasks.map((task) => {
      const position = calculateItemPosition(task, timelineStart, dateWidth, structure.dates);
      return {
        task,
        ...position,
      };
    });
  }, [tasks, timelineStart, dateWidth, structure.dates]);

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

