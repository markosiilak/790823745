import { notFound } from "next/navigation";
import { use } from "react";
import { TaskCreate } from "@/components/QuarterPlanner/TaskCreate";

type NewTaskPageProps = {
  params: Promise<{
    year: string;
    quarter: string;
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

export default function NewTaskPage({ params }: NewTaskPageProps) {
  const resolvedParams = use(params);
  const parsed = parseParams(resolvedParams.year, resolvedParams.quarter);

  if (!parsed) {
    notFound();
  }

  return <TaskCreate quarter={parsed} />;
}


