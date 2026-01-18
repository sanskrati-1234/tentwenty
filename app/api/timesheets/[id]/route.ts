import { NextResponse } from "next/server";
import { getTimesheet, updateTimesheet } from "@/lib/data/timesheetsStore";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const timesheet = getTimesheet(id);
  if (!timesheet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(timesheet);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const { id } = await context.params;
  const timesheet = updateTimesheet(id, body);
  if (!timesheet) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(timesheet);
}
