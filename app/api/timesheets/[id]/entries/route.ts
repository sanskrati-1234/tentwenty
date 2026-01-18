import { NextResponse } from "next/server";
import {
  createEntry,
  listEntries,
  updateEntry,
  deleteEntry,
} from "@/lib/data/timesheetEntriesStore";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: timesheetId } = await context.params;
  if (!timesheetId) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const items = listEntries(timesheetId);
  return NextResponse.json({ items, total: items.length });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: timesheetId } = await context.params;
  const body = await request.json();
  const errors: string[] = [];

  if (!timesheetId) errors.push("Timesheet id is required.");
  if (!body.date) errors.push("Date is required.");
  if (!body.project) errors.push("Project is required.");
  if (!body.type) errors.push("Type is required.");
  if (!body.description) errors.push("Description is required.");
  if (body.hours === undefined || Number.isNaN(Number(body.hours)) || body.hours < 0) {
    errors.push("Hours must be 0 or more.");
  }

  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  const created = createEntry({
    timesheetId,
    date: body.date,
    project: body.project,
    type: body.type,
    description: body.description,
    hours: Number(body.hours),
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const updated = updateEntry(body.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });
  deleteEntry(id);
  return NextResponse.json({ ok: true });
}
