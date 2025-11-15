import { formatISODate, dateOverlapsRange } from '@/lib/quarter';
import { useTranslations } from '@/lib/translations';
import { Tooltip } from '@/components/Tooltip';
import { TimeHeaderRow, TimeHeaderCell, TimeHeaderMonth } from './styles';
import { AddWeekButton, WeekHeaderContent, WeekHeaderLabel } from '@/components/QuarterPlanner/styles/quarterTableStyles';
import { PlusIcon } from '@/lib/icons/PlusIcon';
import { dateFormatter } from './constants';
import type { QuarterStructure, WeekInfo, DateInfo } from '@/lib/quarter';

type ParsedTask = {
  id: string;
  startDate: Date;
  endDate: Date;
};

interface TimelineTimeHeaderProps {
  structure: QuarterStructure;
  dateWidth: number;
  onAddSubtaskForWeek?: (week: WeekInfo, candidateTaskIds: string[]) => void;
  parsedTasks: ParsedTask[];
}

export function TimelineTimeHeader({
  structure,
  dateWidth,
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
            $width={month.dates.length * dateWidth}
          >
            {month.name}
          </TimeHeaderMonth>
        ))}
      </TimeHeaderRow>
      {/* Date header row */}
      <TimeHeaderRow>
        {structure.dates.map((dateInfo, index) => {
          const dateKey = `date-${index}-${formatISODate(dateInfo.date)}`;
          const dateLabel = dateFormatter.format(dateInfo.date);
          const dateTasks = parsedTasks.filter((task) =>
            dateOverlapsRange(dateInfo.date, task.startDate, task.endDate),
          );
          const canAddForDate = dateTasks.length > 0;

          return (
            <Tooltip key={dateKey} content={dateLabel}>
              <TimeHeaderCell $width={dateWidth}>
                <WeekHeaderContent>
                  <WeekHeaderLabel>{dateInfo.day}</WeekHeaderLabel>
                  {canAddForDate ? (
                    <AddWeekButton
                      type="button"
                      aria-label={`${t.addSubtaskInWeek} ${dateLabel}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        // Convert date to week for backward compatibility with onAddSubtaskForWeek
                        // Find the week that contains this date
                        const containingWeek = structure.weeks.find((week) =>
                          dateOverlapsRange(dateInfo.date, week.start, week.end),
                        );
                        if (containingWeek && onAddSubtaskForWeek) {
                          onAddSubtaskForWeek?.(
                            containingWeek,
                            dateTasks.map((task) => task.id),
                          );
                        }
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

