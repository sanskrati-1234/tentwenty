 "use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Timesheet } from "@/types/timesheet";

type Props = {
  timesheets?: Timesheet[];
  loading?: boolean;
  onAction?: (timesheet?: Timesheet) => void;
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export default function TimesheetTable({
  timesheets = [],
  loading = false,
  onAction = () => {},
}: Props) {
  const actionLabel = (status: Timesheet["status"]) => {
    if (status === "missing") return "Create";
    if (status === "incomplete") return "Update";
    return "View";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Week #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <>
            {[...Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                <TableCell className="animate-pulse bg-gray-100">&nbsp;</TableCell>
                <TableCell className="animate-pulse bg-gray-100">&nbsp;</TableCell>
                <TableCell className="animate-pulse bg-gray-100">&nbsp;</TableCell>
                <TableCell className="animate-pulse bg-gray-100">&nbsp;</TableCell>
              </TableRow>
            ))}
          </>
        ) : timesheets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
              No timesheets found.
            </TableCell>
          </TableRow>
        ) : (
          timesheets.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.week}</TableCell>
              <TableCell>{formatDateRange(item.startDate, item.endDate)}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="link" className="px-0" onClick={() => onAction(item)}>
                  {actionLabel(item.status)}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
