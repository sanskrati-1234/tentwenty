import {
  listTimesheets,
  createTimesheet,
  updateTimesheet,
  resetTimesheets,
  seedTimesheets,
} from "./timesheetsStore";
import { Timesheet } from "@/types/timesheet";

const seed: Timesheet[] = [
  {
    id: "a",
    week: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    totalHours: 40,
    status: "completed",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "b",
    week: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    totalHours: 32,
    status: "incomplete",
    createdAt: "",
    updatedAt: "",
  },
];

describe("timesheetsStore", () => {
  beforeEach(() => {
    seedTimesheets(seed);
  });

  afterAll(() => {
    resetTimesheets();
  });

  it("lists timesheets with pagination", () => {
    const { items, total } = listTimesheets({ page: 1, pageSize: 1 });
    expect(total).toBe(2);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("a");
  });

  it("filters by status", () => {
    const { items } = listTimesheets({ status: "incomplete" });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("b");
  });

  it("creates and updates timesheets", () => {
    const created = createTimesheet({
      week: 3,
      startDate: "2024-01-15",
      endDate: "2024-01-19",
      totalHours: 20,
      status: "missing",
    });
    expect(created.id).toBeTruthy();

    const updated = updateTimesheet(created.id, { status: "completed" });
    expect(updated?.status).toBe("completed");
  });
});
