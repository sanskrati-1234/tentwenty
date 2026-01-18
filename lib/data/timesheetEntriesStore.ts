import { Task } from "@/types/task";

const initialEntries: Task[] = [
  {
    id: "t1",
    timesheetId: "1",
    date: "2024-01-21",
    project: "Homepage Development",
    type: "Development",
    description: "Build hero section",
    hours: 4,
  },
  {
    id: "t2",
    timesheetId: "1",
    date: "2024-01-21",
    project: "Homepage Development",
    type: "Bug fixes",
    description: "Polish navigation interactions",
    hours: 2,
  },
  {
    id: "t3",
    timesheetId: "1",
    date: "2024-01-22",
    project: "Homepage Development",
    type: "Development",
    description: "Finish CTA block",
    hours: 3,
  },
  {
    id: "t4",
    timesheetId: "1",
    date: "2024-01-22",
    project: "Homepage Development",
    type: "Review",
    description: "Review QA feedback",
    hours: 1,
  },
  {
    id: "t5",
    timesheetId: "1",
    date: "2024-01-23",
    project: "Homepage Development",
    type: "Development",
    description: "Implement pricing cards",
    hours: 4,
  },
  {
    id: "t6",
    timesheetId: "1",
    date: "2024-01-23",
    project: "Homepage Development",
    type: "Bug fixes",
    description: "Tweak responsive spacing",
    hours: 2,
  },
  {
    id: "t7",
    timesheetId: "1",
    date: "2024-01-24",
    project: "Homepage Development",
    type: "Development",
    description: "Build testimonials slider",
    hours: 4,
  },
  {
    id: "t8",
    timesheetId: "1",
    date: "2024-01-24",
    project: "Homepage Development",
    type: "Bug fixes",
    description: "Fix slider dots alignment",
    hours: 1,
  },
  {
    id: "t9",
    timesheetId: "1",
    date: "2024-01-24",
    project: "Homepage Development",
    type: "Review",
    description: "Client handoff notes",
    hours: 1,
  },
  {
    id: "t10",
    timesheetId: "1",
    date: "2024-01-25",
    project: "Homepage Development",
    type: "Development",
    description: "Finalize footer",
    hours: 3,
  },
  {
    id: "t11",
    timesheetId: "3",
    date: "2024-01-15",
    project: "Dashboard",
    type: "Bug fixes",
    description: "Fix pagination alignment",
    hours: 2,
  },
];

let entries = [...initialEntries];

export function listEntries(timesheetId: string) {
  return entries.filter((t) => t.timesheetId === timesheetId);
}

export function createEntry(input: Omit<Task, "id">): Task {
  const entry: Task = { ...input, id: crypto.randomUUID() };
  entries.push(entry);
  return entry;
}

export function updateEntry(id: string, input: Partial<Omit<Task, "id">>): Task | null {
  const idx = entries.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const next = { ...entries[idx], ...input };
  entries[idx] = next;
  return next;
}

export function deleteEntry(id: string) {
  entries = entries.filter((t) => t.id !== id);
}

export function resetEntries() {
  entries = [...initialEntries];
}
