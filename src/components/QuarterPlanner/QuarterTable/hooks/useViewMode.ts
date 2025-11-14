import { useMemo, useState } from "react";
import { QuarterStructure } from "@/lib/quarter";
import type { DropdownOption } from "@/components/QuarterPlanner/Dropdown";
import type { ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";
import { weekFormatter } from "@/components/QuarterPlanner/QuarterTable/constants";

export function useViewMode(structure: QuarterStructure, activeWeekKeys: string[]) {
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [selectedWeekKey, setSelectedWeekKey] = useState<string | null>(() => {
    const firstWeek = structure.weeks[0];
    return firstWeek ? firstWeek.start.toISOString() : null;
  });

  const firstActiveWeekKey = useMemo(() => {
    if (activeWeekKeys.length > 0) {
      return activeWeekKeys[0];
    }
    return structure.weeks[0]?.start.toISOString() ?? null;
  }, [activeWeekKeys, structure.weeks]);

  const effectiveSelectedWeekKey = useMemo(() => {
    if (structure.weeks.length === 0) {
      return null;
    }
    if (!selectedWeekKey) {
      return firstActiveWeekKey;
    }
    const exists = structure.weeks.some((week) => week.start.toISOString() === selectedWeekKey);
    return exists ? selectedWeekKey : firstActiveWeekKey;
  }, [firstActiveWeekKey, selectedWeekKey, structure.weeks]);

  const viewModeOptions = useMemo<DropdownOption[]>(
    () => [
      { value: "standard", label: "Full quarter · standard" },
      { value: "compact", label: "Full quarter · compact" },
      { value: "single-week", label: "Single week" },
    ],
    [],
  );

  const weekDropdownOptions = useMemo<DropdownOption[]>(
    () =>
      structure.weeks.map((week) => ({
        value: week.start.toISOString(),
        label: `W${week.isoWeek} · ${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`,
        disabled: activeWeekKeys.length > 0 && !activeWeekKeys.includes(week.start.toISOString()),
      })),
    [activeWeekKeys, structure.weeks],
  );

  const handleViewModeChange = (nextValue: string, activeWeekKeys: string[], firstActiveWeekKey: string | null) => {
    const nextMode = nextValue as ViewMode;
    setViewMode(nextMode);
    if (nextMode !== "single-week") {
      return;
    }
    setSelectedWeekKey((current) => {
      if (
        current &&
        structure.weeks.some((week) => week.start.toISOString() === current) &&
        (activeWeekKeys.length === 0 || activeWeekKeys.includes(current))
      ) {
        return current;
      }
      return firstActiveWeekKey;
    });
  };

  return {
    viewMode,
    setViewMode: handleViewModeChange,
    selectedWeekKey,
    setSelectedWeekKey,
    effectiveSelectedWeekKey,
    viewModeOptions,
    weekDropdownOptions,
  };
}

