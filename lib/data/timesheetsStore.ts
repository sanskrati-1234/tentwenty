import { Timesheet, TimesheetStatus } from "@/types/timesheet";

type ListParams = {
  status?: TimesheetStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

type TimesheetInput = Omit<
  Timesheet,
  "id" | "createdAt" | "updatedAt" | "status"
> & { status?: TimesheetStatus };

const staticTimestamp = "2024-01-01T00:00:00.000Z";

const initialTimesheets: Timesheet[] = [
  {
    id: "1",
    week: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    totalHours: 40,
    status: "completed",
    createdAt: staticTimestamp,
    updatedAt: staticTimestamp,
  },
  {
    id: "2",
    week: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    totalHours: 40,
    status: "completed",
    createdAt: staticTimestamp,
    updatedAt: staticTimestamp,
  },
  {
    id: "3",
    week: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    totalHours: 32,
    status: "incomplete",
    createdAt: staticTimestamp,
    updatedAt: staticTimestamp,
  },
  {
    id: "4",
    week: 4,
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    totalHours: 40,
    status: "completed",
    createdAt: staticTimestamp,
    updatedAt: staticTimestamp,
  },
  {
    id: "5",
    week: 5,
    startDate: "2024-01-28",
    endDate: "2024-02-01",
    totalHours: 0,
    status: "missing",
    createdAt: staticTimestamp,
    updatedAt: staticTimestamp,
  },
];

let timesheets: Timesheet[] = [...initialTimesheets];

function isWithinRange(date: string, start?: string, end?: string) {
  const ts = new Date(date).getTime();
  if (Number.isNaN(ts)) return false;
  if (start && ts < new Date(start).getTime()) return false;
  if (end && ts > new Date(end).getTime()) return false;
  return true;
}

export function listTimesheets(params: ListParams) {
  const { status, startDate, endDate, page = 1, pageSize = 5 } = params;

  const filtered = timesheets.filter((item) => {
    const statusOk = status ? item.status === status : true;
    const startOk = startDate ? isWithinRange(item.startDate, startDate) : true;
    const endOk = endDate ? isWithinRange(item.endDate, undefined, endDate) : true;
    return statusOk && startOk && endOk;
  });

  const total = filtered.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  return {
    items: filtered.slice(startIdx, endIdx),
    total,
    page,
    pageSize,
  };
}

export function createTimesheet(input: TimesheetInput): Timesheet {
  const now = new Date().toISOString();
  const timesheet: Timesheet = {
    id: crypto.randomUUID(),
    week: input.week,
    startDate: input.startDate,
    endDate: input.endDate,
    totalHours: input.totalHours,
    status: input.status ?? "incomplete",
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  timesheets.unshift(timesheet);
  return timesheet;
}

export function updateTimesheet(
  id: string,
  input: Partial<TimesheetInput>
): Timesheet | null {
  const index = timesheets.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const next = {
    ...timesheets[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  timesheets[index] = next;
  return next;
}

export function getTimesheet(id: string) {
  return timesheets.find((t) => t.id === id) ?? null;
}

export function resetTimesheets() {
  timesheets = [...initialTimesheets];
}

export function seedTimesheets(seed: Timesheet[]) {
  timesheets = [...seed];
}
