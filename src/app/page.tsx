import { redirect } from "next/navigation";
import { getQuarterFromDate } from "@/lib/quarter";

export default function Home() {
  const { year, quarter } = getQuarterFromDate(new Date());
  redirect(`/calendar/${year}/${quarter}`);
}
