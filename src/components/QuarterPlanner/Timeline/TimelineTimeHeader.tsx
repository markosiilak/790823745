import { formatISODate } from '@/lib/quarter';
import { useTranslations } from '@/lib/translations';
import { Tooltip } from '@/components/Tooltip';
import { TimeHeaderRow, TimeHeaderCell, TimeHeaderMonth } from './styles';
import { AddWeekButton, WeekHeaderContent, WeekHeaderLabel } from '@/components/QuarterPlanner/styles/quarterTableStyles';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { weekFormatter } from './constants';
import { weekOverlapsRange } from '@/lib/quarter';
import type { QuarterStructure, WeekInfo } from '@/lib/quarter';

type ParsedTask = {
  id: string;
  startDate: Date;
  endDate: Date;
};

interface TimelineTimeHeaderProps {
  structure: QuarterStructure;
  weekWidth: number;
  onAddSubtaskForWeek?: (week: WeekInfo, candidateTaskIds: string[]) => void;
  parsedTasks: ParsedTask[];
}

export function TimelineTimeHeader({
  structure,
  weekWidth,
  onAddSubtaskForWeek,
  parsedTasks,
}: TimelineTimeHeaderProps) {
  const t = useTranslations('quarterTable');

  return (
    <>
      {/* Month header row */}
      <TimeHeaderRow>
        {structure.months.map((month) => (
          <TimeHeaderMonth
            key={month.month}
            $width={month.weeks.length * weekWidth}
          >
            {month.name}
          </TimeHeaderMonth>
        ))}
      </TimeHeaderRow>
      {/* Week header row */}
      <TimeHeaderRow>
        {structure.weeks.map((week) => {
          const weekStartKey = formatISODate(week.start);
          const rangeLabel = `${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`;
          const weekTasks = parsedTasks.filter((task) =>
            weekOverlapsRange(week, task.startDate, task.endDate),
          );
          const canAddForWeek = weekTasks.length > 0;

          return (
            <Tooltip key={weekStartKey} content={rangeLabel}>
              <TimeHeaderCell $width={weekWidth}>
                <WeekHeaderContent>
                  <WeekHeaderLabel>{`W${week.isoWeek}`}</WeekHeaderLabel>
                  {canAddForWeek ? (
                    <AddWeekButton
                      type="button"
                      aria-label={`${t.addSubtaskInWeek} ${week.isoWeek}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onAddSubtaskForWeek?.(
                          week,
                          weekTasks.map((task) => task.id),
                        );
                      }}
                      >
                        <PlusIcon />
                      </AddWeekButton>
                  ) : null}
                </WeekHeaderContent>
              </TimeHeaderCell>
            </Tooltip>
          );
        })}
      </TimeHeaderRow>
    </>
  );
}

