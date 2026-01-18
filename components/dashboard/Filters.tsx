"use client";
import { TimesheetStatus } from "@/types/timesheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  status?: TimesheetStatus;
  startDate?: string;
  endDate?: string;
  onChange: (next: { status?: TimesheetStatus; startDate?: string; endDate?: string }) => void;
};

export default function Filters({ status, startDate, endDate, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          onChange({ status: value === "all" ? undefined : (value as TimesheetStatus) })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="incomplete">Incomplete</SelectItem>
          <SelectItem value="missing">Missing</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={startDate ?? ""}
        onChange={(e) => onChange({ startDate: e.target.value || undefined })}
        className="w-[170px]"
        placeholder="Start date"
      />
      <Input
        type="date"
        value={endDate ?? ""}
        onChange={(e) => onChange({ endDate: e.target.value || undefined })}
        className="w-[170px]"
        placeholder="End date"
      />
    </div>
  );
}
