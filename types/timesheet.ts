export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface Timesheet {
  id: string;
  week: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  totalHours: number;
  status: TimesheetStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
