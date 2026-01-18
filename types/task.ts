export interface Task {
  id: string;
  timesheetId: string;
  date: string; // "2024-01-21"
  project: string;
  type: string;
  description: string;
  hours: number;
}
