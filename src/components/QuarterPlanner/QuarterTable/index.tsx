import { type QuarterStructure, type WeekInfo } from "@/lib/quarter";
import { type Task } from "@/components/QuarterPlanner/types";
import {
  Card,
  TableWrapper,
  StyledTable,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { useViewMode } from "@/components/QuarterPlanner/QuarterTable/hooks/useViewMode";
import { useTableData } from "@/components/QuarterPlanner/QuarterTable/hooks/useTableData";
import { TableHeaderSection } from "@/components/QuarterPlanner/QuarterTable/TableHeaderSection";
import { TableHead } from "@/components/QuarterPlanner/QuarterTable/TableHead";
import { TableBody } from "@/components/QuarterPlanner/QuarterTable/TableBody";
import { LoadingIndicator } from "@/components/QuarterPlanner/QuarterTable/LoadingIndicator";
import { LoadingWrapper } from "@/components/QuarterPlanner/QuarterTable/styles";
import { useMemo, type JSX } from "react";
import { type ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";

/**
 * Props for the QuarterTable component.
 */
interface QuarterTableProps {
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

/**
 * Main quarter table component that displays tasks in a weekly grid format.
 * Orchestrates view mode management, data processing, and table rendering.
 * Shows loading indicator while tasks are being fetched.
 * Supports three view modes: standard (full table), compact (condensed), and single-week.
 */
export function QuarterTable({
  structure,
  tasks,
  isLoading = false,
  onRemoveTask,
  onEditTask,
  onAddSubtask,
  onAddSubtaskForWeek,
  onEditSubtask,
}: QuarterTableProps): JSX.Element {
  const activeWeekKeysFromViewMode = useMemo<string[]>(() => [], []);

  const {
    viewMode,
    setViewMode,
    selectedWeekKey,
    setSelectedWeekKey,
    effectiveSelectedWeekKey,
    viewModeOptions,
    weekDropdownOptions,
  } = useViewMode(structure, activeWeekKeysFromViewMode);

  const { parsedTasks, activeWeekKeys: updatedActiveWeekKeys, weeksToRender, monthsToRender } =
    useTableData(tasks, structure, viewMode, effectiveSelectedWeekKey);

  const firstActiveWeekKey = useMemo<string | null>(() => {
    if (updatedActiveWeekKeys.length > 0) {
      return updatedActiveWeekKeys[0] ?? null;
    }
    return structure.weeks[0]?.start.toISOString() ?? null;
  }, [updatedActiveWeekKeys, structure.weeks]);

  const isCompact = useMemo<boolean>(() => viewMode === "compact", [viewMode]);

  const handleViewModeChange = useMemo(
    () => (value: string) => {
      setViewMode(value, updatedActiveWeekKeys, firstActiveWeekKey);
    },
    [setViewMode, updatedActiveWeekKeys, firstActiveWeekKey],
  );

  if (isLoading) {
    return (
      <Card>
        <LoadingWrapper>
          <LoadingIndicator />
        </LoadingWrapper>
      </Card>
    );
  }

  return (
    <Card>
      <TableHeaderSection
        viewMode={viewMode}
        effectiveSelectedWeekKey={effectiveSelectedWeekKey}
        viewModeOptions={viewModeOptions}
        weekDropdownOptions={weekDropdownOptions}
        onViewModeChange={handleViewModeChange}
        onWeekChange={setSelectedWeekKey}
        activeWeekKeys={updatedActiveWeekKeys}
        firstActiveWeekKey={firstActiveWeekKey}
      />
      <TableWrapper>
        <StyledTable $compact={isCompact}>
          <TableHead
            monthsToRender={monthsToRender}
            isCompact={isCompact}
            parsedTasks={parsedTasks}
            onAddSubtaskForWeek={onAddSubtaskForWeek}
          />
          <TableBody
            parsedTasks={parsedTasks}
            weeksToRender={weeksToRender}
            monthsToRender={monthsToRender}
            isCompact={isCompact}
            onEditTask={onEditTask}
            onRemoveTask={onRemoveTask}
            onAddSubtask={onAddSubtask}
            onEditSubtask={onEditSubtask}
          />
        </StyledTable>
      </TableWrapper>
    </Card>
  );
}

