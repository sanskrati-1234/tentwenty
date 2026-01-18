"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Filters from "./Filters";
import TimesheetTable from "./TimesheetTable";
import Pagination from "./Pagination";
import TimesheetModal from "./TimesheetModal";
import WeeklyTimesheet from "@/components/weekly/WeeklyTimesheet";
import { Timesheet, TimesheetStatus } from "@/types/timesheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApiResponse = {
  items: Timesheet[];
  total: number;
  page: number;
  pageSize: number;
};

export default function DashboardClient() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [filters, setFilters] = useState<{
    status?: TimesheetStatus;
    startDate?: string;
    endDate?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<Timesheet | null>(null);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>("1");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    return params.toString();
  }, [filters, page, pageSize]);

  const fetchTimesheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/timesheets?${queryString}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to load timesheets");
      }
      const data: ApiResponse = await res.json();
      setTimesheets(data.items);
      setTotal(data.total);

      if (data.items.length === 0) {
        setSelectedTimesheetId(null);
      } else if (
        !selectedTimesheetId ||
        !data.items.some((t) => t.id === selectedTimesheetId)
      ) {
        setSelectedTimesheetId(data.items[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load timesheets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [queryString]);

  const openCreate = () => {
    setActive(null);
    setModalOpen(true);
  };

  const openEdit = (item?: Timesheet) => {
    if (item) setSelectedTimesheetId(item.id);
    setActive(item ?? null);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: {
    week: number;
    startDate: string;
    endDate: string;
    totalHours: number;
    status: TimesheetStatus;
    notes?: string;
  }) => {
    const method = active ? "PUT" : "POST";
    const url = active ? `/api/timesheets/${active.id}` : "/api/timesheets";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = body?.errors?.join(", ") || "Failed to save timesheet.";
      throw new Error(msg);
    }
    await fetchTimesheets();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Your Timesheets</h1>
          <p className="text-sm text-muted-foreground">Track weekly submissions</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <Filters
            status={filters.status}
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={(next) => {
              setFilters((f) => ({ ...f, ...next }));
              setPage(1);
            }}
          />
          <Select
            value={selectedTimesheetId ?? ""}
            onValueChange={(value) => setSelectedTimesheetId(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {timesheets.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  Week {t.week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>Add timesheet</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 text-red-700 text-sm p-3">{error}</div>
        )}
        <TimesheetTable timesheets={timesheets} loading={loading} onAction={openEdit} />
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={(next) => setPage(Math.max(1, next))}
        />
      </div>

      <TimesheetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={active}
        onSubmit={handleSubmit}
      />

      <WeeklyTimesheet timesheetId={selectedTimesheetId} />
    </div>
  );
}
