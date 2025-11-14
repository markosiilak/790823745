import { DndContext } from "@dnd-kit/core";
import { QuarterStructure, WeekInfo } from "@/lib/quarter";
import { Task } from "@/components/QuarterPlanner/types";
import {
  Card,
  TableWrapper,
  StyledTable,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { useViewMode } from "@/components/QuarterPlanner/QuarterTable/hooks/useViewMode";
import { useTableData } from "@/components/QuarterPlanner/QuarterTable/hooks/useTableData";
import { useDragAndDrop } from "@/components/QuarterPlanner/QuarterTable/hooks/useDragAndDrop";
import { TableHeaderSection } from "@/components/QuarterPlanner/QuarterTable/TableHeaderSection";
import { TableHead } from "@/components/QuarterPlanner/QuarterTable/TableHead";
import { TableBody } from "@/components/QuarterPlanner/QuarterTable/TableBody";

type QuarterTableProps = {
  structure: QuarterStructure;
  tasks: Task[];
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
  onMoveSubtask?: (payload: { taskId: string; subtaskId: string; isoDate: string }) => void;
};

export function QuarterTable({
  structure,
  tasks,
  onRemoveTask,
  onEditTask,
  onAddSubtask,
  onAddSubtaskForWeek,
  onEditSubtask,
  onMoveSubtask,
}: QuarterTableProps) {
  const {
    viewMode,
    setViewMode,
    selectedWeekKey,
    setSelectedWeekKey,
    effectiveSelectedWeekKey,
    viewModeOptions,
    weekDropdownOptions,
  } = useViewMode(structure, []);

  const { parsedTasks, activeWeekKeys: updatedActiveWeekKeys, weeksToRender, monthsToRender } =
    useTableData(tasks, structure, viewMode, effectiveSelectedWeekKey);

  const firstActiveWeekKey =
    updatedActiveWeekKeys.length > 0
      ? updatedActiveWeekKeys[0]
      : structure.weeks[0]?.start.toISOString() ?? null;

  const { sensors, handleDragEnd } = useDragAndDrop(onMoveSubtask);

  const isCompact = viewMode === "compact";

  return (
    <Card>
      <TableHeaderSection
        viewMode={viewMode}
        effectiveSelectedWeekKey={effectiveSelectedWeekKey}
        viewModeOptions={viewModeOptions}
        weekDropdownOptions={weekDropdownOptions}
        onViewModeChange={(value) => setViewMode(value, updatedActiveWeekKeys, firstActiveWeekKey)}
        onWeekChange={setSelectedWeekKey}
        activeWeekKeys={updatedActiveWeekKeys}
        firstActiveWeekKey={firstActiveWeekKey}
      />
      <TableWrapper>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
        </DndContext>
      </TableWrapper>
    </Card>
  );
}

