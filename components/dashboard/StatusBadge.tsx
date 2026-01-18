import { Badge } from "@/components/ui/badge";
import { TimesheetStatus } from "@/types/timesheet";

const statusMap: Record<TimesheetStatus, string> = {
  completed: "bg-green-100 text-green-700",
  incomplete: "bg-yellow-100 text-yellow-700",
  missing: "bg-pink-100 text-pink-700",
};

export default function StatusBadge({ status }: { status: TimesheetStatus }) {
  return <Badge className={`${statusMap[status]} capitalize`}>{status}</Badge>;
}
