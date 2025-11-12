import { notFound } from "next/navigation";
import { QuarterPlanner } from "@/components/QuarterPlanner";

type CalendarPageProps = {
  params: {
    year: string;
    quarter: string;
  };
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

export default function CalendarPage({ params }: CalendarPageProps) {
  const parsed = parseParams(params.year, params.quarter);

  if (!parsed) {
    notFound();
  }

  return <QuarterPlanner initialQuarter={parsed} />;
}


