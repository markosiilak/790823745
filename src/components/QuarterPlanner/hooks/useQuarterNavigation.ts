'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuarterKey, shiftQuarter } from "@/lib/quarter";

export function useQuarterNavigation(initialQuarter: QuarterKey) {
  const router = useRouter();
  const [currentQuarter, setCurrentQuarter] = useState<QuarterKey>(initialQuarter);

  useEffect(() => {
    setCurrentQuarter(initialQuarter);
  }, [initialQuarter]);

  const handleShiftQuarter = useCallback(
    (delta: number) => {
      const nextQuarter = shiftQuarter(currentQuarter, delta);
      setCurrentQuarter(nextQuarter);
      router.push(`/calendar/${nextQuarter.year}/${nextQuarter.quarter}`);
    },
    [currentQuarter, router],
  );

  const navigateToEditTask = useCallback(
    (taskId: string) => {
      router.push(`/calendar/${currentQuarter.year}/${currentQuarter.quarter}/tasks/${taskId}/edit`);
    },
    [currentQuarter.quarter, currentQuarter.year, router],
  );

  const navigateToAddTask = useCallback(() => {
    router.push(`/calendar/${currentQuarter.year}/${currentQuarter.quarter}/tasks/new`);
  }, [currentQuarter.quarter, currentQuarter.year, router]);

  return {
    currentQuarter,
    handleShiftQuarter,
    navigateToEditTask,
    navigateToAddTask,
  };
}

