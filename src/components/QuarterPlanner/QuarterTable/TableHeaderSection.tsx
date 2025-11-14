import { useTranslations } from "@/lib/translations";
import { Dropdown, type DropdownOption } from "@/components/QuarterPlanner/Dropdown";
import {
  TableHeader,
  Subtitle,
  TableActions,
  ViewControls,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import type { ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";

type TableHeaderSectionProps = {
  viewMode: ViewMode;
  effectiveSelectedWeekKey: string | null;
  viewModeOptions: DropdownOption[];
  weekDropdownOptions: DropdownOption[];
  onViewModeChange: (value: string, activeWeekKeys: string[], firstActiveWeekKey: string | null) => void;
  onWeekChange: (value: string) => void;
  activeWeekKeys: string[];
  firstActiveWeekKey: string | null;
};

export function TableHeaderSection({
  viewMode,
  effectiveSelectedWeekKey,
  viewModeOptions,
  weekDropdownOptions,
  onViewModeChange,
  onWeekChange,
  activeWeekKeys,
  firstActiveWeekKey,
}: TableHeaderSectionProps) {
  const t = useTranslations("quarterTable");

  return (
    <TableHeader>
      <div>
        <h2>{t.title}</h2>
        <Subtitle>{t.subtitle}</Subtitle>
      </div>
      <TableActions>
        <ViewControls>
          <Dropdown
            options={viewModeOptions}
            value={viewMode}
            onChange={(nextValue: string) => onViewModeChange(nextValue, activeWeekKeys, firstActiveWeekKey)}
            ariaLabel={t.tableViewMode}
            width="220px"
          />
          {viewMode === "single-week" ? (
            <Dropdown
              options={weekDropdownOptions}
              value={effectiveSelectedWeekKey}
              onChange={onWeekChange}
              ariaLabel={t.selectWeek}
              width="260px"
              disabled={weekDropdownOptions.length === 0}
              placeholder={t.noWeeks}
            />
          ) : null}
        </ViewControls>
      </TableActions>
    </TableHeader>
  );
}

