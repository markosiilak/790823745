'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { QuarterStructure, WeekInfo } from '@/lib/quarter';
import { Task } from '@/components/QuarterPlanner/types';
import { parseISODate, weekOverlapsRange } from '@/lib/quarter';
import { useTranslations } from '@/lib/translations';
import { TimelineWrapper, TimelineContainer, TimelineSidebar, TimelineCanvas, TimelineHeader, TimelineLoadingContainer, TimelineLoadingText } from './styles';
import { TimelineTimeHeader } from './TimelineTimeHeader';
import { TimelineItems } from './TimelineItems';
import { TimelineSidebarContent } from './TimelineSidebarContent';
import { ProgressBar } from '@/components/shared/ProgressBar';

/**
 * Timeline component displays a timeline view of the quarter structure and tasks.
 * It includes a sidebar for task management and a canvas for the timeline.
 * The timeline is displayed as a series of weeks, with tasks occupying the weeks they overlap with.
 * The timeline is scrollable and zoomable.
 * The timeline is synchronized with the sidebar, so that scrolling the sidebar scrolls the canvas and vice versa.
 * The timeline is zoomable with the mouse wheel and modifier keys.
 * The timeline is responsive and adapts to the screen size.
 */

interface TimelineProps {
  structure: QuarterStructure;
  tasks: Task[];
  isLoading?: boolean;
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, taskName: string, week: WeekInfo) => void;
  onAddSubtaskForWeek: (week: WeekInfo, candidateTaskIds: string[]) => void;
  onEditSubtask: (
    taskId: string,
    taskName: string,
    subtaskId: string,
    subtaskTitle: string,
    subtaskTimestamp: string,
    week: WeekInfo,
  ) => void;
}

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

export function Timeline({
  structure,
  tasks,
  isLoading = false,
  onRemoveTask,
  onEditTask,
  onAddSubtask,
  onAddSubtaskForWeek,
  onEditSubtask,
}: TimelineProps) {
  const t = useTranslations('quarterTable');
  const canvasRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [zoom, setZoom] = useState(1);

  const parsedTasks = useMemo<ParsedTask[]>(
    () =>
      tasks.map((task) => ({
        ...task,
        startDate: parseISODate(task.start),
        endDate: parseISODate(task.end),
      })),
    [tasks],
  );

  // Calculate timeline bounds
  const timelineStart = useMemo(() => {
    if (structure.weeks.length === 0) return new Date();
    return structure.weeks[0].start;
  }, [structure.weeks]);

  const timelineEnd = useMemo(() => {
    if (structure.weeks.length === 0) return new Date();
    const lastWeek = structure.weeks[structure.weeks.length - 1];
    return new Date(lastWeek.end.getTime() + 24 * 60 * 60 * 1000);
  }, [structure.weeks]);

  // Calculate pixel width for time units (weeks)
  const weekWidth = useMemo(() => {
    return 90 * zoom; // Base width of 90px per week, scaled by zoom
  }, [zoom]);

  const totalWidth = useMemo(() => {
    return structure.weeks.length * weekWidth;
  }, [structure.weeks.length, weekWidth]);

  // Handle scroll synchronization between canvas and sidebar
  const handleCanvasScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollLeft(e.currentTarget.scrollLeft);
    // Sync sidebar vertical scroll with canvas
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = scrollTop;
    }
  }, []);

  const handleSidebarScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Sync canvas vertical scroll with sidebar
    if (canvasRef.current) {
      canvasRef.current.scrollTop = scrollTop;
    }
  }, []);

  // Handle zoom with mouse wheel + modifier keys
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
      } else if (e.shiftKey) {
        e.preventDefault();
        if (canvasRef.current) {
          canvasRef.current.scrollLeft += e.deltaY;
        }
      }
    },
    [],
  );

  if (isLoading) {
    return (
      <TimelineWrapper>
        <TimelineLoadingContainer>
          <ProgressBar />
          <TimelineLoadingText>{t.loadingTimeline}</TimelineLoadingText>
        </TimelineLoadingContainer>
      </TimelineWrapper>
    );
  }

  return (
    <TimelineWrapper>
      <TimelineContainer>
        <TimelineSidebar ref={sidebarRef} onScroll={handleSidebarScroll}>
          <TimelineSidebarContent
            tasks={parsedTasks}
            onEditTask={onEditTask}
            onRemoveTask={onRemoveTask}
          />
        </TimelineSidebar>
        <TimelineCanvas
          ref={canvasRef}
          onScroll={handleCanvasScroll}
          onWheel={handleWheel}
        >
          <TimelineHeader style={{ width: `${totalWidth}px` }}>
            <TimelineTimeHeader
              structure={structure}
              weekWidth={weekWidth}
              onAddSubtaskForWeek={onAddSubtaskForWeek}
              parsedTasks={parsedTasks}
            />
          </TimelineHeader>
          <TimelineItems
            tasks={parsedTasks}
            structure={structure}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
            weekWidth={weekWidth}
            totalWidth={totalWidth}
            onEditTask={onEditTask}
            onAddSubtask={onAddSubtask}
            onEditSubtask={onEditSubtask}
          />
        </TimelineCanvas>
      </TimelineContainer>
    </TimelineWrapper>
  );
}

