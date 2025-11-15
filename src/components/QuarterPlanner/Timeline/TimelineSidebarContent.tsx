import { EditIcon } from '@/components/icons/EditIcon';
import { RemoveIcon } from '@/components/icons/RemoveIcon';
import { SidebarRow, SidebarTaskName, SidebarActions } from './styles';
import { EditButton, RemoveButton } from '@/components/QuarterPlanner/styles/quarterTableStyles';
import type { Task } from '@/components/QuarterPlanner/types';

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

interface TimelineSidebarContentProps {
  tasks: ParsedTask[];
  onEditTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export function TimelineSidebarContent({
  tasks,
  onEditTask,
  onRemoveTask,
}: TimelineSidebarContentProps) {
  return (
    <>
      {tasks.map((task) => (
        <SidebarRow key={task.id}>
          <SidebarTaskName>{task.name}</SidebarTaskName>
          <SidebarActions>
            <EditButton
              type="button"
              onClick={() => onEditTask(task.id)}
              aria-label={`Edit ${task.name}`}
            >
              <EditIcon />
            </EditButton>
            <RemoveButton
              type="button"
              onClick={() => onRemoveTask(task.id)}
              aria-label={`Remove ${task.name}`}
            >
              <RemoveIcon />
            </RemoveButton>
          </SidebarActions>
        </SidebarRow>
      ))}
    </>
  );
}

