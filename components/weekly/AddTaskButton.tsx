"use client";

import TaskModal from "@/components/modals/TaskModal";
import { Task } from "@/types/task";
import { useState } from "react";

type Props = {
  date: string;
  timesheetId: string;
  onAdd: (payload: Omit<Task, "id">) => Promise<void>;
};

export default function AddTaskButton({ date, timesheetId, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full border border-dashed rounded-lg py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
      >
        + Add new task
      </button>

      <TaskModal
        open={open}
        onClose={() => setOpen(false)}
        date={date}
        timesheetId={timesheetId}
        onSubmit={async (payload) => {
          await onAdd(payload);
        }}
      />
    </>
  );
}
