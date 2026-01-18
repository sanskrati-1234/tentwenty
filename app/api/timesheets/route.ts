import { NextResponse } from "next/server";
import {
  createTimesheet,
  listTimesheets,
} from "@/lib/data/timesheetsStore";
import { TimesheetStatus } from "@/types/timesheet";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as TimesheetStatus | null;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "5");

  const data = listTimesheets({
    status: status ?? undefined,
    startDate,
    endDate,
    page: Number.isNaN(page) ? 1 : page,
    pageSize: Number.isNaN(pageSize) ? 5 : pageSize,
  });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const errors: string[] = [];

  if (!body.week || Number.isNaN(Number(body.week))) {
    errors.push("Week is required and must be a number.");
  }
  if (!body.startDate) errors.push("Start date is required.");
  if (!body.endDate) errors.push("End date is required.");
  if (body.startDate && body.endDate) {
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    if (start > end) errors.push("Start date must be before end date.");
  }
  if (body.totalHours === undefined || Number.isNaN(Number(body.totalHours))) {
    errors.push("Total hours is required and must be a number.");
  }
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const created = createTimesheet({
    week: Number(body.week),
    startDate: body.startDate,
    endDate: body.endDate,
    totalHours: Number(body.totalHours),
    status: body.status,
    notes: body.notes,
  });

  return NextResponse.json(created, { status: 201 });
}
