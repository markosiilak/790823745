'use client';

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { QuarterStructure, WeekInfo } from '@/lib/quarter';
import { Task } from '@/components/QuarterPlanner/types';
import { parseISODate } from '@/lib/quarter';
import { useTranslations } from '@/lib/translations';
import { TimelineWrapper, TimelineContainer, TimelineSidebar, TimelineCanvas, TimelineHeader, TimelineLoadingContainer, TimelineLoadingText } from './styles';
import { TimelineTimeHeader } from './TimelineTimeHeader';
import { TimelineItems } from './TimelineItems';
import { TimelineSidebarContent } from './TimelineSidebarContent';
import { ProgressBar } from '@/components/shared/ProgressBar';

/**
 * Timeline component displays a timeline view of the quarter structure and tasks.
 * It includes a sidebar for task management and a canvas for the timeline.
 * The timeline is displayed as a series of dates, with tasks occupying the dates they overlap with.
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
  const hasScrolledToCurrentDate = useRef(false);

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
    if (structure.dates.length === 0) return new Date();
    return structure.dates[0].date;
  }, [structure.dates]);

  const timelineEnd = useMemo(() => {
    if (structure.dates.length === 0) return new Date();
    const lastDate = structure.dates[structure.dates.length - 1];
    return new Date(lastDate.date.getTime() + 24 * 60 * 60 * 1000);
  }, [structure.dates]);

  // Calculate pixel width for time units (dates)
  const dateWidth = useMemo(() => {
    return 30 * zoom; // Base width of 30px per date, scaled by zoom
  }, [zoom]);

  const totalWidth = useMemo(() => {
    return structure.dates.length * dateWidth;
  }, [structure.dates.length, dateWidth]);

  // Find current date index and scroll to it on mount
  const currentDateIndex = useMemo(() => {
    if (structure.dates.length === 0) return -1;
    
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    
    return structure.dates.findIndex((dateInfo) => {
      const date = dateInfo.date;
      return (
        date.getFullYear() === todayYear &&
        date.getMonth() === todayMonth &&
        date.getDate() === todayDate
      );
    });
  }, [structure.dates]);

  // Scroll to current date on mount or when dates/zoom change
  useEffect(() => {
    // Only auto-scroll once on initial load, or when quarter changes
    if (currentDateIndex >= 0 && !hasScrolledToCurrentDate.current) {
      // Use multiple requestAnimationFrame calls and setTimeout fallback to ensure DOM is fully rendered
      const scrollToCurrentDate = () => {
        if (canvasRef.current && canvasRef.current.clientWidth > 0) {
          // Calculate scroll position to center the current date
          const targetScrollLeft = currentDateIndex * dateWidth;
          const viewportWidth = canvasRef.current.clientWidth;
          const centeredScrollLeft = Math.max(0, targetScrollLeft - viewportWidth / 2 + dateWidth / 2);
          
          canvasRef.current.scrollLeft = centeredScrollLeft;
          setScrollLeft(centeredScrollLeft);
          hasScrolledToCurrentDate.current = true;
        } else {
          // Retry if canvas isn't ready yet
          requestAnimationFrame(scrollToCurrentDate);
        }
      };
      
      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToCurrentDate);
      });
      
      // Fallback timeout in case requestAnimationFrame doesn't work
      const timeoutId = setTimeout(() => {
        if (!hasScrolledToCurrentDate.current && canvasRef.current) {
          scrollToCurrentDate();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentDateIndex, dateWidth, structure.dates.length]);

  // Reset scroll flag when quarter changes (structure.dates changes)
  useEffect(() => {
    hasScrolledToCurrentDate.current = false;
  }, [structure.year, structure.quarter]);

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
              dateWidth={dateWidth}
              onAddSubtaskForWeek={onAddSubtaskForWeek}
              parsedTasks={parsedTasks}
            />
          </TimelineHeader>
          <TimelineItems
            tasks={parsedTasks}
            structure={structure}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
            dateWidth={dateWidth}
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

