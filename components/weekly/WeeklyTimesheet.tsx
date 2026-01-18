"use client";

import { useEffect, useMemo, useState } from "react";
import { Task } from "@/types/task";
import DaySection from "./Daysection";
import TaskModal from "../modals/TaskModal";

type Props = {
  timesheetId: string | null;
};

export default function WeeklyTimesheet({ timesheetId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeDate, setActiveDate] = useState<string>("");

  const groupedByDate = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((acc, task) => {
      acc[task.date] = acc[task.date] || [];
      acc[task.date].push(task);
      return acc;
    }, {});
  }, [tasks]);

  useEffect(() => {
    if (!timesheetId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/timesheets/${timesheetId}/entries`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load entries");
        const data = await res.json();
        setTasks(data.items);
      } catch (err) {
        console.error(err);
        setError("Unable to load entries.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [timesheetId]);

  const addEntry = async (payload: Omit<Task, "id">) => {
    if (!timesheetId) return;
    await fetch(`/api/timesheets/${timesheetId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // refresh
    const res = await fetch(`/api/timesheets/${timesheetId}/entries`, { cache: "no-store" });
    const data = await res.json();
    setTasks(data.items);
  };

  const updateEntry = async (payload: Omit<Task, "id"> & { id: string }) => {
    await fetch(`/api/timesheets/${timesheetId}/entries`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await fetch(`/api/timesheets/${timesheetId}/entries`, { cache: "no-store" });
    const data = await res.json();
    setTasks(data.items);
  };

  const deleteEntry = async (taskId: string) => {
    await fetch(`/api/timesheets/${timesheetId}/entries?id=${taskId}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">This week’s timesheet</h2>
          <p className="text-sm text-muted-foreground">Entries for the selected week</p>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading entries…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No entries yet. Add your first task.</p>
      )}

      <div className="space-y-6 mt-4">
        {Object.entries(groupedByDate).map(([date, dayTasks]) => (
          <DaySection
            key={date}
            date={date}
            tasks={dayTasks}
            timesheetId={timesheetId || ""}
            onAdd={addEntry}
            onDelete={deleteEntry}
            onEdit={(task) => {
              setActiveTask(task);
              setActiveDate(task.date);
              setModalMode("edit");
              setModalOpen(true);
            }}
            onView={(task) => {
              setActiveTask(task);
              setActiveDate(task.date);
              setModalMode("view");
              setModalOpen(true);
            }}
          />
        ))}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={activeDate || activeTask?.date || ""}
        timesheetId={timesheetId || ""}
        initial={activeTask}
        mode={modalMode}
        onSubmit={async (payload) => {
          if (modalMode === "edit" && payload.id) {
            await updateEntry(payload as Omit<Task, "id"> & { id: string });
          } else {
            await addEntry(payload);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
}
