import { notFound } from "next/navigation";
import { use } from "react";
import { TaskEdit } from "@/components/QuarterPlanner/TaskEdit";

type EditTaskPageProps = {
  params: Promise<{
    year: string;
    quarter: string;
    taskId: string;
  }>;
};

function parseParams(yearParam: string, quarterParam: string) {
  const year = Number(yearParam);
  const quarter = Number(quarterParam);

  if (!Number.isInteger(year) || !Number.isInteger(quarter)) {
    return null;
  }

  if (quarter < 1 || quarter > 4) {
    return null;
  }

  return { year, quarter };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const resolvedParams = use(params);
  const parsed = parseParams(resolvedParams.year, resolvedParams.quarter);

  if (!parsed || typeof resolvedParams.taskId !== "string") {
    notFound();
  }

  return <TaskEdit quarter={parsed} taskId={resolvedParams.taskId} />;
}


